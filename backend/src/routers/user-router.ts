/* Dependencies */
import * as express from 'express';

import { getErr } from '../common';
import User from '../models/user';

// noinspection TsLint
const messages = {
    success: {
        success: true,
    },
    fail: {
        success: false,
    },
    wrapSuccess(message: string | object) {
        return {
            message,
            success: true,
        };
    },
    internalError: {
        code: 0,
        message: 'Internal server error',
        success: false,
    },
    emptyName: {
        code: 1,
        message: 'Empty username and/or password',
        success: false,
    },
    emptyToken: {
        code: 2,
        message: 'Empty token',
        success: false,
    },
    invalidUsernameOrPassword: {
        code: 3,
        message: 'Invalid username or password',
        success: false,
    },
    usernameAlreadyTaken: {
        code: 4,
        message: 'Username already taken',
        success: false,
    },
    userNotFound: {
        code: 5,
        message: 'User not found',
        success: false,
    },
};

export default () => {
    const router = express.Router();

    router.post('/login', (req, res) => {
        if (!req.body.username || !req.body.password) {
            return res.status(400).send(messages.emptyName);
        }
        getErr(User.login(req.body.username, req.body.password))
            .then((token) => {
                res.status(200).send(messages.wrapSuccess(token));
            }, (err) => res.status(400).send(err));
    });

    router.post('/users', (req, res) => {
        if (!req.body.username || !req.body.password) {
            return res.status(400).send(messages.emptyName);
        }
        const user = new User();
        getErr(user.add(req.body.username, req.body.password))
            .then(() => res.status(201).send(messages.success),
                (err) => res.status(400).send(err),
            );
    });

    return router;
};

export { messages };
