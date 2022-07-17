import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
@Entity()
export class Users {
	@Field()
	@PrimaryKey()
	id!: number

	@Field(() => String)
	@Property({ type: 'date' })
	createdAt = new Date()

	@Field(() => String)
	@Property({ type: 'date', onUpdate: () => new Date() })
	updatedAt = new Date()

	//!: means field cannot be null
	@Field()
	@Property({ type: 'text', unique: true })
	username!: string

	@Field()
	@Property({ type: 'text', unique: true })
	email!: string

	//No field decorator since we do not want the user password to be returned in a graphql query
	@Property({ type: 'text' })
	password!: string
}
