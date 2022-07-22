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
		// console.log(entityKey, fieldName)
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
		return results

		// 	const visited = new Set()
		// 	let result: NullArray<string> = []
		// 	let prevOffset: number | null = null

		// 	for (let i = 0; i < size; i++) {
		// 		const { fieldKey, arguments: args } = fieldInfos[i]
		// 		if (args === null || !compareArgs(fieldArgs, args)) {
		// 			continue
		// 		}

		// 		const links = cache.resolve(entityKey, fieldKey) as string[]
		// 		const currentOffset = args[offsetArgument]

		// 		if (
		// 			links === null ||
		// 			links.length === 0 ||
		// 			typeof currentOffset !== 'number'
		// 		) {
		// 			continue
		// 		}

		// 		const tempResult: NullArray<string> = []

		// 		for (let j = 0; j < links.length; j++) {
		// 			const link = links[j]
		// 			if (visited.has(link)) continue
		// 			tempResult.push(link)
		// 			visited.add(link)
		// 		}

		// 		if (
		// 			(!prevOffset || currentOffset > prevOffset) ===
		// 			(mergeMode === 'after')
		// 		) {
		// 			result = [...result, ...tempResult]
		// 		} else {
		// 			result = [...tempResult, ...result]
		// 		}

		// 		prevOffset = currentOffset
		// 	}

		// 	const hasCurrentPage = cache.resolve(
		// 		entityKey,
		// 		fieldName,
		// 		fieldArgs,
		// 	)
		// 	if (hasCurrentPage) {
		// 		return result
		// 	} else if (!(info as any).store.schema) {
		// 		return undefined
		// 	} else {
		// 		info.partial = true
		// 		return result
		// 	}
	}
}
