import {
	chakra,
	extendTheme,
	forwardRef,
	HTMLChakraProps,
	ThemingProps,
	useStyleConfig,
} from '@chakra-ui/react'
import { createBreakpoints, StyleConfig } from '@chakra-ui/theme-tools'

const fonts = { mono: `'Menlo', monospace` }

const config = {
	initialColorMode: 'light',
	useSystemColorMode: false,
}

const breakpoints = createBreakpoints({
	sm: '40em',
	md: '52em',
	lg: '64em',
	xl: '80em',
})

const theme = extendTheme({
	config,
	components: {
		Button: {
			variants: {
				primary: {
					bg: 'primary',
					color: '#1e2329',
					_hover: {
						bg: '#9ff1d6',
					},
				},
				secondary: {
					border: '1px',
					borderColor: 'gray.600',
					// _light: { _hover: { bg: '#5f968634' } },
					_hover: { bg: '#333e4e' },
				},
				dark: {
					color: 'white',
					bg: '#233349',
					_hover: {
						bg: '#eeeeee',
						color: '#1e2329',
					},
				},
			},
		},
		MenuItem: {
			baseStyle: {
				h: '80px',
				color: 'red',
			},
		},
	},
	semanticTokens: {
		colors: {
			primary: {
				default: '#6ee7bf',
				_dark: '#6ee7bf',
			},
			text: {
				default: '#16161D',
				_dark: '#ade3b8',
			},
			secondary: {
				default: '#222935',
				_dark: '#222935',
			},
			heroGradientEnd: {
				default: '#98d6e6',
				// _dark: '#fbec8f',
				_dark: '#989de6',
			},
		},
		radii: {
			button: '12px',
		},
	},
	colors: {
		black: '#1e2329',
		primary: '#6ee7bf',
		// secondary: '#233349',
		secondary: 'grey.700',
		complimentary: '#98d6e6',
	},
	fonts,
	breakpoints,
})

export default theme
