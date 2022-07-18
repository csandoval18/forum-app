import { Alert, AlertIcon, Box, Button, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import Router from 'next/router'
import { useState } from 'react'
import AuthContainer from '../../components/AuthContainer'
import InputField from '../../components/InputField'
import Wrapper from '../../components/Wrapper'
import { useChangePasswordMutation } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { toErrorMap } from '../../utils/toErrorMap'
import NextLink from 'next/link'
import PasswordInputField from '../../components/PasswordInputField'

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
	const [{}, changePassword] = useChangePasswordMutation()
	const [tokenError, setTokenError] = useState('')

	const handleChangePass = async (
		values: { newPassword: string },
		{ setErrors },
	) => {
		const response = await changePassword({
			newPassword: values.newPassword,
			token,
		})
		if (response.data?.changePassword.errors) {
			const errorMap = toErrorMap(response.data.changePassword.errors)
			console.log('errorMap:', errorMap)
			if ('token' in errorMap) {
				setTokenError(errorMap.token)
			}
			setErrors(errorMap)
		} else if (response.data?.changePassword.user) {
			//change password sucessful
			Router.push('/')
		}
	}
	return (
		<>
			<div>token: {token}</div>
			<AuthContainer heading='Change Password'>
				<Wrapper h='400'>
					{/* <DarkModeSwitch></DarkModeSwitch> */}
					<Formik
						initialValues={{ newPassword: '' }}
						onSubmit={handleChangePass}
					>
						{({ isSubmitting }) => (
							<Form>
								<PasswordInputField
									name='newPassword'
									placeholder='new password'
									label='New Password'
								/>
								<PasswordInputField
									name='confirmPassword'
									placeholder='confirm password'
									label='Confirm Password'
								/>
								{tokenError ? (
									<>
										<Alert status='error'>
											<AlertIcon />
											{tokenError}
											<NextLink href='/forgot-password'>
												<Link ml={2}>reset password</Link>
											</NextLink>
										</Alert>
									</>
								) : (
									<div style={{ height: '48px' }}></div>
								)}
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
										change password
									</Button>
								</Box>
							</Form>
						)}
					</Formik>
				</Wrapper>
			</AuthContainer>
		</>
	)
}

//can use getserverprops function but there is no reason this component has to solely run on the server
ChangePassword.getInitialProps = ({ query }) => {
	return {
		token: query.token as string,
	}
}

export default withUrqlClient(createUrqlClient)(ChangePassword)
