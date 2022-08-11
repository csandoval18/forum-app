import DataLoader from 'dataloader'
import { Users } from '../entities/Users'
import { In } from 'typeorm'

// [1,78, 8, 9]
// [{id: 1, username: 'tim}, {}, {}, {}]

export const createUserLoader = () =>
	new DataLoader<number, Users>(async (userIds) => {
		const users = await Users.findBy({ id: In(userIds as number[]) })
		const userIdToUser: Record<number, Users> = {}
		users.forEach((u) => {
			userIdToUser[u.id] = u
		})

		const sortedUsers = userIds.map((userId) => userIdToUser[userId])
		// console.log('userIds:', userIds)
		// console.log('map:', userIdToUser)
		// console.log('sortedUsers:', sortedUsers)
		return sortedUsers
	})
