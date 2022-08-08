import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import FormContainer from '../../../components/FormContainer'
import InputField from '../../../components/InputFields/InputField'
import TextInputField from '../../../components/InputFields/TextInputField'
import Wrapper from '../../../components/Wrapper'
import { useUpdatePostMutation } from '../../../generated/graphql'
import { createUrqlClient } from '../../../utils/createUrqlClient'

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = () => {
	const router = useRouter()
	const [{}, updatePost] = useUpdatePostMutation()

	const handleUpdatePost = async (values: { title: string; text: string }) => {
		console.log('flag')
		const { error } = await updatePost()
		if (!error) {
			router.push('/')
		} else {
			console.log(error)
		}
	}

	return (
		<FormContainer heading='Create Post'>
			<Wrapper h='430px'>
				{/* <DarkModeSwitch></DarkModeSwitch> */}
				<Formik
					initialValues={{ title: '', text: '' }}
					onSubmit={handleUpdatePost}
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
									create post
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
