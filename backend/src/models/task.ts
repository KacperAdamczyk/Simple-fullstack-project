import chalk from 'chalk';
import { instanceMethod, InstanceType, ModelType, prop, Ref, staticMethod, Typegoose } from 'typegoose';
import db from '../database';
import UserModel, { User } from '../models/user';
import { messages as taskMessages } from '../routers/task-router';
import { messages as userMessages } from '../routers/user-router';

class Task extends Typegoose {
    @staticMethod
    public static async getTasksFromToken(this: ModelType<Task>, token: string) {
        try {
            const user = await UserModel.getUserFromToken(token);
            return this.find({ user }).exec();
        } catch (err) {
            return Promise.reject(taskMessages.invalidToken);
        }
    }

    @staticMethod
    public static async getOne(this: ModelType<Task>, token: string, id: string) {
        try {
            const tasks = await TaskModel.getTasksFromToken(token);
            const task = tasks.filter((t) => t._id.toString() === id.toString());
            if (task.length === 1) {
                return task[ 0 ];
            } else {
                return null;
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }

    @staticMethod
    public static async put(this: ModelType<Task>, token: string, id: string, name: string,
                            description?: string, highlighted?: boolean, done?: boolean, doneAt?: number) {
        try {
            const task = await this.findById(id).exec();
            const user = await UserModel.getUserFromToken(token);
            if (task && task.user.toString() !== user._id.toString()) {
                return Promise.reject(taskMessages.accessDenied);
            }
            task.name = name;
            task.description = description;
            task.highlighted = highlighted;
            task.done = done;
            task.doneAt = doneAt;
            await task.save();
        } catch (err) {
            console.log(err);
            if (err === null) {
                return Promise.reject(userMessages.userNotFound);
            } else {
                return Promise.reject(taskMessages.accessDenied);
            }
        }
    }

    @staticMethod
    public static async delete(this: ModelType<Task>, token: string, id: string) {
        try {
            const task = await this.findById(id).exec();
            const user = await UserModel.getUserFromToken(token);
            if (task && task.user.toString() !== user._id.toString()) {
                return Promise.reject(taskMessages.accessDenied);
            }
            await task.remove();
        } catch (err) {
            console.log(err);
            if (err === null) {
                return Promise.reject(userMessages.userNotFound);
            } else {
                return Promise.reject(taskMessages.accessDenied);
            }
        }
    }

    @prop()
    private name: string;
    @prop()
    private description?: string;
    @prop({ default: false })
    private done?: boolean;
    @prop({ default: false })
    private highlighted?: boolean;

    @prop()
    private doneAt?: number;

    @prop({ ref: User })
    private user: Ref<User>;

    @instanceMethod
    public async add(this: InstanceType<Task>, token: string, name: string,
                     description?: string, highlighted?: boolean) {
        try {
            const user = await UserModel.getUserFromToken(token);
            this.user = <Ref<User>> user;
            this.name = name;
            this.description = description;
            this.highlighted = highlighted;
            console.log(chalk.blue(`Attempting to create new task: ${this.name}`));
            await this.save();
        } catch (err) {
            return Promise.reject(userMessages.userNotFound);
        }
    }
}

const TaskModel = new Task().getModelForClass(Task,
    {
        existingConnection: db.mongoose.connection,
        existingMongoose: db.mongoose,
    });

export default TaskModel;
