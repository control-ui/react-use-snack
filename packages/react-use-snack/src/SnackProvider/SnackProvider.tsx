import React from 'react'
import { List } from 'immutable'

export type SnackbarContextData = List<SnackbarNotice>

export type setSnackbar = React.Dispatch<React.SetStateAction<SnackbarContextData>>

// @ts-ignore
export const SnackbarContext = React.createContext<[SnackbarContextData, setSnackbar]>([])

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

export const SnackbarInitial = List() as List<SnackbarNotice>
export const SnackProvider = ({children}: React.PropsWithChildren<any>) => {
    const state = React.useState<SnackbarContextData>(SnackbarInitial)

    return <SnackbarContext.Provider value={state}>
        {children}
    </SnackbarContext.Provider>
}

export interface UseSnackbarActions<N extends SnackbarNotice = SnackbarNotice> {
    addNotice: (notice: Omit<N, 'id'> & Partial<Pick<N, 'id'>>) => string | number
    rmNotice: (id: string | number) => void
}
