import React from 'react';
import App from './App'
import Canvas from './components/Canvas'

import { createRoot } from 'react-dom/client'
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
