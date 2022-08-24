import { Box, Button, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import Router, { useRouter } from 'next/router'
import React from 'react'
import Container from '../components/Container'
import InputField from '../components/InputFields/InputField'
import SetPasswordInputField from '../components/InputFields/SetPasswordInputField'
import Wrapper from '../components/Wrapper'
import { RegisterInputs, useRegisterMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
	const router = useRouter()
	const [{}, register] = useRegisterMutation()

	const handleRegister = async (values: RegisterInputs, { setErrors }) => {
		const response = await register({ options: values })
		console.log(response)
		//? returns either errors or undefined
		if (response.data?.register.errors) {
			setErrors(toErrorMap(response.data.register.errors))
		} else if (response.data?.register.user) {
			//registered successfully
			console.log('registraition succesful')
			Router.push('/')
		}
	}
	return (
		<Container center={true}>
			<Wrapper h='500px' heading='Register'>
				{/* <DarkModeSwitch></DarkModeSwitch> */}
				<Formik
					initialValues={{ email: '', username: '', password: '' }}
					onSubmit={handleRegister}
				>
					{({ isSubmitting }) => (
						<Form>
							<InputField
								name='username'
								placeholder='username'
								label='Username'
							/>
							<InputField name='email' placeholder='email' label='Email' />
							<SetPasswordInputField
								name='password'
								placeholder='password'
								label='Password'
								type='password'
							/>
							<Box
								display='flex'
								alignItems='center'
								justifyContent='space-between'
								mt={8}
							>
								<Box mt={2} fontSize={13}>
									Got an account?
									<NextLink href='/login'>
										<Link ml={2} color='primary' textDecor='underline'>
											Sign in
										</Link>
									</NextLink>
								</Box>
								<Button
									type='submit'
									isLoading={isSubmitting}
									variant='primary'
								>
									Register
								</Button>
							</Box>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</Container>
	)
}

export default withUrqlClient(createUrqlClient)(Register)
