import React from 'react'
import { Form, Formik } from 'formik'
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	ColorModeScript,
	Button,
	Box,
} from '@chakra-ui/react'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { DarkModeSwitch } from '../components/chakra/DarkModeSwitch'
import Container from '../components/Container'
import { useMutation } from 'urql'
import { useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
	const [{}, register] = useRegisterMutation()

	const registerUser = async (values, { setErrors }) => {
		const response = await register(values)
		console.log(response)
		//? returns either errors or undefined
		if (response.data?.register.errors) {
			setErrors(toErrorMap(response.data.register.errors))
		}
	}
	return (
		<Container>
			<Wrapper variant='small'>
				{/* <DarkModeSwitch></DarkModeSwitch> */}
				<Formik
					initialValues={{ username: '', password: '' }}
					onSubmit={registerUser}
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

export default Register
