import chalk from 'chalk';
import * as express from 'express';
import { User } from './models/user';

// noinspection TsLint
const defaultMessages = {
    success: {
        success: true,
    },
    fail: {
        success: false,
    },
    internalError: {
        code: 0,
        message: 'Internal server error',
        success: false,
    },
    noTokenProvided: {
        code: 1,
        message: 'Provide user token',
        success: false,
    },
};

function getErr<T>(pr: Promise<T>): Promise<T> {
    return pr.catch((err) => {
        console.log(chalk.red(JSON.stringify(err)));
        if (err.code && !err.success) {
            return Promise.reject(err);
        } else {
            return Promise.reject(defaultMessages.internalError);
        }
    });
}

function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.cookies.token && User.verifyToken(req.cookies.token)) {
        next();
    } else {
        res.status(400).send(defaultMessages.noTokenProvided);
    }
}

export { getErr, isAuthenticated };
