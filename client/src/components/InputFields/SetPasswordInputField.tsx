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
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string
	name: string
}

// '' => false
//'error message' => true
const SetPasswordInputField: React.FC<InputFieldProps> = ({
	label,
	size: _,
	...props
}) => {
	//show or hide password input
	const [show, setShow] = useState(false)
	const [field, { error }] = useField(props)
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
						_light={{ bg: 'blackAlpha.100', _hover: { bg: 'primary' } }}
						_hover={{
							background: 'primary',
						}}
					>
						{show ? <ViewOffIcon /> : <ViewIcon />}
					</Button>
				</InputRightElement>
			</InputGroup>
			{error ? (
				<Box display='flex' alignItems='end' justifyContent='space-between'>
					<FormErrorMessage fontSize='md'>{error}</FormErrorMessage>
				</Box>
			) : (
				<div style={{ height: '29px' }}></div>
			)}
		</FormControl>
	)
}

export default SetPasswordInputField
