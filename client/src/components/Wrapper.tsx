import { Box, Heading } from '@chakra-ui/react'

interface WrapperProps {
	children: any
	h?: string
	heading?: string
}

const Wrapper = ({ children, h, heading }: WrapperProps) => {
	return (
		<>
			<Heading mb={7} ml={2} width='100%'>
				{heading}
			</Heading>
			<Box
				h={h}
				backgroundColor={'whiteAlpha.100'}
				shadow='2xl'
				padding={'20px'}
				borderRadius={15}
			>
				{children}
			</Box>
		</>
	)
}

export default Wrapper
