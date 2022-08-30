import { Box, Button, Flex, Stack } from '@chakra-ui/react'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { usePostsQuery } from '../../../generated/graphql'
import { useMediaQuery } from '../../../utils/useMediaQuery'
import PostCard from './PostCard/PostCard'
import PostCardDesktop from './PostCard/PostCardDesktop'

interface PostsProps {}

const Posts: React.FC = () => {
	const router = useRouter()
	const [variables, setVariables] = useState({
		limit: 10,
		cursor: null as string | null,
	})
	const [{ data, fetching, ...other }] = usePostsQuery({
		variables,
	})
	if (!fetching && !data) {
		return <div>Cannot fetch posts from server</div>
	}

	const widthBreakPoint = useMediaQuery(500)

	let stack: ReactJSXElement
	if (!data && fetching) {
		let stack = <div>loading...</div>
	} else {
		stack = widthBreakPoint ? (
			<Stack spacing={[2, 2, 4, 4]} py={10}>
				{data!.posts.posts.map((post) =>
					!post ? null : (
						<PostCard key={post.id} post={post} pageProps={undefined} />
					),
				)}
			</Stack>
		) : (
			<Stack spacing={[2, 2, 4, 4]} py={10}>
				{data!.posts.posts.map((post) =>
					!post ? null : (
						<PostCardDesktop key={post.id} post={post} pageProps={undefined} />
					),
				)}
			</Stack>
		)
	}

	return (
		<Flex className='posts-list-container' flexDir='column' alignItems='center'>
			{/* <div>
				w: {width}, h: {height}
			</div> */}
			{/* {!data && fetching ? <div>loading...</div> : stack} */}
			{stack}

			{data && data.posts.hasMore ? (
				<Flex>
					<Button
						m='auto'
						bg='gray.700'
						color='white'
						_hover={{ bg: 'gray.600' }}
						mb={10}
						isLoading={fetching}
						onClick={() => {
							setVariables({
								limit: variables?.limit,
								cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
							})
						}}
					>
						Load More
					</Button>
				</Flex>
			) : null}
		</Flex>
	)
}

export default Posts
