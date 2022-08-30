import { Box, Flex, Heading, Text, useColorMode } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { PostSnippetFragment, useMeQuery } from '../../../../generated/graphql'
import { createUrqlClient } from '../../../../utils/createUrqlClient'
import { PostCardProps } from './PostCard'
import UpvoteSection from './UpvoteSection'

const PostCardDesktop: React.FC<PostCardProps> = ({ post }) => {
	const [{ data }] = useMeQuery()
	const { colorMode, toggleColorMode } = useColorMode()
	return (
		<Flex
			className='post-card-desktop'
			backgroundColor={colorMode === 'light' ? 'white' : 'secondary'}
			// h={['10rem', '10rem', '10rem', '14rem']}
			w={['22rem', '40rem', '40rem', '40rem', '40rem']}
			borderRadius={8}
			shadow='dark-lg'
		>
			<Flex
				px={3}
				flexDir='column'
				alignContent='center'
				justifyContent='center'
			>
				<UpvoteSection post={post} variant={'desktop'}></UpvoteSection>
			</Flex>
			<NextLink href='/post/[id]' as={`/post/${post.id}`}>
				<Flex
					flexDir='column'
					cursor='pointer'
					minH='5rem'
					px={3}
					justifyContent='space-between'
				>
					<Heading fontSize='xl' my={5} w='100%' wordBreak='break-word'>
						{post.title}
					</Heading>
					<Text my={5}>Posted by: {post.creator.username}</Text>
				</Flex>
			</NextLink>
		</Flex>
	)
}

export default withUrqlClient(createUrqlClient)(PostCardDesktop)
