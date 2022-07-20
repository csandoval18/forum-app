import { Box, Button, Link, Textarea } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import React, { useEffect } from 'react'
import InputField from '../components/InputFields/InputField'
import Wrapper from '../components/Wrapper'
import NextLink from 'next/link'
import TextInputField from '../components/InputFields/TextInputField'
import {
	useCreatePostMutation,
	useMeQuery,
} from '../generated/graphql'
import { useRouter } from 'next/router'
import { createUrqlClient } from '../utils/createUrqlClient'
import { withUrqlClient } from 'next-urql'
import FormContainer from '../components/FormContainer'

const CreatePost: React.FC<{}> = () => {
	const [{ data, fetching }] = useMeQuery()
	const router = useRouter()
	const [{}, createPost] = useCreatePostMutation()
	useEffect(() => {
		//Not loading and there is no user signed in
		if (!fetching && !data?.me) {
			router.replace('/login')
		}
	}, [fetching, data, router])

	const handleCreatePost = async (values) => {
		const { error } = await createPost({ input: values })
		if (!error) {
			router.push('/')
		}
	}

	return (
		<FormContainer heading='Create Post'>
			<Wrapper h='430px'>
				{/* <DarkModeSwitch></DarkModeSwitch> */}
				<Formik
					initialValues={{ title: '', text: '' }}
					onSubmit={handleCreatePost}
				>
					{({ isSubmitting }) => (
						<Form>
							<InputField
								name='title'
								placeholder='title'
								label='Title'
							/>
							<TextInputField
								name='text'
								placeholder='text'
								label='Text'
							/>
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
