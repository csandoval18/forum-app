import { Box } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import Navbar from '../components/Home/Navbar'
import Posts from '../components/Home/Posts/Posts'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index: React.FC = () => {
	return (
		<Box h={'100%'} bgGradient='linear(to-b, #222231 8%, #233349 30%, primary)'>
			<Navbar />
			<Posts />
		</Box>
	)
}

// export default Index
export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
