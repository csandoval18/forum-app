import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import { COOKIE_NAME, __prod__ } from './constants'
import microConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/posts'
import { UserResolver } from './resolvers/users'
import { MyContext } from './types'
import cors from 'cors'
import session from 'express-session'
import connectRedis from 'connect-redis'
import Redis from 'ioredis'
// import { sendEmail } from './utils/sendEmail'

const main = async () => {
	console.log('NODE_ENV:', process.env.NODE_ENV)
	const orm = await MikroORM.init(microConfig)
	//delete all rows from users table
	// await orm.em.nativeDelete(Users, {})
	await orm.getMigrator().up()

	const app = express()
	// await sendEmail('chris@chris.com', 'hello world')

	app.set('trust proxy', !__prod__)

	const RedisStore = connectRedis(session)
	const redisClient = new Redis()

	app.use(
		//aplies to all routes
		cors({
			origin: [
				'https://studio.apollographql.com',
				'http://localhost:3000',
			],
			credentials: true,
		}),
	)

	app.use(
		session({
			name: COOKIE_NAME,
			store: new RedisStore({ client: redisClient }),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				httpOnly: true,
				sameSite: 'lax',
				secure: __prod__,
			},
			secret: 'keyboard cat',
			resave: false,
			saveUninitialized: false,
		}),
	)

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false,
		}),
		//function that returns an object for the context.
		//context can take req and res object from express
		context: ({ req, res }: MyContext): MyContext => ({
			em: orm.em,
			req,
			res,
			redisClient,
		}),
	})

	await apolloServer.start()
	apolloServer.applyMiddleware({
		app,
		cors: false,
	})

	app.listen(4000, () => {
		console.log('server started on localhost:4000')
	})
}

main().catch((err) => {
	console.error(err)
})
