import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton } from '@chakra-ui/react'
import React from 'react'
import { PostSnippetFragment } from '../../generated/graphql'

interface UpvoteSectionProps {
	points: number
}

const UpvoteSection: React.FC<UpvoteSectionProps> = (post) => {
	return (
		<Flex direction='column' justifyContent='center' alignItems='center' mr={6}>
			<IconButton
				aria-label='Upvote'
				icon={<ChevronUpIcon fontSize={20} />}
				backgroundColor='transparent'
				onClick={() => console.log('yo')}
			/>
			<Box>{post.points}</Box>

			<IconButton
				aria-label='Downvote'
				icon={<ChevronDownIcon fontSize={20} />}
				backgroundColor='transparent'
			/>
		</Flex>
	)
}

export default UpvoteSection
