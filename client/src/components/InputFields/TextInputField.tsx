import React, { TextareaHTMLAttributes } from 'react'
import { useField } from 'formik'
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Textarea,
} from '@chakra-ui/react'

type TextInputFieldProps =
	TextareaHTMLAttributes<HTMLTextAreaElement> & {
		label: string
		name: string
	}

// '' => false
//'error message' => true
const TextInputField: React.FC<TextInputFieldProps> = ({
	label,
	...props
}) => {
	const [field, { error }] = useField(props)
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel mt={5} htmlFor={field.name}>
				{label}
			</FormLabel>
			<Textarea
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

export default TextInputField
