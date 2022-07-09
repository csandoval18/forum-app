import { Box, Center, Flex, flexbox } from '@chakra-ui/react'

const Container = ({ children }) => {
	return (
		<Center
			bgGradient='linear(to-l, heroGradientStart, heroGradientEnd)'
			padding={'20px'}
			h={'100vh'}
			alignItems={'center'}
			justifyContent={'center'}
			flexDirection='column'
		>
			{children}
		</Center>
	)
}

export default Container
