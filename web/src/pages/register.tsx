import { Box, Button, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import Router, { useRouter } from 'next/router'
import React from 'react'
import Container from '../components/Container'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import {
	useRegisterMutation,
	UsernamePasswordInput,
} from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
	const router = useRouter()
	const [{}, register] = useRegisterMutation()

	const handleRegisterUser = async (
		values: UsernamePasswordInput,
		{ setErrors },
	) => {
		const response = await register(values)
		console.log(response)
		//? returns either errors or undefined
		if (response.data?.register.errors) {
			setErrors(toErrorMap(response.data.register.errors))
		} else if (response.data?.register.user) {
			//registered successfully
			console.log('worked')
			Router.push('/')
		}
	}
	return (
		<Container>
			<Heading mb={7} mt={7} ml={2} width={'450px'} color='whiteAlpha.800'>
				Register
			</Heading>
			<Wrapper variant='small'>
				{/* <DarkModeSwitch></DarkModeSwitch> */}
				<Formik
					initialValues={{ username: '', password: '' }}
					onSubmit={handleRegisterUser}
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
