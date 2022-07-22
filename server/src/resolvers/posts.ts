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

// Post queries to pg
@Resolver(Posts)
export class PostResolver {
	@FieldResolver(() => String)
	textSnippet(@Root() root: Posts) {
		return root.text.slice(0, 50)
	}

	@Query(() => [Posts])
	async posts(
		@Arg('limit', () => Int) limit: number,
		//When we set an argument to nullable we have explicitely set the return type
		//cursor has to be nullable because the first time it is fetched it will be null
		@Arg('cursor', () => String, { nullable: true })
		cursor: string | null,
	): Promise<Posts[]> {
		const realLimit = Math.min(50, limit)

		const qb = dataSource
			.getRepository(Posts)
			.createQueryBuilder('p') //alias
			.orderBy('"createdAt"', 'DESC')
			.take(realLimit)
		if (cursor) {
			qb.where('"createdAt" < :cursor ', {
				cursor: new Date(parseInt(cursor)),
			})
		}

		return qb.getMany()
	}

	@Query(() => Posts, { nullable: true })
	post(@Arg('id', () => Int) id: number): Promise<Posts | null> {
		return Posts.findOne({ where: { id: id } })
	}

	//Create a post
	@Mutation(() => Posts, { nullable: true })
	//Checks if user is authenticated since we don't want user's that are not signed in to make posts
	@UseMiddleware(isAuth)
	async createPost(
		@Arg('input') input: PostInput,
		@Ctx() { req }: MyContext,
	): Promise<Posts> {
		//adds record to postgres post table in forum DB
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
