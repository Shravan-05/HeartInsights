import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Heartpredictstate from "./Context/heartpredictstate";

createRoot(document.getElementById('root')).render(
    <Heartpredictstate>
  <StrictMode>
    <App />
  </StrictMode>
    </Heartpredictstate>
,
)
