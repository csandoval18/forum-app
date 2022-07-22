import { MyContext } from '../types'
import { MiddlewareFn } from 'type-graphql'

//Checks if user is authenticated with typegraphql middleware function
export const isAuth: MiddlewareFn<MyContext> = (
	{ context },
	next,
) => {
	if (!context.req.session.userId) {
		throw new Error('not authenticated')
	}
	return next()
}
