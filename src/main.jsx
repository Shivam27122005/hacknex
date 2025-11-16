import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('Main.jsx: Starting application...')

try {
  const rootElement = document.getElementById('root')
  
  if (!rootElement) {
    throw new Error('Root element not found')
  }

  console.log('Main.jsx: Root element found, rendering App...')
  
  const root = ReactDOM.createRoot(rootElement)
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
  console.log('Main.jsx: App rendered successfully')
} catch (error) {
  console.error('Main.jsx: Error rendering application:', error)
  
  // Display error in the UI
  const errorElement = document.createElement('div')
  errorElement.style.color = 'red'
  errorElement.style.padding = '20px'
  errorElement.style.fontFamily = 'monospace'
  errorElement.style.whiteSpace = 'pre'
  errorElement.textContent = `Error: ${error.message}\n\n${error.stack}`
  
  document.body.innerHTML = ''
  document.body.appendChild(errorElement)
  
  throw error
}
