import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton } from '@chakra-ui/react'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import React, { useState } from 'react'
import {
	PostSnippetFragment,
	useVoteMutation,
} from '../../../../generated/graphql'

interface UpvoteSectionProps {
	variant?: string
	post: PostSnippetFragment
}

const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post, variant }) => {
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

	let body: ReactJSXElement
	if (variant === 'desktop') {
		body = (
			<Flex
				justifyContent='left'
				alignItems='center'
				mr={6}
				gap={2}
				flexDir='column'
			>
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
					backgroundColor={post.voteStatus === -1 ? '' : 'transparent'}
					isLoading={loadingState === 'downvote-loading'}
					onClick={handleDownvote}
				/>
			</Flex>
		)
	} else {
		body = (
			<Flex justifyContent='left' alignItems='center' mr={6} gap={3}>
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
					backgroundColor={post.voteStatus === -1 ? '' : 'transparent'}
					isLoading={loadingState === 'downvote-loading'}
					onClick={handleDownvote}
				/>
			</Flex>
		)
	}

	return <>{body}</>
}

export default UpvoteSection
