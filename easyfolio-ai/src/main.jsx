/**
 * main.jsx - React 应用启动文件
 * ===============================
 *
 * 【小白解释：
 * 这是整个应用的"点火开关"
 * 把 React 应用挂载到 HTML 页面上
 *
 * 就像餐厅开业前的准备工作，把一切都布置好
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// 找到 HTML 里的 &lt;div id="root"&gt;&lt;/div&gt;
// 把 React 应用挂载到这个元素上
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode - 严格模式，帮助发现潜在问题
  &lt;React.StrictMode&gt;
    &lt;App /&gt;
  &lt;/React.StrictMode&gt;,
)

