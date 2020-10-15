import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import userRoute from './routes/UserRoute';
import authRoute from './routes/AuthRoute';


createConnection().then(async connection => {
    const app = express();
    app.use(express.json());

    // setup express app here
    app.use('/api/user', userRoute)
    app.use('/api/auth', authRoute);

    // start express server
    app.listen(8080);

    console.log("Express server has started on port 8000. Open http://localhost:8000/users to see results");

}).catch(error => console.log(error));
