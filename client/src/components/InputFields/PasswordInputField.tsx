import React, { InputHTMLAttributes, useState } from 'react'
import { useField } from 'formik'
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	InputGroup,
	InputRightElement,
	Button,
	Box,
	Link,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string
	name: string
}

// '' => false
//'error message' => true
const InputField: React.FC<InputFieldProps> = ({
	label,
	size: _,
	...props
}) => {
	//show or hide password input
	const [field, { error }] = useField(props)
	const [show, setShow] = useState(false)
	const handleShowPass = () => setShow(!show)

	return (
		<FormControl isInvalid={!!error}>
			<FormLabel mt={5} htmlFor={field.name}>
				{label}
			</FormLabel>
			<InputGroup size='md'>
				<Input
					{...field}
					{...props}
					id={field.name}
					backgroundColor={'white'}
					bgColor={'white'}
					bg='white'
					paddingLeft={3}
					paddingRight={3}
					type={show ? 'text' : 'password'}
				/>
				<InputRightElement mr={3}>
					<Button
						h='1.75rem'
						size='sm'
						onClick={handleShowPass}
						bg='gray.300'
						_hover={{
							background: 'primary',
						}}
					>
						{show ? <ViewOffIcon /> : <ViewIcon />}
					</Button>
				</InputRightElement>
			</InputGroup>
			{error ? (
				<Box
					display='flex'
					alignItems='end'
					justifyContent='space-between'
				>
					<FormErrorMessage>{error}</FormErrorMessage>
					<NextLink href='/forgot-password'>
						<Link
							// mt={2}
							color='white'
							h='27px'
							display='flex'
							alignItems='end'
							justifyContent='right'
							fontSize={'sm'}
						>
							Forgot Password?
						</Link>
					</NextLink>
				</Box>
			) : (
				<NextLink href='/forgot-password'>
					<Link
						// mt={2}
						color='white'
						h='27px'
						display='flex'
						alignItems='end'
						justifyContent='right'
						fontSize='sm'
					>
						Forgot Password?
					</Link>
				</NextLink>
			)}
		</FormControl>
	)
}

export default InputField
