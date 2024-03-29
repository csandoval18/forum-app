import { stringifyVariables } from '@urql/core'
import { cacheExchange, Resolver } from '@urql/exchange-graphcache'

export type MergeMode = 'before' | 'after'

export interface PaginationParams {
	offsetArgument?: string
	limitArgument?: string
	mergeMode?: MergeMode
}

export const cursorPagination = (): Resolver => {
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
