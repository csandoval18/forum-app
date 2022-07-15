import {
	Box,
	Button,
	ColorModeScript,
	Flex,
	Link,
} from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import Router, { useRouter } from 'next/router'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
	const router = useRouter()
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
	const [{ data, fetching }] = useMeQuery({
		// pause: true,
	})
	let body = null
	console.log(data)

	//data is loading
	if (fetching) {
		//user not logged in
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href={'/login'}>
					<Link mr={10}>login</Link>
				</NextLink>
				<NextLink href={'/register'}>
					<Link>register</Link>
				</NextLink>
			</>
		)
		//user is logged in
	} else {
		body = (
			<Flex>
				<Box mr={10}>{data.me.username} </Box>
				<Link href='/login'>
					<Button
						onClick={async () => {
							await logout()
							// router.reload()
							// Router.replace('/login')
						}}
						variant={'link'}
						isLoading={logoutFetching}
					>
						logout
					</Button>
				</Link>
			</Flex>
		)
	}

	return (
		<Flex bg='black' p={4} color={'whiteAlpha.900'}>
			<Box p={4} ml={'auto'}>
				{body}
			</Box>
		</Flex>
	)
}

export default withUrqlClient(createUrqlClient)(Navbar)
