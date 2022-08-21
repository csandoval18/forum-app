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
exports.PostResolver = void 0;
const Upvotes_1 = require("../entities/Upvotes");
const type_graphql_1 = require("type-graphql");
const Posts_1 = require("../entities/Posts");
const isAuth_1 = require("../middleware/isAuth");
const typeorm_config_1 = __importDefault(require("../typeorm.config"));
const Users_1 = require("../entities/Users");
let PostInput = class PostInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "text", void 0);
PostInput = __decorate([
    (0, type_graphql_1.InputType)()
], PostInput);
let PaginatedPosts = class PaginatedPosts {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Posts_1.Posts]),
    __metadata("design:type", Array)
], PaginatedPosts.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginatedPosts.prototype, "hasMore", void 0);
PaginatedPosts = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedPosts);
let PostResolver = class PostResolver {
    textSnippet(post) {
        return post.text.slice(0, 50);
    }
    creator(post, { userLoader }) {
        return userLoader.load(post.creatorId);
    }
    posts(limit, cursor, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const realLimit = Math.min(50, limit);
            const realLimitPlusOne = realLimit + 1;
            const replacements = [realLimitPlusOne];
            const { userId } = req.session;
            if (userId)
                replacements.push(userId);
            let cursorIdx = 3;
            if (cursor) {
                replacements.push(new Date(parseInt(cursor)));
                cursorIdx = replacements.length;
            }
            const posts = yield typeorm_config_1.default.query(`
      SELECT p.*,
      ${req.session.userId
                ? '(SELECT value FROM upvotes WHERE "userId" = $2 AND "postId" = p.id) "voteStatus"'
                : 'null as "voteStatus"'}
      FROM posts p 
      INNER JOIN users u ON u.id = p."creatorId"
      ${cursor ? `WHERE p."createdAt" < $${cursorIdx}` : ''}
      ORDER BY p."createdAt" DESC
      LIMIT $1
      `, replacements);
            return {
                posts: posts.slice(0, realLimit),
                hasMore: posts.length === realLimitPlusOne,
            };
        });
    }
    post(id) {
        return Posts_1.Posts.findOne({ where: { id } });
    }
    createPost(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            return Posts_1.Posts.create(Object.assign(Object.assign({}, input), { creatorId: req.session.userId })).save();
        });
    }
    updatePost(id, title, text, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield typeorm_config_1.default
                .createQueryBuilder()
                .update(Posts_1.Posts)
                .set({ title, text })
                .where('id = :id AND "creatorId" = :creatorId', {
                id,
                creatorId: req.session.userId,
            })
                .returning('*')
                .execute();
            return result.raw[0];
        });
    }
    deletePost(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Posts_1.Posts.delete({ id, creatorId: req.session.userId });
            return true;
        });
    }
    vote(postId, value, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpvote = value !== -1;
            const realValue = isUpvote ? 1 : -1;
            const { userId } = req.session;
            const upvote = yield Upvotes_1.Upvotes.findOne({ where: { postId, userId } });
            if (upvote && upvote.value !== realValue) {
                typeorm_config_1.default.transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                    yield tm.query(`
          UPDATE upvotes
          SET value = $1
          WHERE "postId" = $2 AND "userId" = $3
        `, [realValue, postId, userId]);
                    yield tm.query(`
          UPDATE posts
          SET points = points + $1
          WHERE id = $2
        `, [2 * realValue, postId]);
                }));
            }
            else if (!upvote) {
                typeorm_config_1.default.transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                    yield tm.query(`
          INSERT INTO upvotes ("userId", "postId", value)
          VALUES ($1, $2, $3)
        `, [userId, postId, realValue]);
                    yield tm.query(`
          UPDATE posts
          SET points = points + $1
          WHERE id = $2
        `, [realValue, postId]);
                }));
            }
            return true;
        });
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Posts_1.Posts]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "textSnippet", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => Users_1.Users),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Posts_1.Posts, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "creator", null);
__decorate([
    (0, type_graphql_1.Query)(() => PaginatedPosts),
    __param(0, (0, type_graphql_1.Arg)('limit', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('cursor', () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Posts_1.Posts, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Posts_1.Posts, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Posts_1.Posts, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('title', () => String)),
    __param(2, (0, type_graphql_1.Arg)('text', () => String)),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('postId', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('value', () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "vote", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(Posts_1.Posts)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=posts%20copy.js.map