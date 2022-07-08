import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { createClient, Provider } from 'urql'
import theme from '../theme'

const client = createClient({
	url: 'http://localhost:4000/graphql',
	//sends a cookie. Used to set a cookie when user register or fetching cookie when loggin in
	fetchOptions: {
		credentials: 'include',
	},
})

function MyApp({ Component, pageProps }: any) {
	return (
		<Provider value={client}>
			<ChakraProvider resetCSS theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</Provider>
	)
}

export default MyApp
