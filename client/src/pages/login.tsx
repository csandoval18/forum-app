import { Box, Button, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import Router, { useRouter } from 'next/router'
import React from 'react'
import FormContainer from '../components/FormContainer'
import InputField from '../components/InputFields/InputField'
import PasswordInputField from '../components/InputFields/PasswordInputField'
import Wrapper from '../components/Wrapper'
import { LoginInputs, useLoginMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'
import NextLink from 'next/link'

interface loginProps {}

const Login: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{}, login] = useLoginMutation()

	const handleLogin = async (values: LoginInputs, { setErrors }) => {
		const response = await login({ options: values })
		console.log('login:', response.data)
		//? returns either errors or undefined
		if (response.data?.login.errors) {
			setErrors(toErrorMap(response.data.login.errors))
		} else if (response.data?.login.user) {
			//logined successfully
			console.log('login success')
			Router.push('/')
		}
	}
	return (
		<FormContainer heading='Log In'>
			<Wrapper h='400px'>
				{/* <DarkModeSwitch></DarkModeSwitch> */}
				<Formik
					initialValues={{ usernameOrEmail: '', password: '' }}
					onSubmit={handleLogin}
				>
					{({ isSubmitting }) => (
						<Form>
							<InputField
								name='usernameOrEmail'
								placeholder='username or email'
								label='Username'
							/>
							<PasswordInputField
								name='password'
								placeholder='password'
								label='Password'
								type='password'
							/>
							<Box
								display={'flex'}
								alignItems={'center'}
								justifyContent={'space-between'}
								mt={12}
							>
								<Box>
									Dont have an account?
									<NextLink href='/register'>
										<Link ml={2} color={'white'}>
											Register
										</Link>
									</NextLink>
								</Box>
								<Button
									type='submit'
									isLoading={isSubmitting}
									variant='primary'
								>
									login
								</Button>
							</Box>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</FormContainer>
	)
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Login)
