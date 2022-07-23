import { cacheExchange, Resolver } from '@urql/exchange-graphcache'
import Router from 'next/router'
import {
	dedupExchange,
	Exchange,
	fetchExchange,
	stringifyVariables,
} from 'urql'
import { pipe, tap } from 'wonka'
import {
	LoginMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
} from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'

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

const cursorPagination = (): Resolver => {
	return (_parent, fieldArgs, cache, info) => {
		const { parentKey: entityKey, fieldName } = info
		const allFields = cache.inspectFields(entityKey)
		const fieldInfos = allFields.filter((info) => info.fieldName === fieldName)
		const size = fieldInfos.length
		if (size === 0) {
			return undefined
		}

		const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
		const isItInTheCache = cache.resolve(
			cache.resolve(entityKey, fieldKey) as string,
			'posts',
		)
		info.partial = !isItInTheCache
		let hasMore = true
		const results: string[] = []
		fieldInfos.forEach((fi) => {
			const key = cache.resolve(entityKey, fi.fieldKey) as string
			const data = cache.resolve(key, 'posts') as string[]
			const _hasMore = cache.resolve(key, 'hasMore')
			if (!_hasMore) {
				hasMore = _hasMore as boolean
			}
			results.push(...data)
		})

		return {
			__typename: 'PaginatedPosts',
			hasMore,
			posts: results,
		}
	}
}

export const createUrqlClient = (ssrExchange: any) => ({
	url: 'http://localhost:4000/graphql',
	//Sends a cookie. Used to set a cookie when user register or fetching cookie when loggin in
	fetchOptions: {
		credentials: 'include' as const,
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
					login: (_result, args, cache, info) => {
						betterUpdateQuery<LoginMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							(result, query) => {
								//If result of login query is an error then return the current query
								if (result.login.errors) {
									return query
									//Else return user data {id, username} when logged in successfully
								} else {
									return {
										me: result.login.user,
									}
								}
							},
						)
					},
					register: (_result, args, cache, info) => {
						betterUpdateQuery<RegisterMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							(result, query) => {
								//If result of login query is an error then return the current query
								if (result.register.errors) {
									return query
									//Else return user data {id, username} when logged in successfully
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
})
