import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, IconButton, Stack, Text } from '@chakra-ui/react'
import { Users } from '../generated/graphql'

interface PostCardProps {
	id: number
	points: number
	title: string
	username: string
	textSnippet: string
}

const PostCard: React.FC<PostCardProps> = (props) => {
	return (
		<Flex
			w='100%'
			key={props.id}
			p={6}
			borderRadius={12}
			shadow='lg'
			// borderWidth={1}
			bg='whiteAlpha.500'
			alignItems={'center'}
		>
			<Flex
				direction='column'
				justifyContent='center'
				alignItems='center'
				mr={6}
			>
				<IconButton
					aria-label='Upvote'
					icon={<ChevronUpIcon fontSize={20} />}
					backgroundColor='transparent'
				/>
				{props.points}
				<IconButton
					aria-label='Downvote'
					icon={<ChevronDownIcon fontSize={20} />}
					backgroundColor='transparent'
				/>
			</Flex>
			<Box>
				<Heading fontSize='xl'>{props.title}</Heading>
				<Text mt={4}>Posted by {props.username}</Text>
				<Text mt={4}>{props.textSnippet}</Text>
			</Box>
		</Flex>
	)
}

export default PostCard
