import { Box } from '@chakra-ui/react'
import Container from '../components/Container'
import Navbar from '../components/Navbar'

const Index = () => (
	<Box
		bg={'red'}
		h={'100vh'}
		bgGradient='linear(to-l, heroGradientStart, heroGradientEnd)'
	>
		<Navbar>hello</Navbar>
	</Box>
)

export default Index
