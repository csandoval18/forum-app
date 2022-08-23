import { Box, Heading } from '@chakra-ui/react'

interface WrapperProps {
	children: any
	h?: string
	heading?: string
}

const Wrapper = ({ children, h, heading }: WrapperProps) => {
	return (
		<div className='loggin-content'>
			<Heading mb={7} ml={1} width='100%'>
				{heading}
			</Heading>
			<Box
				w='21.5rem'
				h={h}
				backgroundColor={'whiteAlpha.100'}
				shadow='2xl'
				padding={'20px'}
				borderRadius={15}
			>
				{children}
			</Box>
		</div>
	)
}

export default Wrapper
