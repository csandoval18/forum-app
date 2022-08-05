import { Box, Button, Flex, Link } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { isServer } from '../../utils/isServer'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
	const router = useRouter()
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
					<Link>Home</Link>
				</NextLink>
			</Box>
			<Box p={4} ml={'auto'}>
				{body}
			</Box>
		</Flex>
	)
}

export default Navbar
