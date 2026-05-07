/**
 * App 组件 - 应用入口
 * =====================
 *
 * 【小白解释：
 * 这是整个 React 应用的"总指挥"
 * 就像餐厅的前台，负责引导客人去不同的区域
 *
 * 主要功能：
 * - 设置路由（哪个 URL 显示哪个页面）
 * - 包裹布局组件（统一的导航栏、页脚等）
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AIResumeAnalyzer from './pages/AIResumeAnalyzer.jsx'
import Layout from './components/layout/Layout.jsx'

function App() {
  return (
    // Router - 路由管理器，处理 URL 变化
    &lt;Router&gt;
      {/* Layout - 布局组件，包含导航栏等公共部分 */}
      &lt;Layout&gt;
        {/* Routes - 路由配置，就像餐厅的指示牌 */}
        &lt;Routes&gt;
          {/* 根路径 / 显示首页 */}
          &lt;Route path="/" element={&lt;Home /&gt;} /&gt;
          {/* /analyzer 路径显示 AI 分析页面 */}
          &lt;Route path="/analyzer" element={&lt;AIResumeAnalyzer /&gt;} /&gt;
        &lt;/Routes&gt;
      &lt;/Layout&gt;
    &lt;/Router&gt;
  )
}

export default App

