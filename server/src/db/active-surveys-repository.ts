import { ObjectId } from 'mongodb';
import db from './db';
import { calcVoteInPercentAggregate, voteAggregate } from './aggregates/update.aggregates';
import surveysRepository from './surveys-repository';
const COLLECTION_NAME = 'active-surveys';

async function save(surveyId: string, connectCode: string) {
    const survey = await surveysRepository.loadOne(surveyId);

    if (survey) {
        const activeSurvey: ActiveSurvey = {
            connectCode,
            totalVotesCount: 0,
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
        return activeSurvey;
    }

    throw new Error(`Survey with id ${surveyId} does not exist.`);
}

async function existsConnectCode(connectCode: string) {
    return await dbCollection().countDocuments({ connectCode }, { limit: 1 }) > 0;
}

async function updateVote(activeSurveyId: string, answerVoteIndex: number) {
    const activeSurvey = await dbCollection().findOneAndUpdate({ _id: new ObjectId(activeSurveyId) }, [
        voteAggregate(answerVoteIndex), calcVoteInPercentAggregate()
    ], {
        returnDocument: 'after'
    });

    return activeSurvey.value;
}

function dbCollection() {
    return db().collection<ActiveSurvey>(COLLECTION_NAME);
}

export default {
    save,
    existsConnectCode,
    updateVote
}

export interface ActiveSurvey {
    _id?: string | ObjectId;
    totalVotesCount: number;
    connectCode: string;
    survey: VoteSurvey;
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