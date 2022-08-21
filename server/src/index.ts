import { ApolloServer } from 'apollo-server-express'
import connectRedis from 'connect-redis'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import Redis from 'ioredis'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { COOKIE_NAME, __prod__ } from './constants'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/posts'
import { UserResolver } from './resolvers/users'
import dataSource from './typeorm.config'
import { MyContext } from './types'
import { createUserLoader } from './utils/createUserLoader'
import 'dotenv-safe/config'
// import { sendEmail } from './utils/sendEmail'

const main = async () => {
	console.log('NODE_ENV:', process.env.NODE_ENV)

	//initialize typeorm connection
	const conn = await dataSource.initialize()
	await conn.runMigrations()
	// await Posts.delete({})

	const app = express()
	// await sendEmail('user@user.com', 'hello world')

	const RedisStore = connectRedis(session)
	const redisClient = new Redis(process.env.REDIS_URL)
	app.set('trust proxy', !__prod__)
	app.use(
		//aplies to all routes
		cors({
			origin: ['https://studio.apollographql.com', process.env.CORS_ORIGIN],
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
				domain: __prod__ ? '.cas-forum' : undefined,
			},
			secret: process.env.SESSION_SECRET,
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
			req,
			res,
			redisClient,
			userLoader: createUserLoader(),
			// upvoteLoader: createUpvoteLoader(),
		}),
	})

	await apolloServer.start()
	apolloServer.applyMiddleware({
		app,
		cors: false,
	})

	app.listen(parseInt(process.env.PORT), () => {
		console.log(`Server started on ${process.env.PORT}`)
	})
}

main().catch((err) => {
	console.error(err)
})
