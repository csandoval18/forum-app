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
		console.log(entityKey, fieldName)
		//inspectFields gets all the fields in the cache under the query basically all the queries
		const allFields = cache.inspectFields(entityKey)
		console.log('allfields:', allFields)
		const fieldInfos = allFields.filter((info) => info.fieldName === fieldName)
		const size = fieldInfos.length
		if (size === 0) {
			return undefined
		}

		// Reading data from the cache and returning it
		console.log('fieldArgs:', fieldArgs)
		const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
		console.log('key we created:', fieldKey)
		const isInCache = cache.resolve(entityKey, fieldKey)
		console.log('isInCache:', isInCache)
		info.partial = !isInCache
		const results: string[] = []
		fieldInfos.forEach((fieldInfo) => {
			const data = cache.resolve(entityKey, fieldInfo.fieldKey) as string[]

			console.log('data:', data)
			results.push(...data)
		})
		console.log('results: ', results)
		return results
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
