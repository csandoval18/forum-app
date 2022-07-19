import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql'
import { Posts } from '../entities/Posts'

// Post queries to pg
@Resolver()
export class PostResolver {
	@Query(() => [Posts])
	async posts(): Promise<Posts[]> {
		return Posts.find()
	}

	@Query(() => Posts, { nullable: true })
	post(@Arg('id', () => Int) id: number): Promise<Posts | null> {
		return Posts.findOne({ where: { id: id } })
	}

	//Create a post
	@Mutation(() => Posts, { nullable: true })
	async createPost(@Arg('title') title: string): Promise<Posts> {
		//adds record to postgres post table in forum DB
		return Posts.create({ title: title }).save()
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
