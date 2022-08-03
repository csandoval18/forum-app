import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Flex,
	Heading,
	IconButton,
	Stack,
	Text,
} from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard/PostCard'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
	const router = useRouter()
	const [variables, setVariables] = useState({
		limit: 15,
		cursor: null as string | null,
	})

	console.log('variables', variables)
	const [{ data, fetching, ...other }] = usePostsQuery({
		variables,
	})

	console.log(data)
	if (!fetching && !data) {
		return <div>Cannot fetch posts from server</div>
	}

	return (
		<Box h={'100%'}>
			<Navbar pageProps={undefined} />
			<Box className='posts-container' px={40}>
				<Flex align={'center'} py={8}>
					<Heading>Forum App</Heading>
					<Button
						variant='primary'
						ml={'auto'}
						onClick={() => {
							router.replace('/create-post')
						}}
					>
						Create Post
					</Button>
				</Flex>

				{/* Diplay posts */}
				{!data && fetching ? (
					<div>loading...</div>
				) : (
					<Stack spacing={8}>
						{data!.posts.posts.map((postFields) => (
							// Passing post fields to postcard component through props
							<PostCard post={postFields}></PostCard>
						))}
					</Stack>
				)}

				{data && data.posts.hasMore ? (
					<Flex>
						<Button
							m='auto'
							variant='primary'
							my={8}
							isLoading={fetching}
							onClick={() => {
								setVariables({
									limit: variables?.limit,
									cursor:
										data.posts.posts[data.posts.posts.length - 1].createdAt,
								})
							}}
						>
							load more
						</Button>
					</Flex>
				) : null}
			</Box>
		</Box>
	)
}

// export default Index
export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
