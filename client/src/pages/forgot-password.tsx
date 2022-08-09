import { Alert, AlertIcon, Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import FormContainer from '../components/FormContainer'
import InputField from '../components/InputFields/InputField'
import Wrapper from '../components/Wrapper'
import { useForgotPasswordMutation } from '../generated/graphql'

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<{}> = () => {
	const [complete, setComplete] = useState(false)
	const [{}, forgotPassword] = useForgotPasswordMutation()

	const handleForgotPassword = async (values, { setErrors }) => {
		await forgotPassword(values)
		setComplete(true)
	}

	return (
		<FormContainer center={true}>
			<Wrapper h='330px' heading='Forgot Password'>
				{/* <DarkModeSwitch></DarkModeSwitch> */}
				<Formik initialValues={{ email: '' }} onSubmit={handleForgotPassword}>
					{({ isSubmitting }) =>
						complete ? (
							<Alert status='info'>
								<AlertIcon />
								An email has been sent to the email address linked with the
								account.
							</Alert>
						) : (
							<Form>
								<Box
									display='flex'
									alignItems='center'
									px={4}
									borderRadius='8px'
									my={6}
									fontSize='lg'
									color='whiteAlpha.800'
									bg='black'
									h={12}
								>
									Enter the email linked to your account.
								</Box>
								<InputField
									name='email'
									placeholder='email'
									label='Email'
									type='email'
								/>
								<Box
									display={'flex'}
									alignItems={'center'}
									justifyContent={'right'}
									mt={8}
								>
									<Button
										type='submit'
										isLoading={isSubmitting}
										variant='primary'
									>
										Send Email
									</Button>
								</Box>
							</Form>
						)
					}
				</Formik>
			</Wrapper>
		</FormContainer>
	)
}

export default ForgotPassword
