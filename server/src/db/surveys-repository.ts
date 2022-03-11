import { ObjectId } from 'mongodb';
import db from './db';
const COLLECTION_NAME = 'surveys';

async function loadAll() {
    return await dbCollection().find().toArray();
}

async function loadOne(surveyId: string) {
    return await dbCollection().findOne({ _id: new ObjectId(surveyId) });
}

async function save(survey) {
    return await dbCollection().insertOne(survey);
}

function dbCollection() {
    return db().collection<Survey>(COLLECTION_NAME);
}

export default {
    save,
    loadAll,
    loadOne
}

export interface Survey {
    _id: string | ObjectId;
    question: string;
    answers: string[];
}