import {
	Box,
	chakra,
	extendTheme,
	Flex,
	forwardRef,
	Heading,
	HTMLChakraProps,
	Link,
	Text,
	ThemingProps,
	useColorMode,
	useStyleConfig,
} from '@chakra-ui/react'
import { StyleConfig } from '@chakra-ui/theme-tools'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { CustomBadge } from '../../../../CustomComponentStyles/CustomBadge'
import { PostSnippetFragment, useMeQuery } from '../../../../generated/graphql'
import { createUrqlClient } from '../../../../utils/createUrqlClient'
import EditDeletePostButtons from '../../../EditDeletePostButtons'
import UpvoteSection from './UpvoteSection'

interface PostCardProps {
	post: PostSnippetFragment
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
	const [{ data }] = useMeQuery()
	const { colorMode, toggleColorMode } = useColorMode()
	return (
		<Flex
			flex={1}
			backgroundColor={colorMode === 'light' ? 'white' : 'secondary'}
			className='post-card'
			h='16rem'
			w='22rem'
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
