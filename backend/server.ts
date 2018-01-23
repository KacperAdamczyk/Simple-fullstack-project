'use strict';
/* Imports */
import * as bodyParser from 'body-parser';
import chalk from 'chalk';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as path from 'path';

/* Local imports */
import config from './src/config';
import db from './src/database';
import router from './src/routers/router';
import taskRouter from './src/routers/task-router';
import userRouter from './src/routers/user-router';

/* Configuration */
const server = express();
db.connect();

server.use(express.static(path.join(__dirname, 'dist')));
server.use(helmet());
server.use(cors({ credentials: true, origin: config.angularDevUrl }));
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(morgan('dev'));

server.use(db.downProtector);
server.use(userRouter());
server.use(taskRouter());
server.use(router);

/* Starting */
console.log(chalk.green('\nStarting the server... \n'));
server.listen(config.port, () => console.log(chalk.green(`Server started on port ${config.port}! \n`)));
