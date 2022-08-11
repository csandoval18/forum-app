import DataLoader from 'dataloader'
import { Upvotes } from 'src/entities/Upvotes'
import { In } from 'typeorm'

// [{postId: 5, userId: 10}]
// [{postId: 5, userId: 10, value: 1}]

export const createUpvoteLoader = () =>
	new DataLoader<{ postId: number; userId: number }, Upvotes | null>(
		async (keys) => {
			const users = await Upvotes.findBy({ userId: In(keys as any) })
			const upvoteIdsToUpvote: Record<string, Upvotes> = {}
			users.forEach((upvote) => {
				upvoteIdsToUpvote[`${upvote.userId} | ${upvote.postId}`] = upvote
			})

			return keys.map(
				(key) => upvoteIdsToUpvote[`${key.userId} | ${key.postId}`],
			)
		},
	)
