import dataSource from '../typeorm.config'
import { MyContext } from '../types'
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

	/* 
    When we set an argument to nullable we have explicitely set the return type
	  cursor has to be nullable because the first time it is fetched it will be null 
  */
	@Query(() => PaginatedPosts)
	async posts(
		@Arg('limit', () => Int) limit: number,
		@Arg('cursor', () => String, { nullable: true })
		cursor: string | null,
	): Promise<PaginatedPosts> {
		// The +1 checks if there is more posts after the given range to display in the next page
		const realLimit = Math.min(50, limit)
		const realLimitPlusOne = realLimit + 1

		const replacements: any[] = [realLimitPlusOne]

		// Adding cursor field to conditional posts query
		if (cursor) {
			replacements.push(new Date(parseInt(cursor)))
		}

		const posts = await dataSource.query(
			`
      SELECT p.*, u.*,
      json_build_object('username', u.username) creator
      FROM posts p 
      INNER JOIN users u ON u.id = p."creatorId"
      ${cursor ? `WHERE p."createdAt" < $2` : ''}
      ORDER BY p."createdAt" DESC
      LIMIT $1
      `,
			replacements,
		)

		// const qb = dataSource
		// 	.getRepository(Posts)
		// 	.createQueryBuilder('p') //alias
		// 	.innerJoinAndSelect('p.creator', 'u', 'u.id = p."creatorId"')
		// 	.orderBy('p."createdAt"', 'DESC')
		// 	.take(realLimitPlusOne)
		// if (cursor) {
		// 	qb.where('p."createdAt" < :cursor ', {
		// 		cursor: new Date(parseInt(cursor)),
		// 	})
		// }

		// const posts = await qb.getMany()
		console.log('posts', posts)
		return {
			posts: posts.slice(0, realLimit),
			hasMore: posts.length === realLimitPlusOne,
		}
	}

	@Query(() => Posts, { nullable: true })
	post(@Arg('id', () => Int) id: number): Promise<Posts | null> {
		return Posts.findOne({ where: { id: id } })
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
	async updatePost(
		@Arg('id') id: number,
		@Arg('title', () => String, { nullable: true }) title: string,
	): Promise<Posts | null> {
		const post = await Posts.findOne({ where: { id: id } })
		if (!post) {
			return null
		}
		if (typeof title !== 'undefined') {
			await Posts.update({ id }, { title })
		}
		return post
	}

	@Mutation(() => Boolean)
	async deletePost(@Arg('id') id: number): Promise<boolean> {
		await Posts.delete(id)
		return true
	}
}
