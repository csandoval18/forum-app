import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import FormContainer from '../components/FormContainer'
import InputField from '../components/InputFields/InputField'
import TextInputField from '../components/InputFields/TextInputField'
import Wrapper from '../components/Wrapper'
import { useCreatePostMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { useIsAuth } from '../utils/useIsAuth'

const CreatePost: React.FC<{}> = () => {
	const router = useRouter()
	const [{}, createPost] = useCreatePostMutation()
	useIsAuth()

	const handleCreatePost = async (values: { title: string; text: string }) => {
		const { error } = await createPost({ input: values })
		if (!error) {
			router.push('/')
		} else {
			console.log(error)
		}
	}

	return (
		<FormContainer>
			<Wrapper h='430px' heading='Create Post'>
				<Formik
					initialValues={{ title: '', text: '' }}
					onSubmit={handleCreatePost}
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

export default withUrqlClient(createUrqlClient)(CreatePost)
