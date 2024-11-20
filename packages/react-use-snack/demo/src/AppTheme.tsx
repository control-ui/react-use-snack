import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, StyledEngineProvider, ThemeProvider, Theme } from '@mui/material/styles'

const fontHeading = '"Playfair Display", Didot, Georgia, "Times New Roman", Times, serif'
const fontBody = 'Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif'
export const fontMono = '"Segoe UI Mono", Menlo, Consolas , Monaco, Liberation Mono, Lucida Console, Courier, monospace'
const universal = {
    typography: {
        fontSize: 14,
        fontFamily: fontBody,
        h1: {
            fontFamily: fontHeading,
            fontSize: '2.45rem',
        },
        h2: {
            fontFamily: fontHeading,
            fontSize: '2.115rem',
        },
        h3: {
            fontFamily: fontHeading,
            fontSize: '1.95rem',
        },
        h4: {
            fontFamily: fontHeading,
            fontSize: '1.75rem',
        },
        h5: {
            fontFamily: fontHeading,
            fontSize: '1.615rem',
        },
        h6: {
            fontFamily: fontHeading,
            fontSize: '1.25rem',
        },
        body1: {
            fontFamily: fontBody,
            fontSize: '1.0125rem',
            letterSpacing: '0.0195em',
        },
        body2: {
            fontFamily: fontBody,
            fontSize: '0.95rem',
            letterSpacing: '0.021em',
        },
        subtitle1: {
            fontFamily: fontHeading,
            fontSize: '1.25rem',
        },
        subtitle2: {
            fontFamily: fontHeading,
            fontSize: '1rem',
        },
        caption: {
            fontSize: '0.8134rem',
        },
    },
}

const themeDark = createTheme({
    ...universal,
    palette: {
        mode: 'dark',
        primary: {
            main: '#08b1d7',
            dark: '#055262',
        },
        secondary: {
            light: '#d8eed4',
            main: '#bbe1b4',
            dark: '#002634',
        },
        background: {
            paper: '#001f29',
            default: '#001820',
        },
        text: {
            primary: '#e8e8e8',
            secondary: '#acc9c5',
        },
        action: {
            hoverOpacity: 0.2,
        },
    },
})

const themeLight = createTheme({
    ...universal,
    palette: {
        mode: 'light',
        primary: {
            main: '#0599b2',
            dark: '#033944',
        },
        secondary: {
            light: '#d8eed4',
            main: '#37936c',
            dark: '#002634',
        },
        background: {
            paper: '#e8e8e8',
            default: '#dae7e5',
        },
        text: {
            primary: '#001f29',
            secondary: '#001820',
        },
        action: {
            hoverOpacity: 0.2,
        },
    },
})

const themes = {
    dark: themeDark,
    light: themeLight,
}

const store_item = 'theme'

const ThemesContext = React.createContext<undefined | {}>(undefined)

const chosen_theme = window.localStorage.getItem(store_item)

export const ThemesProvider: React.FC<React.PropsWithChildren<{
    themes: { [id: string]: Theme }
    initial?: string
}>> = ({themes, initial, children}) => {
    const [theme, setTheme] = React.useState<keyof typeof themes>((chosen_theme || initial) as keyof typeof themes)

    const switchTheme = React.useCallback(() => {
        const themeSort = Object.keys(themes)
        const currentIndex = themeSort.findIndex((theme_id) => theme_id === theme)
        if(currentIndex === -1) {
            // noop
        } else {
            if(currentIndex < (themeSort.length - 1)) {
                window.localStorage.setItem(store_item, themeSort[currentIndex + 1])
                setTheme(themeSort[currentIndex + 1])
            } else {
                window.localStorage.setItem(store_item, themeSort[0])
                setTheme(themeSort[0])
            }
        }
    }, [theme, setTheme, themes])

    return <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes && themes[theme] ? themes[theme] : {}}>
            <ThemesContext.Provider value={switchTheme}>
                {children}
            </ThemesContext.Provider>
        </ThemeProvider>
    </StyledEngineProvider>
}

export default function AppTheme(props) {
    const {children} = props

    return (
        <ThemesProvider
            themes={themes}
            initial={window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}
        >
            <CssBaseline/>
            {children}
        </ThemesProvider>
    )
}
