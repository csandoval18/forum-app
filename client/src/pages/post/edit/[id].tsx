import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import FormContainer from '../../../components/FormContainer'
import InputField from '../../../components/InputFields/InputField'
import TextInputField from '../../../components/InputFields/TextInputField'
import Wrapper from '../../../components/Wrapper'
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql'
import { createUrqlClient } from '../../../utils/createUrqlClient'
import { useGetIntId } from '../../../utils/useGetIntId'

const EditPost: React.FC = ({}) => {
	const router = useRouter()
	const intId = useGetIntId()
	const [{ data, fetching }] = usePostQuery({
		pause: intId === -1,
		variables: {
			id: intId,
		},
	})
	const [, updatePost] = useUpdatePostMutation()

	if (fetching) {
		return <div>loading...</div>
	}
	if (!data?.post) return <div>Could not find post</div>

	const handleEditPost = async (values) => {
		await updatePost({ id: intId, ...values })
		router.back()
		// router.push('/')
	}

	return (
		<FormContainer>
			<Wrapper h='430px' heading='Edit Post'>
				<Formik
					initialValues={{ title: data.post.title, text: data.post.text }}
					onSubmit={handleEditPost}
				>
					{({ isSubmitting }) => (
						<Form>
							<InputField name='title' placeholder='title' label='Title' />
							<TextInputField name='text' placeholder='text' label='Text' />
							<Box
								display='flex'
								alignItems='center'
								justifyContent='right'
								mt={12}
							>
								<Button
									type='submit'
									isLoading={isSubmitting}
									variant='primary'
								>
									Update Post
								</Button>
							</Box>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</FormContainer>
	)
}

export default withUrqlClient(createUrqlClient)(EditPost)
