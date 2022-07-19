import { Box, Button, Link } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import React, { useState } from 'react'
import AuthContainer from '../components/AuthContainer'
import InputField from '../components/InputFields/InputField'
import PasswordInputField from '../components/InputFields/PasswordInputField'
import Wrapper from '../components/Wrapper'
import NextLink from 'next/link'
import { useForgotPasswordMutation } from '../generated/graphql'

interface ForgotPassword {}

const ForgotPassword: React.FC<{}> = () => {
	const [complete, setComplete] = useState(false)
	const [{}, forgotPassword] = useForgotPasswordMutation()

	const handleForgotPassword = async (values, { setErrors }) => {
		await forgotPassword(values)
		setComplete(true)
	}

	return (
		<AuthContainer heading='Forgot Password'>
			<Wrapper h='270px'>
				{/* <DarkModeSwitch></DarkModeSwitch> */}
				<Formik
					initialValues={{ email: '' }}
					onSubmit={handleForgotPassword}
				>
					{({ isSubmitting }) =>
						complete ? (
							<Box>
								If an account with that email exists, an email with a
								link to change your password has been sent.
							</Box>
						) : (
							<Form>
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
									mt={12}
								>
									{/* <Box>
										Dont have an account?
										<NextLink href='/register'>
											<Link ml={2} color={'white'}>
												Register
											</Link>
										</NextLink>
									</Box> */}

									<Button
										type='submit'
										isLoading={isSubmitting}
										variant='primary'
									>
										forgot password
									</Button>
								</Box>
							</Form>
						)
					}
				</Formik>
			</Wrapper>
		</AuthContainer>
	)
}

export default ForgotPassword
