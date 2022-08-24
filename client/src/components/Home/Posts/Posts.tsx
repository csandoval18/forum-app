import { Box, Button, Flex, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { usePostsQuery } from '../../../generated/graphql'
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

	return (
		<Flex className='posts-list-container' flexDir='column' alignItems='center'>
			{!data && fetching ? (
				<div>loading...</div>
			) : (
				<Stack spacing={2} py={10}>
					{data!.posts.posts.map((post) =>
						!post ? null : (
							<PostCardDesktop
								key={post.id}
								post={post}
								pageProps={undefined}
							></PostCardDesktop>
						),
					)}
				</Stack>
			)}

			{data && data.posts.hasMore ? (
				<Flex>
					<Button
						m='auto'
						bg='gray.700'
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
