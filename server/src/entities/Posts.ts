import { Field, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Upvote } from './Upvote'
import { Users } from './Users'

@ObjectType()
@Entity()
//base entity allows us to use posts.find() or posts.insert()
export class Posts extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number

	@Field()
	@Column()
	title!: string

	@Field()
	@Column()
	text!: string

	@Field()
	@Column({ type: 'int', default: 0 })
	points!: number

	@Field()
	@Column()
	creatorId: number

	@Field(() => Posts)
	@ManyToOne(() => Users, (user) => user.posts)
	creator: Users

	@OneToMany(() => Upvote, (upvote) => upvote.post)
	upvotes: Upvote[]

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date
}
