import { cacheExchange } from '@urql/exchange-graphcache'
import Router from 'next/router'
import { dedupExchange, Exchange, fetchExchange } from 'urql'
import { pipe, tap } from 'wonka'
import {
	LoginMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
} from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'
import { cursorPagination } from './urqlCursorPagination'

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
