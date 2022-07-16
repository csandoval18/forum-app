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
			maxW={'450px'}
			// maxW={variant === 'regular' ? '800px' : '450px'}
			h={variant === 'regular' ? '480px' : '360px'}
			w='100%'
			backgroundColor={'whiteAlpha.300'}
			padding={'20px'}
			borderRadius={15}
		>
			{children}
		</Box>
	)
}

export default Wrapper
