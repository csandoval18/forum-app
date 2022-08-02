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
import { Upvotes } from './Upvotes'
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

	@Field(() => Users)
	@ManyToOne(() => Users, (user) => user.posts)
	creator: Users

	@OneToMany(() => Upvotes, (upvote) => upvote.post)
	upvotes: Upvotes[]

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date
}
