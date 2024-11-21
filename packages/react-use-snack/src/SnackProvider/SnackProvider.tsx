import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'

export type SnackbarContextData<TNotice extends SnackbarNotice> = TNotice[]

export type setSnackbar<TNotice extends SnackbarNotice> = Dispatch<SetStateAction<SnackbarContextData<TNotice>>>

export const SnackbarContext = createContext<[SnackbarContextData<SnackbarNotice>, setSnackbar<SnackbarNotice>]>(
    [[], () => undefined],
)

export interface SnackbarNotice {
    id: number | string
    title: string
    /**
     * Main content details, to be displayed after clicking on notice
     */
    content?: string
    severity: 'success' | 'warning' | 'error'
    /**
     * The number of milliseconds to wait before automatically deleting the notice
     */
    autoHide?: number
    /**
     * Further descriptions, to be displayed after clicking on notice, secondary to `content`.
     * Where `content` is expected to be more formatted as lines, `description` may be treated as raw-content like MD or table-rows in JSONLD
     */
    description?: string
}

export const SnackProvider = ({children}: PropsWithChildren<any>) => {
    const state = useState<SnackbarContextData<SnackbarNotice>>([])

    return <SnackbarContext.Provider value={state}>
        {children}
    </SnackbarContext.Provider>
}

export interface UseSnackbarActions<TNotice extends SnackbarNotice = SnackbarNotice> {
    addNotice: (notice: Omit<TNotice, 'id'> & Partial<Pick<TNotice, 'id'>>) => string | number
    rmNotice: (id: string | number) => void
}
