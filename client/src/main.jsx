import React from 'react'
import ReactDOM from 'react-dom/client'
import GlobalStyles from '@mui/material/GlobalStyles'

import App from './App'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <GlobalStyles styles={{ body: { margin: 0 } }} />
      <App />
    </>
  </React.StrictMode>
)
