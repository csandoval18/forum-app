import { cacheExchange, Cache } from '@urql/exchange-graphcache'
import Router from 'next/router'
import { dedupExchange, Exchange, fetchExchange } from 'urql'
import { pipe, tap } from 'wonka'
import {
	DeletePostMutationVariables,
	LoginMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
	VoteMutationVariables,
} from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'
import { cursorPagination } from './urqlCursorPagination'
import { gql } from '@urql/core'
import { isServer } from './isServer'

const errorExchange: Exchange =
	({ forward }) =>
	(ops$) => {
		return pipe(
			forward(ops$),
			tap(({ error }) => {
				if (error) {
					Router.replace('/login')
				}
			}),
		)
	}

const invalidateAllPosts = (cache: Cache) => {
	const allFields = cache.inspectFields('Query')
	const fieldInfos = allFields.filter((info) => info.fieldName === 'posts')
	fieldInfos.forEach((fi) => {
		cache.invalidate('Query', 'posts', fi.arguments || {})
	})
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
	let cookie = ''
	if (isServer()) {
		cookie = ctx?.req?.headers?.cookie
	}

	return {
		url: 'http://localhost:4000/graphql',
		//Sends a cookie. Used to set a cookie when user register or fetching cookie when loggin in
		fetchOptions: {
			credentials: 'include' as const,
			headers: cookie
				? {
						cookie,
				  }
				: undefined,
		},
		exchanges: [
			dedupExchange,
			//URQL graphcache cache updates
			cacheExchange({
				keys: {
					PaginatedPosts: () => null,
				},
				resolvers: {
					Query: {
						posts: cursorPagination(),
					},
				},
				updates: {
					Mutation: {
						deletePost: (_result, args, cache, info) => {
							cache.invalidate({
								__typename: 'Posts',
								id: (args as DeletePostMutationVariables).id,
							})
						},
						vote: (_result, args, cache, info) => {
							const { postId, value } = args as VoteMutationVariables
							const data = cache.readFragment(
								gql`
									fragment _ on Posts {
										id
										points
										voteStatus
									}
								`,
								{ id: postId } as any,
							)

							if (data) {
								if (data.voteStatus === value) {
									return
								}
								const newPoints =
									(data.points as number) + (!data.voteStatus ? 1 : 2) * value
								cache.writeFragment(
									gql`
										fragment __ on Posts {
											points
											voteStatus
										}
									`,
									{ id: postId, points: newPoints, voteStatus: value } as any,
								)
							}
						},

						/*This query is creating a post in the db, and it is also telling the client that the posts query
					needs to be refetched from the server by invalidating the query thus updating the cache with the
					newly created post */
						createPost: (_result, args, cache, info) => {
							invalidateAllPosts(cache)
						},
						login: (_result, args, cache, info) => {
							betterUpdateQuery<LoginMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								(result, query) => {
									// If result of login query is an error then return the current query
									if (result.login.errors) {
										return query
										// Else return user data {id, username} when logged in successfully
									} else {
										return {
											me: result.login.user,
										}
									}
								},
							)
							invalidateAllPosts(cache)
						},
						register: (_result, args, cache, info) => {
							betterUpdateQuery<RegisterMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								(result, query) => {
									// If result of login query is an error then return the current query
									if (result.register.errors) {
										return query
										// Else return user data {id, username} when logged in successfully
									} else {
										return {
											me: result.register.user,
										}
									}
								},
							)
						},
					},
				},
			}),
			ssrExchange,
			fetchExchange,
		],
	}
}
