import { Users } from '../entities/Users'
import { MyContext } from '../types'
import {
	Resolver,
	Arg,
	Mutation,
	Field,
	Ctx,
	ObjectType,
	Query,
	FieldResolver,
	Root,
} from 'type-graphql'
//argon2 is for hashing password and making it secure in case the DB is compromised
import argon2 from 'argon2'
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants'
import { RegisterInputs } from './inputTypes/RegisterInputs'
import { LoginInputs } from './inputTypes/LoginInputs'
import { validateRegister } from '../utils/validateRegister'
import { sendEmail } from '../utils/sendEmail'
import { v4 } from 'uuid'
import dataSource from '../typeorm.config'
// import { RedisClient } from 'redis'

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
	//error returned if query did not work nullable allow errors field to return null
	@Field(() => [FieldError], { nullable: true })
	//question mark makes property optional
	errors?: FieldError[]

	//user returns if query worked properly
	@Field(() => Users, { nullable: true })
	user?: Users
}

@Resolver(Users)
export class UserResolver {
	// Prevents people from seeing emails of other users
	@FieldResolver(() => String)
	email(@Root() user: Users, @Ctx() { req }: MyContext) {
		// If current user is trying to see his own email
		if (req.session.userId === user.id) {
			return user.email
		}
		// If the current user is trying to see the email of another user
		return ''
	}

	@Mutation(() => UserResponse)
	async register(
		//options is an object with containing the username and password as parameter fields
		@Arg('options') options: RegisterInputs,
		@Ctx() { req }: MyContext,
	): Promise<UserResponse> {
		//validate user input
		const errors = validateRegister(options)
		if (errors) {
			return { errors }
		}
		const hashsedPassword = await argon2.hash(options.password)

		//querie to check if username already is already taken by seeing if user exists
		const usernameTaken = await Users.findOne({
			where: { username: options.username },
		})
		//if username does not exist in DB create the user record
		if (!usernameTaken) {
			// Users.create({
			// 	username: options.username,
			// 	password: hashsedPassword,
			// 	email: options.email,
			// }).save()

			//equivalent to Users.create method used above
			const result = await dataSource
				.createQueryBuilder()
				.insert()
				.into(Users)
				.values([
					{
						username: options.username,
						password: hashsedPassword,
						email: options.email,
					},
				])
				.returning('*')
				.execute()

			const user = result.raw[0]
			//set user id session cookie after succesful register
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
		@Arg('options') options: LoginInputs,
		@Ctx() { req }: MyContext,
	): Promise<UserResponse> {
		//querie for row containing data of user depending on username or email that is passed
		const user = await Users.findOne(
			options.usernameOrEmail.includes('@')
				? { where: { email: options.usernameOrEmail } }
				: { where: { username: options.usernameOrEmail } },
		)
		if (!user) {
			return {
				errors: [
					{
						field: 'usernameOrEmail',
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
						message: 'Wrong password',
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
	logout(@Ctx() { req, res }: MyContext) {
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				res.clearCookie(COOKIE_NAME)
				if (err) {
					console.log(err)
					resolve(false)
					return
				}
				console.log('removed cookie')
				console.log('cookie:', req.session)
				console.log('sessionID:', req.session)
				resolve(true)
			}),
		)
	}

	@Query(() => Users, { nullable: true })
	me(@Ctx() { req }: MyContext) {
		//user is not logged in since no cookie is set null is returned
		// console.log('me query cookie:', req.session)
		if (!req.session.userId) {
			return null
		}

		//else if the session cookie is set return the user info
		return Users.findOne({ where: { id: req.session.userId } })
	}

	@Mutation(() => Boolean)
	async forgotPassword(
		@Arg('email') email: string,
		@Ctx() { redisClient }: MyContext,
	) {
		//get user row from email
		const user = await Users.findOne({ where: { email: email } })
		if (!user) {
			//the email is not in the db
			return false
		}

		//v4 generates random token
		const token = v4()

		redisClient.set(
			FORGET_PASSWORD_PREFIX + token,
			user.id,
			'EX',
			1000 * 60 * 60 * 24 * 2, // 2 days
		)
		await sendEmail(
			email,
			`<a href="${process.env.CORS_ORIGIN}/change-password/${token}">reset password</a>`,
		)
		return true
	}

	@Mutation(() => UserResponse)
	async changePassword(
		@Arg('token') token: string,
		@Arg('newPassword') newPassword: string,
		@Ctx() { req, redisClient }: MyContext,
	): Promise<UserResponse> {
		if (newPassword.length <= 3) {
			return {
				errors: [
					{
						field: 'newPassword',
						message: 'Length must be greater than 3',
					},
				],
			}
		}
		const key = FORGET_PASSWORD_PREFIX + token
		const userId = await redisClient.get(key)
		if (!userId) {
			return {
				errors: [
					{
						field: 'token',
						message: 'token expired',
					},
				],
			}
		}

		//redis stores userId as string type so it needs to be converted to a number type
		//if type shows Promise<string | null> this means await keyword is missing
		const userIdNum = parseInt(userId)
		const user = await Users.findOne({
			where: { id: userIdNum },
		})

		//if the user is not found with the valid associated token then the user no longer exists
		if (!user) {
			return {
				errors: [
					{
						field: 'token',
						message: 'user no longer exists',
					},
				],
			}
		}

		//update user password
		Users.update(
			{ id: userIdNum },
			{ password: await argon2.hash(newPassword) },
		)

		//delete token key from redis to disable change password
		redisClient.del(key)

		//login user after change password
		req.session.userId = user.id

		return { user }
	}
}
