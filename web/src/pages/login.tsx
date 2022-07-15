import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import Router, { useRouter } from 'next/router'
import React from 'react'
import InputField from '../components/InputField'
import RegisterLoginContainer from '../components/RegisterLoginContainer'
import Wrapper from '../components/Wrapper'
import { LoginInputs, useLoginMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'

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
		<RegisterLoginContainer heading='Log In'>
			<Wrapper variant='small'>
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
							></InputField>
							<InputField
								name='password'
								placeholder='password'
								label='Password'
								type='password'
							></InputField>
							<Box
								display={'flex'}
								alignItems={'center'}
								justifyContent={'right'}
							>
								<Button
									type='submit'
									mt={6}
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
		</RegisterLoginContainer>
	)
}

export default withUrqlClient(createUrqlClient)(Login)
