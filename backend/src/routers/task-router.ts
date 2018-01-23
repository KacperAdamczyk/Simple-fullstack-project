import * as express from 'express';

import { getErr, isAuthenticated } from '../common';
import Task from '../models/task';

// noinspection TsLint
const messages = {
    success: {
        success: true,
    },
    fail: {
        success: false,
    },
    wrapSuccess(message: any) {
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
        message: 'Empty task name',
        success: false,
    },
    invalidToken: {
        code: 2,
        message: 'Provided token is invalid',
        success: false,
    },
    accessDenied: {
        code: 3,
        message: 'Access denied',
        success: false,
    },
    provideId: {
        code: 4,
        message: 'Provide task id',
        success: false,
    }
};

export default () => {
    const router = express.Router();

    router.post('/tasks', isAuthenticated, (req, res) => {
        if (!req.body.name) {
            return res.status(400).send(messages.emptyName);
        }
        const task = new Task();
        getErr(task.add(req.cookies.token, req.body.name, req.body.description, req.body.highlighted))
            .then(() => {
                res.status(200).send(messages.success);
            }, (err) => res.status(400).send(err));
    });

    router.get('/tasks', isAuthenticated, (req, res) => {
        getErr(Task.getTasksFromToken(req.cookies.token))
            .then((task) => res.status(200).send(messages.wrapSuccess(task)),
                (err) => res.status(400).send(err));
    });

    router.get('/tasks/:id', isAuthenticated, (req, res) => {
        if (!req.params.id) {
            return res.status(400).send(messages.provideId);
        }
        getErr(Task.getOne(req.cookies.token, req.params.id))
            .then((tasks) => res.status(200).send(messages.wrapSuccess(tasks)),
                (err) => res.status(400).send(err));
    });

    router.put('/tasks', isAuthenticated, (req, res) => {
        if (!req.body._id || !req.body.name) {
            return res.status(400).send(messages.emptyName);
        }
        getErr(Task.put(req.cookies.token, req.body._id, req.body.name, req.body.description, req.body.highlighted,
            req.body.done, req.body.doneAt))
            .then(() => res.status(200).send(messages.success),
                (err) => res.status(400).send(err));
    });

    router.delete('/tasks/:id', isAuthenticated, (req, res) => {
        if (!req.params.id) {
            return res.status(400).send(messages.provideId);
        }
        getErr(Task.delete(req.cookies.token, req.params.id))
            .then(() => res.status(200).send(messages.success),
                (err) => res.status(400).send(err));
    });

    return router;
};

export { messages };
