import { Alert, AlertIcon, Box, Button, Flex, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import FormContainer from '../../components/FormContainer'
import SetPasswordInputField from '../../components/InputFields/SetPasswordInputField'
import Wrapper from '../../components/Wrapper'
import { useChangePasswordMutation } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { toErrorMap } from '../../utils/toErrorMap'

const ChangePassword: NextPage<{ token: string }> = () => {
	const router = useRouter()
	console.log(router.query)
	const [{}, changePassword] = useChangePasswordMutation()
	const [tokenError, setTokenError] = useState('')

	const handleChangePass = async (
		values: { newPassword: string },
		{ setErrors },
	) => {
		const response = await changePassword({
			newPassword: values.newPassword,
			token: typeof router.query.token === 'string' ? router.query.token : '',
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
			router.push('/')
		}
	}
	return (
		<FormContainer>
			<Wrapper h='420' heading='Change Password'>
				{/* <DarkModeSwitch></DarkModeSwitch> */}
				<Formik initialValues={{ newPassword: '' }} onSubmit={handleChangePass}>
					{({ isSubmitting }) => (
						<Form>
							<SetPasswordInputField
								name='newPassword'
								placeholder='new password'
								label='New Password'
							/>
							<SetPasswordInputField
								name='confirmPassword'
								placeholder='confirm password'
								label='Confirm Password'
							/>
							{tokenError ? (
								<>
									<Alert status='error'>
										<Flex w={'50%'}>
											<AlertIcon />
											{tokenError}
										</Flex>
										<Flex w={'50%'} justifyContent='right'>
											<NextLink href='/forgot-password'>
												<Link textDecor={'underline'}>reset password</Link>
											</NextLink>
										</Flex>
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
		</FormContainer>
	)
}

export default withUrqlClient(createUrqlClient)(ChangePassword)
