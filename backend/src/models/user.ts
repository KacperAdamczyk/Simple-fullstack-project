import * as bcrypt from 'bcryptjs';
import chalk from 'chalk';
import * as jwt from 'jsonwebtoken';
import { arrayProp, instanceMethod, InstanceType, ModelType, prop, staticMethod, Typegoose } from 'typegoose';
import db from '../database';
import { messages } from '../routers/user-router';

import config from '../config';

interface IPayload {
    id: string;
}

// noinspection TsLint
export class User extends Typegoose {
    @staticMethod
    public static async login(this: ModelType<User>, username: string, password: string) {
        const user = await this.findOne({ username }).exec();
        if (!user || !user.validatePassword(password)) {
            return Promise.reject(messages.invalidUsernameOrPassword);
        }
        await user.tokenGC();
        const token = user.generateToken();
        user.tokens[ user.tokens.length ] = token;
        user.markModified('tokens');
        await user.save();
        return {
            exp: Date.now() + (User.expiresIn * 1000),
            token,
        };
    }

    @staticMethod
    public static async getUserFromToken(this: ModelType<User>, token: string) {
        if (!User.verifyToken(token)) {
            return Promise.reject(null);
        }
        const payload = <IPayload> jwt.verify(token, config.tokenSecret);
        const id = payload.id;
        const user = await this.findById(id).exec();
        if (user.tokens.includes(token)) {
            return user;
        } else {
            return Promise.reject(null);
        }
    }

    @staticMethod
    public static verifyToken(token: string) {
        try {
            jwt.verify(token, config.tokenSecret);
        } catch (err) {
            return false;
        }
        return true;
    }

    @staticMethod
    public static async revokeTokens(this: ModelType<User>, token: string) {
        const user = await UserModel.getUserFromToken(token);
        if (!user) {
            return;
        }
        user.tokens = [];
        user.markModified('tokens');
        return await user.save();
    }

    private static expiresIn = 60 * 60 * 24; // 24h

    @staticMethod
    private static hashPassword(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    @arrayProp({ items: String })
    public tokens: string[];

    @prop({ unique: true, required: true })
    private username: string;

    @prop()
    private password: string;

    @instanceMethod
    public async add(this: InstanceType<User>, username: string, password: string) {
        const potentialUser = await UserModel.findOne({ username });
        if (potentialUser) {
            return Promise.reject(messages.usernameAlreadyTaken);
        }
        this.username = username;
        this.password = User.hashPassword(password);
        console.log(chalk.blue(`Attempting to create new user: ${this.username}`));
        await this.save();
    }

    @instanceMethod
    public validatePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

    @instanceMethod
    private generateToken(this: InstanceType<User>): string {
        return jwt.sign({ id: this.id }, config.tokenSecret, { expiresIn: User.expiresIn });
    }

    @instanceMethod
    private async tokenGC(this: InstanceType<User>) {
        let change = false;
        const tokensGC = this.tokens.filter((token) => {
            change = true;
            return User.verifyToken(token);
        });
        if (change) {
            this.tokens = tokensGC;
            this.markModified('tokens');
            await this.save();
        }
    }
}

const UserModel = new User().getModelForClass(User,
    {
        existingConnection: db.mongoose.connection,
        existingMongoose: db.mongoose,
    });

export default UserModel;
