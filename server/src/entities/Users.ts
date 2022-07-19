import { ObjectType, Field } from 'type-graphql'
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
export class Users extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date

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
}
