import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { useDeletePostMutation, useMeQuery } from '../generated/graphql'

interface EditDeletePostButtonsProps {
	id: number
	creatorId: number
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
	id,
	creatorId,
}) => {
	const [{ data }] = useMeQuery()
	const [, deletePost] = useDeletePostMutation()

	if (data?.me?.id !== creatorId) return null

	return (
		<>
			<NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
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
				onClick={() => {
					deletePost({ id: id })
				}}
			></IconButton>
		</>
	)
}

export default EditDeletePostButtons
