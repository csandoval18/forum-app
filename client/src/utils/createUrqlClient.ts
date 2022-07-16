import { dedupExchange, fetchExchange } from 'urql'
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache'
import {
	LoginMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
} from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'

export const createUrqlClient = (ssrExchange: any) => ({
	url: 'http://localhost:4000/graphql',
	//sends a cookie. Used to set a cookie when user register or fetching cookie when loggin in
	fetchOptions: {
		credentials: 'include' as const,
	},
	exchanges: [
		dedupExchange,
		//URQL graphcache cache updates
		cacheExchange({
			updates: {
				Mutation: {
					login: (_result, args, cache, info) => {
						betterUpdateQuery<LoginMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							(result, query) => {
								//if result of login query is an error then return the current query
								if (result.login.errors) {
									return query
									//else return user data {id, username} when logged in successfully
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
								//if result of login query is an error then return the current query
								if (result.register.errors) {
									return query
									//else return user data {id, username} when logged in successfully
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
