import { Box, Button, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import Router, { useRouter } from 'next/router'
import React from 'react'
import AuthContainer from '../components/AuthContainer'
import InputField from '../components/InputFields/InputField'
import SetPasswordInputField from '../components/InputFields/SetPasswordInputField'
import Wrapper from '../components/Wrapper'
import {
	RegisterInputs,
	useRegisterMutation,
} from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
	const router = useRouter()
	const [{}, register] = useRegisterMutation()

	const handleRegister = async (
		values: RegisterInputs,
		{ setErrors },
	) => {
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
		<AuthContainer heading='Register'>
			<Wrapper h='480px'>
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
							<InputField
								name='email'
								placeholder='email'
								label='Email'
							/>
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
								<Box mt={2}>
									Already have an account?
									<NextLink href='/login'>
										<Link ml={2} color='white'>
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
		</AuthContainer>
	)
}

export default withUrqlClient(createUrqlClient)(Register)
