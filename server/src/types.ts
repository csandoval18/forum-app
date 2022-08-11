import { Request, Response } from 'express'
import { Session, SessionData } from 'express-session'
import Redis from 'ioredis'
import { createUpvoteLoader } from './utils/createUpvoteLoader'
import { createUserLoader } from './utils/createUserLoader'

interface ExtendedRequest extends Request {
	session: Session & Partial<SessionData> & Express.Request & { userId: number }
}

export type MyContext = {
	// em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
	req: ExtendedRequest
	res: Response
	redisClient: Redis
	userLoader: ReturnType<typeof createUserLoader>
	upvoteLoader: ReturnType<typeof createUpvoteLoader>
}
