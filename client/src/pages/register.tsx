import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import Router, { useRouter } from 'next/router'
import React from 'react'
import AuthContainer from '../components/AuthContainer'
import InputField from '../components/InputField'
import PasswordInputField from '../components/PasswordInputField'
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
							<PasswordInputField
								name='password'
								placeholder='password'
								label='Password'
								type='password'
							/>
							<Box
								display={'flex'}
								alignItems={'center'}
								justifyContent={'right'}
							>
								<Button
									type='submit'
									mt={8}
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
