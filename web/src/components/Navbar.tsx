import { Box, ColorModeScript, Flex, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
	return (
		<Flex bg='black' p={4} color={'whiteAlpha.900'}>
			<Box p={4} ml={'auto'}>
				<NextLink href={'/login'}>
					<Link mr={10}>login</Link>
				</NextLink>
				<NextLink href={'/register'}>
					<Link>register</Link>
				</NextLink>
			</Box>
		</Flex>
	)
}

export default Navbar
