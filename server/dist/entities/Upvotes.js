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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upvote = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Posts_1 = require("./Posts");
const Users_1 = require("./Users");
let Upvote = class Upvote extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Upvote.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Upvote.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (user) => user.upvotes),
    __metadata("design:type", Users_1.Users)
], Upvote.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Upvote.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Posts_1.Posts, (post) => post.upvotes),
    __metadata("design:type", Posts_1.Posts)
], Upvote.prototype, "post", void 0);
Upvote = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Upvote);
exports.Upvote = Upvote;
//# sourceMappingURL=Upvotes.js.map