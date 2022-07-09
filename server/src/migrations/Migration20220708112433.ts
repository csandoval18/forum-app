import { Migration } from '@mikro-orm/migrations';

export class Migration20220708112433 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "id" serial primary key, add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null, add column "username" text not null, add column "password" text not null;');
    this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop constraint "users_username_unique";');
    this.addSql('alter table "users" drop constraint "users_pkey";');
    this.addSql('alter table "users" drop column "id";');
    this.addSql('alter table "users" drop column "created_at";');
    this.addSql('alter table "users" drop column "updated_at";');
    this.addSql('alter table "users" drop column "username";');
    this.addSql('alter table "users" drop column "password";');
  }

}
