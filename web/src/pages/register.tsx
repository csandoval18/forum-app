import React from 'react'
import { Form, Formik } from 'formik'
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	ColorModeScript,
	Button,
} from '@chakra-ui/react'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { DarkModeSwitch } from '../components/chakra/DarkModeSwitch'
import Container from '../components/Container'
import { useMutation } from 'urql'

interface registerProps {}

const REGISTER_MUT = `
  mutation Register($username: String!, $password: String!) {
    register(options: {username: $username, password: $password}) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }
`

const Register: React.FC<registerProps> = ({}) => {
	const [{}, register] = useMutation(REGISTER_MUT)
	return (
		<Container>
			<Wrapper variant='small'>
				{/* <DarkModeSwitch></DarkModeSwitch> */}
				<Formik
					initialValues={{ username: '', password: '' }}
					onSubmit={(values) => {
						console.log(values)
						register(values)
					}}
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
							<Button
								type='submit'
								mt={4}
								isLoading={isSubmitting}
								// bg='#98d6e6'
								variant='primary'
							>
								Register
							</Button>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</Container>
	)
}

export default Register
