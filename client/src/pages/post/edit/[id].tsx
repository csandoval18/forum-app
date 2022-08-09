import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import FormContainer from '../../../components/FormContainer'
import InputField from '../../../components/InputFields/InputField'
import TextInputField from '../../../components/InputFields/TextInputField'
import Wrapper from '../../../components/Wrapper'
import { useUpdatePostMutation } from '../../../generated/graphql'
import { createUrqlClient } from '../../../utils/createUrqlClient'
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl'

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
	const [{ data, fetching }] = useGetPostFromUrl()
	const [, updatePost] = useUpdatePostMutation()

	if (fetching) {
		return <div>loading...</div>
	}
	if (!data?.post) return <div>Could not find post</div>

	return (
		<FormContainer>
			<Wrapper h='430px' heading='Edit Post'>
				<Formik
					initialValues={{ title: data.post.title, text: data.post.text }}
					onSubmit={() => {}}
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
