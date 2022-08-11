import DataLoader from 'dataloader'
import { In } from 'typeorm'
import { Users } from '../entities/Users'

export const createUpvoteLoader = () =>
	new DataLoader<{ postId: number; userId: number }, number | null>(
		async (userIds) => {
			const users = await Users.findBy({ id: In(userIds as number[]) })
			const userIdToUser: Record<number, Users> = {}
			users.forEach((u) => {
				userIdToUser[u.id] = u
			})

			return userIds.map((userId) => userIdToUser[userId])
		},
	)
