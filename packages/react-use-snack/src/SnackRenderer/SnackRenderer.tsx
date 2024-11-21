import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import IcSuccess from '@mui/icons-material/TaskAlt'
import IcWarning from '@mui/icons-material/ReportProblemOutlined'
import IcError from '@mui/icons-material/ErrorOutlineOutlined'
import { SnackbarNotice } from 'react-use-snack/SnackProvider'

export const SnackRenderer = <TNotice extends SnackbarNotice>(
    {
        snack: sb,
        rmNotice,
        labelClose = 'close',
        labelHide = 'hide',
        labelMore = 'more',
    }: {
        snack: TNotice
        rmNotice: (id: string | number) => void
        labelClose?: string
        labelHide?: string
        labelMore?: string
    },
) => {
    const {shape} = useTheme()
    const [open, setOpen] = useState(false)
    const [isOver, setIsOver] = useState(false)
    const [hideProgress, setHideProgress] = useState<number>(0)

    const autoHide = sb.autoHide
    useEffect(() => {
        if(!autoHide || isOver) {
            setHideProgress(0)
            return
        }
        const start = new Date().getTime()
        const iVal = window.setInterval(() => {
            const now = new Date().getTime()
            setHideProgress((now - start) / (autoHide / 100))
        }, 35)
        return () => window.clearInterval(iVal)
    }, [autoHide, isOver])
    const contentLines = typeof sb.content === 'string' ? sb.content?.split('\n') : undefined
    const descLines = typeof sb.description === 'string' ? sb.description?.split('\n') : undefined
    return <>
        {sb.content || sb.description ?
            <Dialog
                open={open} onClose={() => setOpen(false)}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: 1,
                    }}
                >
                    {sb.severity === 'success' ? <IcSuccess color={'success'}/> :
                        sb.severity === 'warning' ? <IcWarning color={'warning'}/> :
                            sb.severity === 'error' ? <IcError color={'error'}/> : undefined}
                    <span>{sb.title}</span>
                </DialogTitle>

                <DialogContent>
                    {contentLines?.map((line, i, arr) =>
                        <Typography
                            key={i} variant={'body1'}
                            gutterBottom={i < arr.length - 1}
                        >{line}</Typography>,
                    )}

                    {contentLines && descLines ?
                        <Divider sx={{my: 1.5}}/> : null}

                    {descLines?.map((line, i, arr) =>
                        <Typography
                            key={i} variant={'body1'}
                            gutterBottom={i < arr.length - 1}
                        >{line}</Typography>,
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpen(false)}
                    >{labelHide}</Button>
                    <Button
                        onClick={() => rmNotice(sb.id)}
                        variant={'contained'}
                    >{labelClose}</Button>
                </DialogActions>
            </Dialog> : null}

        {open ? null :
            <Snackbar
                open
                autoHideDuration={autoHide}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                onClose={() => sb.autoHide ? rmNotice(sb.id) : undefined}
                onMouseOver={() => setIsOver(true)}
                onMouseOut={() => setIsOver(false)}
                onFocus={() => setIsOver(true)}
                onBlur={() => setIsOver(false)}
            >
                <Alert
                    onClose={sb.autoHide ? undefined : () => rmNotice(sb.id)}
                    action={
                        sb.content || sb.description ?
                            <Button
                                color={'inherit'}
                                size={'small'}
                                onClick={() => setOpen(true)}
                            >{labelMore}</Button> : undefined
                    }
                    severity={sb.severity}
                    style={{
                        position: 'relative',
                    }}
                >
                    <AlertTitle gutterBottom={false}>{sb.title}</AlertTitle>
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
                            style={{
                                width: '100%',
                                borderBottomLeftRadius: shape.borderRadius,
                                borderBottomRightRadius: shape.borderRadius,
                            }}
                        />
                    </div> : null}
                </Alert>
            </Snackbar>}
    </>
}
