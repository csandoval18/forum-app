import { Box, Center, Flex, Heading } from '@chakra-ui/react'
import Navbar from './Home/Navbar'

interface BodyContainerProps {
	children: any
	center?: boolean
}

const FormContainer = ({ children, center }: BodyContainerProps) => {
	let body = <div></div>

	if (center) {
		body = (
			<Flex
				p={0}
				w={'100%'}
				minH='100vh'
				bgGradient='linear(to-b, #222231 8%, #233349 30%, primary)'
				justifyContent={'center'}
				paddingTop={'20%'}
			>
				<Box>{children}</Box>
			</Flex>
		)
	} else {
		body = (
			<Flex
				justifyContent='center'
				p={0}
				pt={8}
				minH='100vh'
				bgGradient='linear(to-b, #222231 8%, #233349 30%, primary)'
			>
				<Box>{children}</Box>
			</Flex>
		)
	}

	return (
		<>
			<Navbar pageProps={undefined} />
			{body}
		</>
	)
}

export default FormContainer
