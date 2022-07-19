import { Box } from '@chakra-ui/react'

interface WrapperProps {
	children: any
	h?: string
}

const Wrapper = ({ children, h }: WrapperProps) => {
	return (
		<Box
			// mt={8}
			mx='auto'
			maxW={'500px'}
			// maxW={variant === 'regular' ? '800px' : '450px'}
			h={h}
			// h={variant === 'regular' ? '480px' : '360px'}
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
