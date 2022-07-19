import { ObjectType, Field, Int } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@ObjectType()
@Entity()
//base entity allows us to use posts.find() or posts.insert()
export class Posts extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date

	@Field()
	@Column()
	title!: string
}
