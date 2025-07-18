//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { UnreadNotificationProvider } from './Components/NotificationContax/UnreadNotificationContext .tsx'

createRoot(document.getElementById('root')!).render(
  //<StrictMode>
    <UnreadNotificationProvider>
    <App />
    </UnreadNotificationProvider>
  //</StrictMode>,

)
