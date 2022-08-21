import { Box, Heading } from '@chakra-ui/react'

interface WrapperProps {
	children: any
	h?: string
	heading?: string
}

const Wrapper = ({ children, h, heading }: WrapperProps) => {
	return (
		<>
			<Heading mb={7} ml={2} width={'500px'} color='white'>
				{heading}
			</Heading>
			<Box
				// mt={8}
				mx='auto'
				h={h}
				backgroundColor={'whiteAlpha.500'}
				shadow='xl'
				padding={'20px'}
				borderRadius={15}
			>
				{children}
			</Box>
		</>
	)
}

export default Wrapper
