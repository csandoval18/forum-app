import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
	Avatar,
	Box,
	Button,
	Flex,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useColorMode,
} from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'

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
				{/* <NextLink href={'/login'}>
					<Button variant='primary'>Login</Button>
				</NextLink>
				<NextLink href={'/register'}>
					<Button variant='secondary'>Register</Button>
				</NextLink>
				<Button onClick={toggleColorMode} variant='secondary'>
					{colorMode === 'light' ? (
						<MoonIcon fontSize={20} />
					) : (
						<SunIcon fontSize={20} />
					)}
				</Button> */}
			</Flex>
		)
		//user is logged in
	} else {
		body = (
			<Flex gap={8} alignItems='center'>
				<Button
					variant='primary'
					ml={'auto'}
					onClick={() => {
						router.replace('/create-post')
					}}
				>
					Create Post
				</Button>
				<Button onClick={toggleColorMode} variant='secondary'>
					{colorMode === 'light' ? (
						<MoonIcon fontSize={20} />
					) : (
						<SunIcon fontSize={20} />
					)}
				</Button>
				<Menu>
					<Avatar as={MenuButton}></Avatar>

					<MenuList bg='secondary'>
						<Flex
							p={3}
							justifyContent='center'
							bg='primary'
							color='secondary'
							fontWeight={700}
							letterSpacing={1}
						>
							{data.me.username}{' '}
						</Flex>
						<MenuItem
							p={2.5}
							fontWeight={500}
							justifyContent='center'
							_hover={{ bg: '#333e4e' }}
							_focus={{ bg: 'transparent' }}
						>
							Profile
						</MenuItem>
						<MenuItem
							p={2.5}
							fontWeight={500}
							justifyContent='center'
							_hover={{ bg: '#333e4e' }}
							_focus={{ bg: 'transparent' }}
							onClick={async () => {
								await logout()
								// Window route or refresh needs to used so cookie can be destroyed with the refresh of the page
								window.location.href = '/'
								// router.reload()
							}}
						>
							Logout
						</MenuItem>
					</MenuList>
				</Menu>
			</Flex>
		)
	}

	return (
		<Flex
			className='navbar-container'
			h='4.2rem'
			bg='secondary'
			color={'whiteAlpha.900'}
			alignItems='center'
			position={'sticky'}
			top={0}
			zIndex={100}
		>
			<Flex flex='1'>
				<Box display='flex' alignItems='center' justifyContent='center'>
					<NextLink href='/'>
						<Button
							h={12}
							variant='ghost'
							fontSize={36}
							fontWeight='extrabold'
							letterSpacing={2}
							_hover={{ bg: '#333e4e' }}
						>
							CAS
						</Button>
					</NextLink>
				</Box>
				<Box p={4} ml={'auto'}>
					{body}
				</Box>
			</Flex>
		</Flex>
	)
}

export default withUrqlClient(createUrqlClient)(Navbar)
