import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { UseSnackbarActions } from 'react-use-snack/SnackProvider'
import AppTheme from './AppTheme'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { SnackRenderer } from 'react-use-snack/SnackRenderer'
import { useSnack } from 'react-use-snack/useSnack'

const snackExamples: ({
    name: string
    get: () => Parameters<UseSnackbarActions['addNotice']>[0]
})[] = [
    {name: 'success, autoHide', get: () => ({title: `Hello World @ ${new Date().toLocaleTimeString()}`, severity: 'success', autoHide: 6000})},
    {name: 'warning, autoHide', get: () => ({title: `Hello World @ ${new Date().toLocaleTimeString()}`, severity: 'warning', autoHide: 6000})},
    {name: 'error, autoHide', get: () => ({title: `Hello World @ ${new Date().toLocaleTimeString()}`, severity: 'error', autoHide: 6000})},
    {name: 'success, persistent', get: () => ({title: `Hello World @ ${new Date().toLocaleTimeString()}`, severity: 'success'})},
    {name: 'warning, persistent', get: () => ({title: `Hello World @ ${new Date().toLocaleTimeString()}`, severity: 'warning'})},
    {name: 'error, persistent', get: () => ({title: `Hello World @ ${new Date().toLocaleTimeString()}`, severity: 'error'})},
    {
        name: 'success, persistent, content',
        get: () => ({
            title: `Healthy Snacks Chosen! @ ${new Date().toLocaleTimeString()}`,
            content: 'Congratulations on picking healthy snack options! Keep it up for a healthier lifestyle.',
            description: 'Discover more healthy snack ideas like fruits, nuts, and veggies in our guide.',
            severity: 'success',
        }),
    },
    {
        name: 'warning, persistent, content',
        get: () => ({
            title: `Snacking Warning! @ ${new Date().toLocaleTimeString()}`,
            content: 'Eating too many sugary snacks might impact your energy levels and health.',
            description: 'Balance your snacking habits with protein-rich or fiber-packed options for sustained energy.',
            severity: 'warning',
        }),
    },
    {
        name: 'error, persistent, content',
        get: () => ({
            title: `Out of Snacks! @ ${new Date().toLocaleTimeString()}`,
            content: 'Your snack drawer is empty! Time to restock before the next craving strikes.',
            description: 'Visit our store for quick snack delivery options or try some easy DIY snack recipes.',
            severity: 'error',
        }),
    },
]

export const App = () => {
    const {snackbars, rmNotice, addNotice} = useSnack()
    const [example, setExample] = useState<typeof snackExamples[number]>(snackExamples[0])
    return <AppTheme>
        <Box mx={2} mt={2} mb={3}>
            <Typography variant={'h1'} gutterBottom>react-use-snack</Typography>
        </Box>

        <Paper
            sx={{p: 2, mx: 1, my: 4}}
        >
            <FormControl fullWidth>
                <InputLabel id={'inp-example'}>Example</InputLabel>
                <Select
                    label={'Example'}
                    labelId={'inp-example'}
                    id={'inp-example-v'}
                    value={example.name || ''}
                    sx={{
                        mb: 2,
                    }}
                    onChange={(e) => {
                        const selected = snackExamples.find(ex => ex.name === e.target.value)
                        if(!selected) return
                        setExample(selected)
                    }}
                >
                    {snackExamples.map((example) =>
                        <MenuItem key={example.name} value={example.name}>
                            {example.name}
                        </MenuItem>,
                    )}
                </Select>
            </FormControl>

            <Button
                onClick={() => addNotice(example.get())}
                variant={'contained'}
            >trigger</Button>
        </Paper>

        {snackbars?.map(sb =>
            <SnackRenderer
                key={sb.id}
                snack={sb}
                rmNotice={rmNotice}
            />,
        )}
    </AppTheme>
}
