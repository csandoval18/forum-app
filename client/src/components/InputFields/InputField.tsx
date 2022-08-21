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
			<FormLabel mt={5} htmlFor={field.name}>
				{label}
			</FormLabel>
			<Input
				{...field}
				{...props}
				id={field.name}
				backgroundColor={'white'}
				bgColor={'white'}
				bg='white'
				paddingLeft={3}
				paddingRight={3}
			/>
			{error ? (
				<FormErrorMessage>{error}</FormErrorMessage>
			) : (
				<div style={{ height: '27px' }}></div>
			)}
		</FormControl>
	)
}

export default InputField
