import { InputType, Field } from 'type-graphql'

//input types are used for arguments

@InputType()
export class LoginInputs {
	@Field()
	usernameOrEmail: string
	@Field()
	password: string
}
