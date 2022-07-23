"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const Users_1 = require("../entities/Users");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const constants_1 = require("../constants");
const RegisterInputs_1 = require("./inputTypes/RegisterInputs");
const LoginInputs_1 = require("./inputTypes/LoginInputs");
const validateRegister_1 = require("../utils/validateRegister");
const sendEmail_1 = require("../utils/sendEmail");
const uuid_1 = require("uuid");
const typeorm_config_1 = __importDefault(require("../typeorm.config"));
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Users_1.Users, { nullable: true }),
    __metadata("design:type", Users_1.Users)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    register(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, validateRegister_1.validateRegister)(options);
            if (errors) {
                return { errors };
            }
            const hashsedPassword = yield argon2_1.default.hash(options.password);
            const usernameTaken = yield Users_1.Users.findOne({
                where: { username: options.username },
            });
            if (!usernameTaken) {
                const result = yield typeorm_config_1.default
                    .createQueryBuilder()
                    .insert()
                    .into(Users_1.Users)
                    .values([
                    {
                        username: options.username,
                        password: hashsedPassword,
                        email: options.email,
                    },
                ])
                    .returning('*')
                    .execute();
                const user = result.raw[0];
                req.session.userId = user.id;
                console.log('cookie:', req.session);
                return { user };
            }
            else {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'Username already taken.',
                        },
                    ],
                };
            }
        });
    }
    login(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users_1.Users.findOne(options.usernameOrEmail.includes('@')
                ? { where: { email: options.usernameOrEmail } }
                : { where: { username: options.usernameOrEmail } });
            if (!user) {
                return {
                    errors: [
                        {
                            field: 'usernameOrEmail',
                            message: "That username doesn't exist",
                        },
                    ],
                };
            }
            const valid = yield argon2_1.default.verify(user.password, options.password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: 'password',
                            message: 'Incorrect password',
                        },
                    ],
                };
            }
            req.session.userId = user.id;
            console.log('cookie:', req.session);
            console.log('sessionID', req.sessionID);
            return {
                user,
            };
        });
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            console.log('removed cookie');
            console.log('cookie:', req.session);
            console.log('sessionID:', req.session);
            resolve(true);
        }));
    }
    me({ req }) {
        console.log('me query cookie:', req.session);
        if (!req.session.userId) {
            return null;
        }
        return Users_1.Users.findOne({ where: { id: req.session.userId } });
    }
    forgotPassword(email, { redisClient }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users_1.Users.findOne({ where: { email: email } });
            if (!user) {
                return false;
            }
            const token = (0, uuid_1.v4)();
            redisClient.set(constants_1.FORGET_PASSWORD_PREFIX + token, user.id, 'EX', 1000 * 60 * 60 * 24 * 2);
            yield (0, sendEmail_1.sendEmail)(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);
            return true;
        });
    }
    changePassword(token, newPassword, { req, redisClient }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newPassword.length <= 3) {
                return {
                    errors: [
                        {
                            field: 'newPassword',
                            message: 'Length must be greater than 3',
                        },
                    ],
                };
            }
            const key = constants_1.FORGET_PASSWORD_PREFIX + token;
            const userId = yield redisClient.get(key);
            if (!userId) {
                return {
                    errors: [
                        {
                            field: 'token',
                            message: 'token expired',
                        },
                    ],
                };
            }
            const userIdNum = parseInt(userId);
            const user = yield Users_1.Users.findOne({
                where: { id: userIdNum },
            });
            if (!user) {
                return {
                    errors: [
                        {
                            field: 'token',
                            message: 'user no longer exists',
                        },
                    ],
                };
            }
            Users_1.Users.update({ id: userIdNum }, { password: yield argon2_1.default.hash(newPassword) });
            redisClient.del(key);
            req.session.userId = user.id;
            return { user };
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInputs_1.RegisterInputs, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInputs_1.LoginInputs, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Query)(() => Users_1.Users, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('token')),
    __param(1, (0, type_graphql_1.Arg)('newPassword')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=users.js.map