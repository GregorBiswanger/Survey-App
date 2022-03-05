import * as express from 'express';
import { connectToDatabase } from './db/db';
import * as createError from 'http-errors';
import handleErrors from './middlewares/handle-errors';
import api from './api/api';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', api);

app.use((request, response, next) => {
    next(new createError.NotFound());
});
app.use(handleErrors);

connectToDatabase().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('Listening on port', PORT);
    });
}).catch(error => {
    console.error(error);
    process.exit();
});