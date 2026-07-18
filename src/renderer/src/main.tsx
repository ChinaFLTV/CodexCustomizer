import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initI18n } from './i18n'
import './styles/global.css'
import './styles/components.css'

initI18n('zh-CN')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
