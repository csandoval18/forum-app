import { Box, Flex, propNames } from '@chakra-ui/react'
import Navbar from './Home/Navbar'

interface BodyContainerProps {
	children: any
	center?: boolean
	className?: string
}

const Container = ({ children, center, className }: BodyContainerProps) => {
	let body = <div></div>

	if (center) {
		body = (
			<Flex
				w={'100%'}
				minH='94.8vh'
				justifyContent={'center'}
				paddingTop={'10%'}
				className={className}
				// bgGradient='linear(to-b, #222231 8%, #233349 30%, primary)'
			>
				<Box>{children}</Box>
			</Flex>
		)
	} else {
		body = (
			<Flex
				justifyContent='center'
				w='100%'
				p={0}
				pt={8}
				minH='94.8vh'
				className={className}
				// bgGradient='linear(to-b, #222231 8%, #233349 30%, primary)'
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

export default Container
