import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = createBreakpoints({
	sm: '40em',
	md: '52em',
	lg: '64em',
	xl: '80em',
})

const theme = extendTheme({
	components: {
		Button: {
			variants: {
				primary: {
					bg: '#98d6e6',
				},
			},
		},
	},
	semanticTokens: {
		colors: {
			text: {
				default: '#16161D',
				_dark: '#ade3b8',
			},
			heroGradientStart: {
				default: '#1e2329',
				// _dark: '#e3a7f9',
				_dark: '#1e2329',
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
		primary: '#98d6e6',
	},
	fonts,
	breakpoints,
})

export default theme
