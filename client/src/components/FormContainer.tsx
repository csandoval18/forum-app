import {
	Box,
	Center,
	Container,
	Flex,
	flexbox,
	Heading,
} from '@chakra-ui/react'
import Navbar from './Home/Navbar'

interface BodyContainerProps {
	children: any
	heading: string
}

const FormContainer = ({ children, heading }: BodyContainerProps) => {
	return (
		<>
			<Navbar />
			<Center
				p={0}
				w={'100%'}
				minH='100vh'
				// bgGradient='linear(to-l,heroGradientStart, heroGradientEnd)'
				// bgGradient='linear(to-t, #222231 8%, #233349 30%, #7bcae9)'
				bgGradient='linear(to-b, #222231 8%, #233349 30%, primary)'
			>
				<Box>
					<Heading mb={7} ml={2} width={'500px'} color='white'>
						{heading}
					</Heading>
					{children}
				</Box>
			</Center>
		</>
	)
}

export default FormContainer
