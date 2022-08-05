import { Box } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import Navbar from '../components/Home/Navbar'
import Posts from '../components/Home/Posts/Posts'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
	return (
		<Box h={'100%'}>
			<Navbar pageProps={undefined} />
			<Posts pageProps={undefined} />
		</Box>
	)
}

// export default Index
export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
