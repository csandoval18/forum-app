import { Box, Flex, Heading, IconButton, Link, Text } from '@chakra-ui/react'
import {
	PostSnippetFragment,
	useDeletePostMutation,
} from '../../../../generated/graphql'
import NextLink from 'next/link'
import UpvoteSection from './UpvoteSection'
import { DeleteIcon } from '@chakra-ui/icons'

interface PostCardProps {
	post: PostSnippetFragment
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
	const [, deletePost] = useDeletePostMutation()

	const handleDeletePost = () => {
		console.log('postId:', post.id)
		deletePost({ id: post.id })
	}
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
			<Box flex='1'>
				<NextLink href='/post/[id]' as={`/post/${post.id}`}>
					<Link>
						<Heading fontSize='xl'>{post.title}</Heading>
					</Link>
				</NextLink>
				<Text mt={4}>Posted by {post.creator.username}</Text>
				<Text mt={4}>{post.textSnippet}</Text>
			</Box>
			<Flex justifyContent='right'>
				<IconButton
					icon={<DeleteIcon fontSize={20} />}
					aria-label='Delete post'
					backgroundColor='red.400'
					onClick={handleDeletePost}
				></IconButton>
			</Flex>
		</Flex>
	)
}

export default PostCard
