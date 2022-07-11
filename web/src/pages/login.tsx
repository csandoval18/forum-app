import { Box, Button, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import Router, { useRouter } from 'next/router'
import React from 'react'
import Container from '../components/Container'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { useLoginMutation, UsernamePasswordInput } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'

interface loginProps {}

const Login: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{}, login] = useLoginMutation()

	const handleLoginUser = async (
		values: UsernamePasswordInput,
		{ setErrors },
	) => {
		const response = await login({ options: values })
		console.log(response)
		//? returns either errors or undefined
		if (response.data?.login.errors) {
			setErrors(toErrorMap(response.data.login.errors))
		} else if (response.data?.login.user) {
			//logined successfully
			console.log('worked')
			Router.push('/')
		}
	}
	return (
		<Container>
			<Heading mb={7} mt={7} ml={2} width={'450px'} color='whiteAlpha.800'>
				Login
			</Heading>
			<Wrapper variant='small'>
				{/* <DarkModeSwitch></DarkModeSwitch> */}
				<Formik
					initialValues={{ username: '', password: '' }}
					onSubmit={handleLoginUser}
				>
					{({ isSubmitting }) => (
						<Form>
							<InputField
								name='username'
								placeholder='username'
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
		</Container>
	)
}

export default withUrqlClient(createUrqlClient)(Login)
