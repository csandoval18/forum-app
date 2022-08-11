import { Upvotes } from '../entities/Upvotes'
import {
	Arg,
	Ctx,
	Field,
	FieldResolver,
	InputType,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	Root,
	UseMiddleware,
} from 'type-graphql'
import { Posts } from '../entities/Posts'
import { isAuth } from '../middleware/isAuth'
import dataSource from '../typeorm.config'
import { MyContext } from '../types'
import { Users } from '../entities/Users'

@InputType()
class PostInput {
	@Field()
	title: string
	@Field()
	text: string
}

@ObjectType()
class PaginatedPosts {
	@Field(() => [Posts])
	posts: Posts[]
	@Field()
	hasMore: boolean
}

// Post queries to pg
@Resolver(Posts)
export class PostResolver {
	// Returns a slice of text field from Posts entity
	@FieldResolver(() => String)
	textSnippet(@Root() post: Posts) {
		return post.text.slice(0, 50)
	}

	@FieldResolver(() => Users)
	creator(@Root() post: Posts, @Ctx() { userLoader }: MyContext) {
		return userLoader.load(post.creatorId)
		// return Users.findOne({ where: { id: post.creatorId } })
	}

	// @FieldResolver(() => String, { nullable: true })
	// async voteStatus(
	// 	@Root() post: Posts,
	// 	@Ctx() { upvoteLoader, req }: MyContext,
	// ) {
	// 	if (!req.session.userId) return null

	// 	console.log('upvote1: ')
	// 	const upvote = await upvoteLoader.load({
	// 		postId: post.id,
	// 		userId: req.session.userId,
	// 	})
	// 	console.log('upvote: ', upvote)

	// 	return upvote ? upvote.value : null
	// }

	/* 
    When we set an argument to nullable we have explicitely set the return type
	  cursor has to be nullable because the first time it is fetched it will be null 
  */
	@Query(() => PaginatedPosts)
	async posts(
		@Arg('limit', () => Int) limit: number,
		@Arg('cursor', () => String, { nullable: true })
		cursor: string | null,
		@Ctx() { req }: MyContext,
	): Promise<PaginatedPosts> {
		// The +1 checks if there is more posts after the given range to display in the next page
		const realLimit = Math.min(50, limit)
		const realLimitPlusOne = realLimit + 1

		const replacements: any[] = [realLimitPlusOne]
		const { userId } = req.session
		if (userId) replacements.push(userId)

		// Adding cursor field to conditional posts query
		let cursorIdx = 3
		if (cursor) {
			replacements.push(new Date(parseInt(cursor)))
			cursorIdx = replacements.length
		}
		const posts = await dataSource.query(
			`
      SELECT p.*,
      ${
				req.session.userId
					? '(SELECT value FROM upvotes WHERE "userId" = $2 AND "postId" = p.id) "voteStatus"'
					: 'null as "voteStatus"'
			}
      FROM posts p 
      INNER JOIN users u ON u.id = p."creatorId"
      ${cursor ? `WHERE p."createdAt" < $${cursorIdx}` : ''}
      ORDER BY p."createdAt" DESC
      LIMIT $1
      `,
			replacements,
		)

		// const posts = await qb.getMany()
		return {
			posts: posts.slice(0, realLimit),
			hasMore: posts.length === realLimitPlusOne,
		}
	}

	@Query(() => Posts, { nullable: true })
	post(@Arg('id', () => Int) id: number): Promise<Posts | null> {
		return Posts.findOne({ where: { id } })

		// Creates relationship between post from Posts and creator Users which allows to fetch the User fields of the creator of the post
		// return Posts.findOne({ where: { id: id }, relations: ['creator'] })
	}

	// Create a post
	@Mutation(() => Posts, { nullable: true })
	// Checks if user is authenticated since we don't want user's that are not signed in to make posts
	@UseMiddleware(isAuth)
	async createPost(
		@Arg('input') input: PostInput,
		@Ctx() { req }: MyContext,
	): Promise<Posts> {
		// Adds record to postgres post table in forum DB
		return Posts.create({
			...input,
			creatorId: req.session.userId,
		}).save()
	}

	@Mutation(() => Posts, { nullable: true })
	@UseMiddleware(isAuth)
	async updatePost(
		@Arg('id', () => Int) id: number,
		@Arg('title', () => String) title: string,
		@Arg('text', () => String) text: string,
		@Ctx() { req }: MyContext,
	): Promise<Posts | null> {
		const result = await dataSource
			.createQueryBuilder()
			.update(Posts)
			.set({ title, text })
			.where('id = :id AND "creatorId" = :creatorId', {
				id,
				creatorId: req.session.userId,
			})
			.returning('*')
			.execute()

		return result.raw[0]
	}
	// return Posts.update({ id, creatorId: req.session.userId }, { title, text })

	@Mutation(() => Boolean)
	// Check if user is logged in
	@UseMiddleware(isAuth)
	async deletePost(
		@Arg('id', () => Int) id: number,
		@Ctx() { req }: MyContext,
	): Promise<boolean> {
		// Not cascade way to delete post

		// const post = await Posts.findOne({ where: { id: id } })
		// if (!post) return false
		// if (post.creatorId !== req.session.userId) throw new Error('not authorized')

		// await Upvotes.delete({ postId: id })
		// await Posts.delete({ id, creatorId: req.session.userId })

		await Posts.delete({ id, creatorId: req.session.userId })
		return true
	}

	@Mutation(() => Boolean)
	async vote(
		@Arg('postId', () => Int) postId: number,
		@Arg('value', () => Int) value: number,
		@Ctx() { req }: MyContext,
	) {
		// Determine if value is an upvote or downvote
		const isUpvote = value !== -1
		const realValue = isUpvote ? 1 : -1
		const { userId } = req.session
		// Upvotes.insert({
		// 	userId,
		// 	postId,
		// 	value: realValue,
		// })

		const upvote = await Upvotes.findOne({ where: { postId, userId } })

		// The user has voted on the post before and they are changing their vote
		if (upvote && upvote.value !== realValue) {
			dataSource.transaction(async (tm) => {
				await tm.query(
					`
          UPDATE upvotes
          SET value = $1
          WHERE "postId" = $2 AND "userId" = $3
        `,
					[realValue, postId, userId],
				)

				await tm.query(
					`
          UPDATE posts
          SET points = points + $1
          WHERE id = $2
        `,
					[2 * realValue, postId],
				)
			})
		} else if (!upvote) {
			// User has not voted before and the entry will be inserted in the db
			dataSource.transaction(async (tm) => {
				await tm.query(
					`
          INSERT INTO upvotes ("userId", "postId", value)
          VALUES ($1, $2, $3)
        `,
					[userId, postId, realValue],
				)

				await tm.query(
					`
          UPDATE posts
          SET points = points + $1
          WHERE id = $2
        `,
					[realValue, postId],
				)
			})
		}
		return true
	}
}
