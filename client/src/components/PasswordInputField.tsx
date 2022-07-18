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
} from '@chakra-ui/react'

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
	const [show, setShow] = useState(false)
	const [field, { error }] = useField(props)
	const handleShowPass = () => setShow(!show)

	return (
		<FormControl isInvalid={!!error}>
			<FormLabel mt={4} htmlFor={field.name}>
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
					<Button h='1.75rem' size='sm' onClick={handleShowPass}>
						{show ? 'Hide' : 'Show'}
					</Button>
				</InputRightElement>
			</InputGroup>
			{error ? (
				<FormErrorMessage>{error}</FormErrorMessage>
			) : (
				<div style={{ height: '27px' }}></div>
			)}
		</FormControl>
	)
}

export default InputField
