import { Box, Flex, Heading } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import { Navbar } from '../../components/Home/Navbar'
import { usePostQuery } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'

const Post = ({}) => {
	const router = useRouter()
	const intId =
		typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
	const [{ data, error, fetching }] = usePostQuery({
		pause: intId === -1,
		variables: {
			id: intId,
		},
	})
	if (fetching) {
		return (
			<Box>
				<div>loading...</div>
			</Box>
		)
	}
	if (error) return <div>{error.message}</div>
	if (!data?.post) return <div>Could not find post</div>

	return (
		<>
			<Navbar></Navbar>
			<Flex
				flexDir='column'
				width={'95%'}
				backgroundColor='red'
				alignItems='center'
				py={8}
				px={8}
				mx={8}
				my={8}
				borderRadius='12px'
			>
				<Box>
					<Heading>{data?.post?.title}</Heading>
					{data?.post?.text}
				</Box>
			</Flex>
		</>
	)
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
