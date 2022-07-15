import { Box } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import Navbar from '../components/Navbar'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
	const [{ data }] = usePostsQuery()
	return (
		<Box
			bg={'red'}
			h={'100vh'}
			bgGradient='linear(to-l, heroGradientStart, heroGradientEnd)'
		>
			<Navbar pageProps={null} />
			<div>hello world</div>
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
