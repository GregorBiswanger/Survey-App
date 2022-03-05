import db from './db';
const COLLECTION_NAME = 'surveys';

async function loadAll() {
    return await dbCollection().find().toArray();
}

async function save(survey) {
    return await dbCollection().insertOne(survey);
}

function dbCollection() {
    return db().collection(COLLECTION_NAME);
}

export default {
    save,
    loadAll
}