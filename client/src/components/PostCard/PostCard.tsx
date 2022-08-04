import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, IconButton, Stack, Text } from '@chakra-ui/react'
import { PostSnippetFragment, Users } from '../../generated/graphql'
import UpvoteSection from './UpvoteSection'

interface PostCardProps {
	post: PostSnippetFragment
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
	return (
		<Flex
			w='100%'
			key={post.id}
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
