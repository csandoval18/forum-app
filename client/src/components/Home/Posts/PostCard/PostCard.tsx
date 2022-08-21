import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { PostSnippetFragment, useMeQuery } from '../../../../generated/graphql'
import { createUrqlClient } from '../../../../utils/createUrqlClient'
import EditDeletePostButtons from '../../../EditDeletePostButtons'
import UpvoteSection from './UpvoteSection'

interface PostCardProps {
	post: PostSnippetFragment
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
	const [{ data }] = useMeQuery()

	return (
		<Flex
			className='post-card'
			maxW={'60rem'}
			p={6}
			borderRadius={12}
			shadow='dark-lg'
			alignItems={'center'}
		>
			<UpvoteSection post={post}></UpvoteSection>
			<Box flex='1'>
				<NextLink href='/post/[id]' as={`/post/${post.id}`}>
					<Link>
						<Heading fontSize='xl'>{post.title}</Heading>
					</Link>
				</NextLink>
				<Text mt={4}>Posted by {post.creator.username}</Text>
				<Text mt={4}>{post.textSnippet}</Text>
			</Box>
			<Flex justifyContent='right' gap={4}>
				{/* Component can be null for users that do not own the post */}
				<EditDeletePostButtons
					id={post.id}
					creatorId={post.creator.id}
				></EditDeletePostButtons>
			</Flex>
		</Flex>
	)
}

export default withUrqlClient(createUrqlClient)(PostCard)
