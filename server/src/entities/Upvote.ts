import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Posts } from './Posts'
import { Users } from './Users'

@ObjectType()
@Entity()
//base entity allows us to use posts.find() or posts.insert()
export class Upvote extends BaseEntity {
	@Column({ type: 'int' })
	value: number

	@PrimaryColumn()
	userId: number

	@ManyToOne(() => Users, (user) => user.upvotes)
	user: Users

	@PrimaryColumn()
	postId: number

	@ManyToOne(() => Posts, (post) => post.upvotes)
	post: Posts
}
