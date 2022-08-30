import { Box, Flex, Heading, Text, useColorMode } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { PostSnippetFragment, useMeQuery } from '../../../../generated/graphql'
import { createUrqlClient } from '../../../../utils/createUrqlClient'
import UpvoteSection from './UpvoteSection'

export interface PostCardProps {
	post: PostSnippetFragment
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
	const [{ data }] = useMeQuery()
	const { colorMode, toggleColorMode } = useColorMode()
	return (
		<Flex
			className='post-card-mobile'
			backgroundColor={colorMode === 'light' ? 'white' : 'secondary'}
			h={['10rem', '10rem', '10rem', '12rem']}
			w={['22rem', '40rem', '40rem', '40rem', '60rem']}
			pb={4}
			borderRadius={8}
			shadow='dark-lg'
			flexDir='column'
		>
			<NextLink href='/post/[id]' as={`/post/${post.id}`}>
				<Box flex='1' cursor='pointer' minH='5rem' px={3}>
					<Heading fontSize='xl' my={4} w='100%'>
						{post.title}
					</Heading>
				</Box>
			</NextLink>
			<Flex px={3}>
				<UpvoteSection post={post}></UpvoteSection>
				<Text mt={4}>Posted by: {post.creator.username}</Text>
			</Flex>
		</Flex>
	)
}

export default withUrqlClient(createUrqlClient)(PostCard)
