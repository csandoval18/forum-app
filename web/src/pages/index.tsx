import { Box } from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { usePostsQuery } from '../generated/graphql'

const Index = () => {
	const [{ data }] = usePostsQuery()
	return (
		<Box
			bg={'red'}
			h={'100vh'}
			bgGradient='linear(to-l, heroGradientStart, heroGradientEnd)'
		>
			<Navbar />
			{!data ? (
				<div>loading...</div>
			) : (
				data.posts.map((p) => <div key={p.id}>{p.title}</div>)
			)}
		</Box>
	)
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
