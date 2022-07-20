import { Box, Button } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import Navbar from '../components/Navbar'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { useRouter } from 'next/router'

const Index = () => {
	const router = useRouter()
	const [{ data }] = usePostsQuery()
	return (
		<Box
			h={'100vh'}
			bgGradient='linear(to-t, #222231 8%, #233349 30%, #7bcae9)'
		>
			<Navbar pageProps={undefined} />
			<Box>hello world</Box>
			<Button
				onClick={() => {
					router.replace('/create-post')
				}}
			>
				Create Post
			</Button>
			<br />
			{!data ? (
				<div>loading...</div>
			) : (
				data.posts.map((p) => <div key={p.id}>{p.title}</div>)
			)}
		</Box>
	)
}

// export default Index
export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
