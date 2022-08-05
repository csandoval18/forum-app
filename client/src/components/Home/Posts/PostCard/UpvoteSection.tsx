import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
	PostSnippetFragment,
	useVoteMutation,
} from '../../../../generated/graphql'

interface UpvoteSectionProps {
	post: PostSnippetFragment
}

const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
	const [loadingState, setLoadingState] = useState<
		'upvote-loading' | 'downvote-loading' | 'not-loading'
	>('not-loading')
	const [, vote] = useVoteMutation()

	const handleUpvote = async () => {
		// Checks if vote has been set
		console.log('voteStatus:', post.voteStatus)
		if (post.voteStatus === 1) return

		setLoadingState('upvote-loading')
		await vote({
			postId: post.id,
			value: 1,
		})
		setLoadingState('not-loading')
	}

	const handleDownvote = async () => {
		// Checks if vote has been set
		console.log('voteStatus:', post.voteStatus)
		if (post.voteStatus === -1) return

		setLoadingState('downvote-loading')
		await vote({
			postId: post.id,
			value: -1,
		})
		setLoadingState('not-loading')
	}

	return (
		<Flex direction='column' justifyContent='center' alignItems='center' mr={6}>
			<IconButton
				aria-label='Upvote'
				icon={<ChevronUpIcon fontSize={20} />}
				backgroundColor={post.voteStatus === 1 ? 'primary' : 'transparent'}
				isLoading={loadingState === 'upvote-loading'}
				onClick={handleUpvote}
			/>
			<Box>{post.points}</Box>

			<IconButton
				aria-label='Downvote'
				icon={<ChevronDownIcon fontSize={20} />}
				backgroundColor={post.voteStatus === -1 ? 'red' : 'transparent'}
				isLoading={loadingState === 'downvote-loading'}
				onClick={handleDownvote}
			/>
		</Flex>
	)
}

export default UpvoteSection