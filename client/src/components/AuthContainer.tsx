import {
	Box,
	Center,
	Container,
	Flex,
	flexbox,
	Heading,
} from '@chakra-ui/react'

interface BodyContainerProps {
	children: any
	heading: string
}

const AuthContainer = ({ children, heading }: BodyContainerProps) => {
	return (
		<Flex>
			<Box
				p={0}
				pt={'15%'}
				w={'100%'}
				maxW={'1000vh'}
				h={'100%'}
				minH={'100vh'}
				className='login-register-container'
				bgGradient='linear(to-l,
			heroGradientStart, heroGradientEnd)'
			>
				<Center>
					<Heading
						mb={7}
						ml={2}
						width={'450px'}
						color='whiteAlpha.800'
					>
						{heading}
					</Heading>
				</Center>
				{children}
			</Box>
		</Flex>
	)
}

export default AuthContainer
