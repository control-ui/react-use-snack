import { useCallback, useContext } from 'react'
import { SnackbarContext, SnackbarNotice, UseSnackbarActions } from 'react-use-snack/SnackProvider'

const snackbarId = {current: 0}

export function useSnack<TNotice extends SnackbarNotice = SnackbarNotice>(): UseSnackbarActions<TNotice> & { snackbars: TNotice[] } {
    const [snackbars, setSnackbar] = useContext(SnackbarContext)

    const rmNotice = useCallback((id) => {
        setSnackbar(sb => {
            const i = sb.findIndex(s => s.id === id)
            if(i !== -1) {
                sb = [...sb]
                sb.splice(i, 1)
            }
            return sb
        })
    }, [setSnackbar])

    const addNotice: UseSnackbarActions<TNotice>['addNotice'] = useCallback((notice: Omit<TNotice, 'id'> & Partial<Pick<TNotice, 'id'>>) => {
        const id = typeof notice.id === 'undefined' ? snackbarId.current = snackbarId.current + 1 : notice.id
        setSnackbar(sb => {
            sb = [...sb]
            const i = sb.findIndex(s => s.id === id)
            if(i !== -1) {
                sb.splice(i, 1)
            }
            sb.push({
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
        snackbars: snackbars as TNotice[],
    }
}
