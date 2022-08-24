import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Switch,
	useColorMode,
	useDisclosure,
} from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const btnRef = React.useRef()
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
	const [{ data, fetching }] = useMeQuery({})
	const router = useRouter()
	const { colorMode, toggleColorMode } = useColorMode()
	let body = null

	//data is loading
	if (fetching) {
		//user not logged in
	} else if (!data?.me) {
		body = (
			<>
				<Button onClick={toggleColorMode} variant='secondary' mt={4}>
					{colorMode === 'light' ? (
						<MoonIcon fontSize={20} color='white' />
					) : (
						<SunIcon fontSize={20} color='white' />
					)}
				</Button>
				{/* <Switch colorScheme='primary' size='lg' /> */}
				<NextLink href={'/login'}>
					<Button w='100%' h='4rem' bg='primary'>
						Login
					</Button>
				</NextLink>
				<NextLink href={'/register'}>
					<Button w='100%' h='4rem' bg='primary'>
						Register
					</Button>
				</NextLink>
			</>
		)
		//user is logged in
	} else {
		body = (
			<>
				<Flex alignItems='center' gap={6} my={4}>
					<Avatar></Avatar>
					<Box color='white'>{data.me.username}</Box>
				</Flex>
				<Button onClick={toggleColorMode} variant='secondary'>
					{colorMode === 'light' ? (
						<MoonIcon fontSize={20} color='white' />
					) : (
						<SunIcon fontSize={20} color='white' />
					)}
				</Button>
				<Button
					w='100%'
					h='4rem'
					bg='primary'
					onClick={async () => {
						router.push('/create-post')
					}}
				>
					Create Post
				</Button>
				<Button
					w='100%'
					h='4rem'
					bg='primary'
					onClick={async () => {
						await logout()
						window.location.href = '/'
					}}
				>
					Logout
				</Button>
			</>
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
							_active={{ bg: '#333e4e' }}
						>
							CAS
						</Button>
					</NextLink>
				</Box>
				<Box p={4} ml={'auto'}>
					<Button
						ref={btnRef}
						variant='ghost'
						_hover={{ bg: '#333e4e' }}
						_active={{ bg: '#333e4e' }}
						onClick={onOpen}
					>
						<HamburgerIcon fontSize={25} />
					</Button>
					<Drawer
						isOpen={isOpen}
						placement='left'
						onClose={onClose}
						finalFocusRef={btnRef}
					>
						<DrawerOverlay />
						<DrawerContent bg='secondary' color='white'>
							<DrawerCloseButton fontSize={17} mr={2} />
							<DrawerHeader borderBottom='1px' borderColor='gray.600'>
								<NextLink href='/'>
									<Button
										w='5.1rem'
										h={12}
										variant='ghost'
										fontSize={36}
										fontWeight='extrabold'
										letterSpacing={2}
										_hover={{ bg: '#333e4e' }}
										_active={{ bg: '#333e4e' }}
									>
										CAS
									</Button>
								</NextLink>
							</DrawerHeader>
							<DrawerBody>
								<Flex flexDir='column' gap='4' color='black'>
									{body}
								</Flex>
							</DrawerBody>
						</DrawerContent>
					</Drawer>
				</Box>
			</Flex>
		</Flex>
	)
}

export default withUrqlClient(createUrqlClient)(Navbar)
