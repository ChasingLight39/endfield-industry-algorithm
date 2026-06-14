import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GRID_SIZE } from './config/constants'
import { Z_INDEX } from './config/zIndex'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

// 同步 JS 常量到 CSS 变量，确保 Grid.tsx 和 index.css 的网格尺寸一致
document.documentElement.style.setProperty('--grid-size', `${GRID_SIZE}px`);

// 同步 z-index 常量到 CSS 变量，供 SCSS 文件通过 var(--z-xxx) 使用
for (const [key, value] of Object.entries(Z_INDEX)) {
  const cssName = '--z-' + key.replace(/_/g, '-').toLowerCase();
  document.documentElement.style.setProperty(cssName, String(value));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
