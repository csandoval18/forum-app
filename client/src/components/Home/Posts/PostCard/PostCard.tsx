import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react'
import { PostSnippetFragment } from '../../../../generated/graphql'
import NextLink from 'next/link'
import UpvoteSection from './UpvoteSection'

interface PostCardProps {
	post: PostSnippetFragment
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
	return (
		<Flex
			className='post-card'
			w='100%'
			p={6}
			borderRadius={12}
			shadow='dark-lg'
			// borderWidth={1}
			bg='white'
			alignItems={'center'}
		>
			<UpvoteSection post={post}></UpvoteSection>
			<Box>
				<NextLink href='/post/[id]' as={`/post/${post.id}`}>
					<Link>
						<Heading fontSize='xl'>{post.title}</Heading>
					</Link>
				</NextLink>
				<Text mt={4}>Posted by {post.creator.username}</Text>
				<Text mt={4}>{post.textSnippet}</Text>
			</Box>
		</Flex>
	)
}

export default PostCard
