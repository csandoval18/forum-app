import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
	const router = useRouter()
	const [variables, setVariables] = useState({
		limit: 10,
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
						{data!.posts.posts.map((p) => (
							<Box
								key={p.id}
								p={6}
								borderRadius={12}
								shadow='lg'
								// borderWidth={1}
								bg='whiteAlpha.500'
							>
								<Heading fontSize='xl'>{p.title}</Heading>
								<Text mt={4}>{p.textSnippet}</Text>
							</Box>
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
