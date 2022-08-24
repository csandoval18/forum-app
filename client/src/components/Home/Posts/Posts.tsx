import { Box, Button, Flex, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { usePostsQuery } from '../../../generated/graphql'
import PostCard from './PostCard/PostCard'

interface PostsProps {}

const Posts: React.FC = () => {
	const router = useRouter()
	const [variables, setVariables] = useState({
		limit: 15,
		cursor: null as string | null,
	})
	const [{ data, fetching, ...other }] = usePostsQuery({
		variables,
	})
	if (!fetching && !data) {
		return <div>Cannot fetch posts from server</div>
	}

	return (
		<Flex className='posts-list-container' justifyContent='center'>
			{!data && fetching ? (
				<div>loading...</div>
			) : (
				<Stack spacing={2} py={8}>
					{data!.posts.posts.map((post) =>
						!post ? null : (
							<PostCard
								key={post.id}
								post={post}
								pageProps={undefined}
							></PostCard>
						),
					)}
				</Stack>
			)}

			{data && data.posts.hasMore ? (
				<Flex>
					<Button
						m='auto'
						variant='secondary'
						my={8}
						isLoading={fetching}
						onClick={() => {
							setVariables({
								limit: variables?.limit,
								cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
							})
						}}
					>
						load more
					</Button>
				</Flex>
			) : null}
		</Flex>
	)
}

export default Posts
