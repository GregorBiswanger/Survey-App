import { ObjectId } from 'mongodb';
import { ActiveSurvey } from './active-surveys-repository';
import db from './db';
const COLLECTION_NAME = 'surveys-history';

async function save(activeSurvey: ActiveSurvey) {
    let surveyHistory: SurveyHistory = { ...activeSurvey };
    delete surveyHistory['connectCode'];

    const result = await dbCollection().insertOne(surveyHistory);
    
    return result.acknowledged;
}

export default {
    save
}

function dbCollection() {
    return db().collection<SurveyHistory>(COLLECTION_NAME);
}

export interface SurveyHistory {
    _id?: string | ObjectId;
    totalVotesCount: number;
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