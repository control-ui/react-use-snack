import React from 'react'
import { createRoot } from 'react-dom/client'
import { SnackProvider } from 'react-use-snack/SnackProvider'
import { App } from './App'

const root = document.querySelector('#root')
if(!root) throw new Error('Missing PWA root')
createRoot(root)
    .render(<React.Profiler id="Demo App" onRender={() => null}>
        <SnackProvider>
            <App/>
        </SnackProvider>
    </React.Profiler>)
