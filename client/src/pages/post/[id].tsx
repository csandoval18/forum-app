import { Box, Flex, Heading } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import EditDeletePostButtons from '../../components/EditDeletePostButtons'
import Navbar from '../../components/Home/Navbar'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl'

const Post: React.FC = ({}) => {
	const [{ data, error, fetching }] = useGetPostFromUrl()

	if (fetching) {
		return (
			<Box>
				<div>loading...</div>
			</Box>
		)
	}
	if (error) return <div>{error.message}</div>
	if (!data?.post) return <div>Could not find post</div>

	return (
		<>
			<Navbar pageProps={undefined}></Navbar>
			<Flex
				className='post-selection-container'
				h='100vh'
				width='100%'
				flexDir={'column'}
			>
				<Box>
					<Heading w='22rem'>{data?.post?.title}</Heading>
				</Box>
				{data?.post?.text}
				<Flex gap={4} bg='red'>
					<EditDeletePostButtons
						id={data.post.id}
						creatorId={data.post.creator.id}
					/>
				</Flex>
			</Flex>
		</>
	)
}

export default withUrqlClient(createUrqlClient)(Post)
