import { Box, Flex, Heading, IconButton, Link, Text } from '@chakra-ui/react'
import {
	PostSnippetFragment,
	useDeletePostMutation,
	useMeQuery,
} from '../../../../generated/graphql'
import NextLink from 'next/link'
import UpvoteSection from './UpvoteSection'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import Router from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../../../../utils/createUrqlClient'

interface PostCardProps {
	post: PostSnippetFragment
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
	const [, deletePost] = useDeletePostMutation()
	const [{ data }] = useMeQuery()

	const handleDeletePost = () => {
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
			{data?.me?.id !== post.creator.id ? null : (
				<Flex justifyContent='right' gap={4}>
					<NextLink href='/post/edit/[id]' as={`/post/edit/${post.id}`}>
						<IconButton
							icon={<EditIcon fontSize={20} />}
							aria-label='Edit post'
							onClick={() => {}}
						></IconButton>
					</NextLink>
					<IconButton
						icon={<DeleteIcon fontSize={20} />}
						aria-label='Delete post'
						// backgroundColor='red.400'
						onClick={handleDeletePost}
					></IconButton>
				</Flex>
			)}
		</Flex>
	)
}

export default withUrqlClient(createUrqlClient)(PostCard)
