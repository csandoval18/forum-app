"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220708112433 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220708112433 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('alter table "users" add column "id" serial primary key, add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null, add column "username" text not null, add column "password" text not null;');
            this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('alter table "users" drop constraint "users_username_unique";');
            this.addSql('alter table "users" drop constraint "users_pkey";');
            this.addSql('alter table "users" drop column "id";');
            this.addSql('alter table "users" drop column "created_at";');
            this.addSql('alter table "users" drop column "updated_at";');
            this.addSql('alter table "users" drop column "username";');
            this.addSql('alter table "users" drop column "password";');
        });
    }
}
exports.Migration20220708112433 = Migration20220708112433;
//# sourceMappingURL=Migration20220708112433.js.map