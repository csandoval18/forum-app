import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { PostSnippetFragment } from '../../../../generated/graphql'
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
			shadow='lg'
			// borderWidth={1}
			bg='whiteAlpha.500'
			alignItems={'center'}
		>
			<UpvoteSection post={post}></UpvoteSection>
			<Box>
				<Heading fontSize='xl'>{post.title}</Heading>
				<Text mt={4}>Posted by {post.creator.username}</Text>
				<Text mt={4}>{post.textSnippet}</Text>
			</Box>
		</Flex>
	)
}

export default PostCard
