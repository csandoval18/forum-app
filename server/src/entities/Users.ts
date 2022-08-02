import { ObjectType, Field } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Posts } from './Posts'
import { Upvote } from './Upvote'

@ObjectType()
@Entity()
export class Users extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number

	//!: means field cannot be null
	@Field()
	@Column({ unique: true })
	username!: string

	@Field()
	@Column({ unique: true })
	email!: string

	//No field decorator since we do not want the user password to be returned in a graphql query
	@Column()
	password!: string

	@OneToMany(() => Posts, (post) => post.creator)
	posts: Posts[]

	@OneToMany(() => Upvote, (upvote) => upvote.user)
	upvotes: Upvote[]

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date
}
