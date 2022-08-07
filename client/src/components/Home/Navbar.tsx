import { Box, Button, Flex, Link, useColorMode } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../../generated/graphql'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
	const router = useRouter()
	const { colorMode, toggleColorMode } = useColorMode()
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
	const [{ data, fetching }] = useMeQuery({})
	let body = null

	//data is loading
	if (fetching) {
		//user not logged in
	} else if (!data?.me) {
		body = (
			<Flex gap={8}>
				<NextLink href={'/login'}>
					<Link>login</Link>
				</NextLink>
				<NextLink href={'/register'}>
					<Link>register</Link>
				</NextLink>
			</Flex>
		)
		//user is logged in
	} else {
		body = (
			<Flex gap={8}>
				<Box>{data.me.username} </Box>
				<Button
					onClick={async () => {
						await logout()
						//Need to use window route chaning so cookie can be destroyed with refresh of page
						window.location.href = '/login'
					}}
					variant={'link'}
					isLoading={logoutFetching}
				>
					logout
				</Button>
			</Flex>
		)
	}

	return (
		<Flex
			bg='black'
			h={20}
			px={6}
			color={'whiteAlpha.900'}
			alignItems='center'
			position={'sticky'}
			top={0}
			zIndex={5}
		>
			<Box display='flex'>
				<NextLink href='/'>
					<Link>CAS</Link>
				</NextLink>
			</Box>
			<Box p={4} ml={'auto'}>
				{/* <Button onClick={toggleColorMode}>
					Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
				</Button> */}
				{body}
			</Box>
		</Flex>
	)
}

export default Navbar
