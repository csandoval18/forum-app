import { Box } from '@chakra-ui/react'

interface WrapperProps {
	children: any
	variant?: 'small' | 'regular'
}

const Wrapper = ({ children, variant = 'regular' }: WrapperProps) => {
	return (
		<Box
			// mt={8}
			mx='auto'
			maxW={variant === 'regular' ? '800px' : '450px'}
			w='100%'
			h={360}
			backgroundColor={'whiteAlpha.300'}
			padding={'20px'}
			borderRadius={15}
		>
			{children}
		</Box>
	)
}

export default Wrapper
