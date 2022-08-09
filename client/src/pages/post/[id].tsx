import { Box, Flex, Heading } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
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
				width={'95%'}
				justifyContent='space-between'
				backgroundColor='primary'
				alignItems='center'
				py={8}
				px={10}
				mx={8}
				my={8}
				borderRadius='12px'
			>
				<Box>
					<Heading>{data?.post?.title}</Heading>
					{data?.post?.text}
				</Box>
				<Flex gap={4}>
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
