import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import userRoute from './routes/UserRoute';
import authRoute from './routes/AuthRoute';
import * as cors from 'cors';
import decisionRoute from './routes/decisionRoute';
import optionProblemRoute from './routes/optionProblemRoute';
import optionTableRoute from './routes/optionTableRoute';

createConnection().then(async connection => {
    const app = express();
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false })) // ?
    app.use(bodyParser.json());

    // setup express app here
    app.use('/api/user', userRoute)
    app.use('/api/auth', authRoute);
    app.use('/api/decision', decisionRoute);
    app.use('/api/optionTable', optionTableRoute);
    app.use('/api/optionProblem', optionProblemRoute);

    // start express server
    app.listen(8080);

}).catch(error => console.log(error));
