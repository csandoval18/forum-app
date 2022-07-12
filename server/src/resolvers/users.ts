import { Users } from '../entities/Users'
import { MyContext } from '../types'
import {
	Resolver,
	Arg,
	Mutation,
	InputType,
	Field,
	Ctx,
	ObjectType,
	Query,
} from 'type-graphql'
import { RequiredEntityData } from '@mikro-orm/core'
//argon2 is for hashing password and making it secure in case the DB is compromised
import argon2 from 'argon2'
import { COOKIE_NAME } from '../constants'

//input types are used for arguments
@InputType()
class UsernamePasswordInput {
	@Field()
	username: string
	@Field()
	password: string
}

@ObjectType()
class FieldError {
	@Field()
	field: string
	@Field()
	message: string
}

//object types can be returned from mutations
@ObjectType()
class UserResponse {
	//error returned if query did not work
	@Field(() => [FieldError], { nullable: true })
	//question mark returns undefined
	errors?: FieldError[]

	//user returns if query worked properly
	@Field(() => Users, { nullable: true })
	user?: Users
}

@Resolver()
export class UserResolver {
	@Mutation(() => Boolean)
	async forgotPassword(@Arg('email') email: string, @Ctx() { req }: MyContext) {
		// const user = await em.findOne(User, {email})
		return true
	}
	@Query(() => Users, { nullable: true })
	async me(@Ctx() { req, em }: MyContext) {
		//user is not logged in since no cookie is set null is returned
		if (!req.session.userId) {
			return null
		}

		//else if the session cookie is set return the user info
		const user = em.findOne(Users, { id: req.session.userId })
		return user
	}

	//register handling
	@Mutation(() => UserResponse)
	async register(
		//options is an object with containing the username and password as parameter fields
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { em, req }: MyContext,
	): Promise<UserResponse> {
		if (options.username.length <= 2) {
			return {
				errors: [
					{
						field: 'username',
						message: 'Length must be greater than 2',
					},
				],
			}
		}

		if (options.password.length <= 3) {
			return {
				errors: [
					{
						field: 'password',
						message: 'Length must be greater than 3',
					},
				],
			}
		}
		const hashsedPassword = await argon2.hash(options.password)
		const user = em.fork({}).create(Users, {
			username: options.username,
			password: hashsedPassword,
		} as RequiredEntityData<Users>)

		//querie to check if username already is already taken
		const usernameTaken = await em.findOne(Users, {
			username: options.username,
		})
		//if username does not exist in DB create the user record
		if (!usernameTaken) {
			await em.persistAndFlush(user)
			//store user id session
			//this will set a cokie on the user
			//and keep them logged in after they register
			req.session.userId = user.id
			console.log('cookie:', req.session)
			return { user }
		} else {
			//if username is taken return an error array object
			return {
				errors: [
					{
						field: 'username',
						message: 'Username already taken.',
					},
				],
			}
		}
	}

	//login handling
	@Mutation(() => UserResponse)
	async login(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { em, req }: MyContext,
	): Promise<UserResponse> {
		//querie for row containing data of user
		const user = await em.findOne(Users, { username: options.username })
		if (!user) {
			return {
				errors: [
					{
						field: 'username',
						message: "That username doesn't exist",
					},
				],
			}
		}
		const valid = await argon2.verify(user.password, options.password)
		if (!valid) {
			return {
				errors: [
					{
						field: 'password',
						message: 'Incorrect password',
					},
				],
			}
		}
		//sets cookie session to maintain user logged in after login
		//also stores user.id into redis
		req.session.userId = user.id
		console.log('cookie:', req.session)
		console.log('sessionID', req.sessionID)

		return {
			user,
		}
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { req, res }: MyContext) {
		console.log('cookie:', req.session)
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				if (err) {
					console.log(err)
					resolve(false)
					return
				}
				res.clearCookie(COOKIE_NAME)
				console.log('removed cookie')
				console.log('cookie:', req.session)
				resolve(true)
			}),
		)
	}
}
