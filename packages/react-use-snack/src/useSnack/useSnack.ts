import { List } from 'immutable'
import React from 'react'
import { SnackbarContext, SnackbarNotice, UseSnackbarActions } from 'react-use-snack/SnackProvider'

const snackbarId = {current: 0}

export function useSnack<N extends SnackbarNotice = SnackbarNotice>(): UseSnackbarActions<N> & { snackbars: List<SnackbarNotice> } {
    const [snackbars, setSnackbar] = React.useContext(SnackbarContext)

    const rmNotice = React.useCallback((id) => {
        setSnackbar(sb => {
            const i = sb.findIndex(s => s.id === id)
            if(i !== -1) {
                sb = sb.splice(i, 1)
            }
            return sb
        })
    }, [setSnackbar])

    const addNotice = React.useCallback((notice: Omit<N, 'id'> & Partial<Pick<N, 'id'>>) => {
        const id = typeof notice.id === 'undefined' ? snackbarId.current = snackbarId.current + 1 : notice.id
        setSnackbar(sb => {
            const i = sb.findIndex(s => s.id === id)
            if(i !== -1) {
                sb = sb.splice(i, 1)
            }
            sb = sb.push({
                id: id,
                ...notice,
            })
            return sb
        })
        return id
    }, [setSnackbar])

    return {
        addNotice: addNotice,
        rmNotice: rmNotice,
        snackbars: snackbars,
    }
}
