import { ObjectId } from 'mongodb';
import db from './db';
import { calcVoteInPercentAggregate, voteAggregate } from './aggregates/update.aggregates';
import surveysRepository from './surveys-repository';
const COLLECTION_NAME = 'active-surveys';

async function save(options: StartSurveyOptions, connectCode: string) {
    const survey = await surveysRepository.loadOne(options.surveyId);

    if (survey) {
        const { surveyId, ...optionsOtherThanId } = options;
        let activeSurvey: ActiveSurvey = {
            connectCode,
            totalVotesCount: 0,
            options: optionsOtherThanId,
            survey: {
                _id: survey._id, 
                 question: survey.question,
                answers: survey.answers.map<VoteAnswer>(answer => ({
                    answer,
                    voteCount: 0,
                    voteInPercent: 0
                })),
            }
        }

        await dbCollection().insertOne(activeSurvey);

        if (activeSurvey.options.duration) {
            activeSurvey = addRemainingTime(activeSurvey);
        }

        return activeSurvey;
    }

    throw new Error(`Survey with id ${options.surveyId} does not exist.`);
}

async function load(connectCode: string) {
    let activeSurvey = await dbCollection().findOne({ connectCode });
    if (activeSurvey && activeSurvey.options.duration) {
        activeSurvey = addRemainingTime(activeSurvey);
    }
    return activeSurvey;
}

async function loadFromSurveyId(surveyId: string) {
    const activeSurveys = await dbCollection().find({ "survey._id": new ObjectId(surveyId) }).toArray();

    return activeSurveys;
}

async function existsConnectCode(connectCode: string) {
    return await dbCollection().countDocuments({ connectCode }, { limit: 1 }) > 0;
}

async function updateVote(activeSurveyId: string, answerVoteIndex: number) {
    const modifyResult = await dbCollection().findOneAndUpdate({ _id: new ObjectId(activeSurveyId) }, [
        voteAggregate(answerVoteIndex), calcVoteInPercentAggregate()
    ], {
        returnDocument: 'after'
    });

    let activeSurvey = modifyResult.value;
    if (activeSurvey && activeSurvey.options.duration) {
        activeSurvey = addRemainingTime(activeSurvey);
    }
    return activeSurvey;
}

async function remove(connectCode: string) {
    await dbCollection().deleteOne({ connectCode });
}

function dbCollection() {
    return db().collection<ActiveSurvey>(COLLECTION_NAME);
}

function addRemainingTime<T extends ActiveSurvey>(activeSurvey: T): T {
    const durationInMs = activeSurvey.options.duration;
    if (!durationInMs) {
        return activeSurvey;
    }

    const runningForTimeInMs = Date.now() - (activeSurvey._id as ObjectId).getTimestamp().getTime();
    return {
        ...activeSurvey,
        remainingTimeMs: Math.max(durationInMs - runningForTimeInMs, 0),
    };
}

export default {
    save,
    load,
    loadFromSurveyId,
    existsConnectCode,
    updateVote,
    remove
}

export interface ActiveSurvey {
    _id?: string | ObjectId;
    totalVotesCount: number;
    connectCode: string;
    options: Omit<StartSurveyOptions, 'surveyId'>;
    survey: VoteSurvey;
    remainingTimeMs?: number;
}

export interface VoteSurvey {
    _id: string | ObjectId;
    question: string;
    answers: VoteAnswer[];
}

export interface VoteAnswer {
    answer: string;
    voteCount: number;
    voteInPercent: number;
}

export interface StartSurveyOptions {
    surveyId: string,
    duration: number
}