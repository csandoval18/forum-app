import { InputType, Field } from 'type-graphql'

//input types are used for arguments

@InputType()
export class RegisterInputs {
	@Field()
	username: string
	@Field()
	password: string
	@Field()
	email: string
}
