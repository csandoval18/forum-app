import { Box, Flex, Heading } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import EditDeletePostButtons from '../../components/EditDeletePostButtons'
import Navbar from '../../components/Home/Navbar'
import UpvoteSection from '../../components/Home/Posts/PostCard/UpvoteSection'
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
			<Box className='post-selection-container' width='100%' my={6} px={6}>
				<Flex>
					<UpvoteSection post={data.post} variant='desktop' />
					<Flex width='100%' flexDir={'column'}>
						<Flex
							justifyContent='center'
							alignItems='center'
							flexDir='column'
							gap={8}
							bg='red'
						>
							<Heading
								display='flex'
								justifyContent='center'
								alignItems='center'
								w={['20rem', '40rem', '40rem', '40rem', '60rem']}
								fontSize={20}
							>
								{data?.post?.title}
							</Heading>
							<Flex
								w={['20rem', '40rem', '40rem', '40rem', '60rem']}
								alignItems='center'
								justifyContent='center'
							>
								{data?.post?.text}
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Flex gap={4} justifyContent='right' bg='blue'>
					<EditDeletePostButtons
						id={data.post.id}
						creatorId={data.post.creator.id}
					/>
				</Flex>
			</Box>
		</>
	)
}

export default withUrqlClient(createUrqlClient)(Post)
