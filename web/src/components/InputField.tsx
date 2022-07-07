import React, { InputHTMLAttributes } from 'react'
import { useField } from 'formik'
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
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
	const [field, { error }] = useField(props)
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<Input
				{...field}
				{...props}
				id={field.name}
				backgroundColor={'white'}
				bgColor={'white'}
				bg='white'
			/>
			<FormErrorMessage>{error}</FormErrorMessage>
		</FormControl>
	)
}

export default InputField
