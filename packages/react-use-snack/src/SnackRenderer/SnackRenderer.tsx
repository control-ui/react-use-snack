import React from 'react'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Snackbar from '@mui/material/Snackbar'
import { SnackbarNotice, UseSnackbarActions } from 'react-use-snack/SnackProvider'
import Typography from '@mui/material/Typography'

export const SnackRenderer: React.ComponentType<{
    snack: SnackbarNotice
    rmNotice: UseSnackbarActions<SnackbarNotice>['rmNotice']
}> = (
    {
        snack: sb,
        rmNotice,
    },
) => {
    const [open, setOpen] = React.useState(false)
    const [hideProgress, setHideProgress] = React.useState<number>(0)

    const autoHide = sb.autoHide
    React.useEffect(() => {
        if(!autoHide) return
        const start = new Date().getTime()
        const iVal = window.setInterval(() => {
            const now = new Date().getTime()
            setHideProgress((now - start) / (autoHide / 100))
        }, 35)
        return () => window.clearInterval(iVal)
    }, [autoHide])
    const contentLines = typeof sb.content === 'string' ? sb.content?.split('\n') : undefined
    const descLines = typeof sb.description === 'string' ? sb.description?.split('\n') : undefined
    return <>
        {sb.content || sb.description ?
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    {sb.title}
                </DialogTitle>

                {contentLines ? <DialogContent>
                    {contentLines.map((line, i) =>
                        <Typography
                            key={i} variant={'body1'}
                            gutterBottom={i < contentLines.length - 1}
                        >{line}</Typography>,
                    )}
                </DialogContent> : null}

                {descLines ? <DialogContent>
                    {descLines.map((line, i) =>
                        <Typography
                            key={i} variant={'body2'}
                            gutterBottom={i < descLines.length - 1}
                        >{line}</Typography>,
                    )}
                </DialogContent> : null}

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Hide</Button>
                    <Button onClick={() => rmNotice(sb.id)}>Close</Button>
                </DialogActions>
            </Dialog> : null}

        {open ? null :
            <Snackbar
                open
                autoHideDuration={autoHide}
                onClick={() =>
                    sb.content || sb.description ? setOpen(true) :
                        sb.autoHide ? rmNotice(sb.id) : undefined
                }
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                onClose={() => sb.autoHide ? rmNotice(sb.id) : undefined}
            >
                <Alert
                    onClose={sb.autoHide ? undefined : () => rmNotice(sb.id)} severity={sb.severity}
                    style={{
                        position: 'relative',
                    }}
                >
                    {sb.title}
                    {sb.autoHide ? <div
                        style={{
                            opacity: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            position: 'absolute',
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <LinearProgress
                            value={100 - hideProgress}
                            variant="determinate"
                            style={{width: '100%'}}
                        />
                    </div> : null}
                </Alert>
            </Snackbar>}
    </>
}
