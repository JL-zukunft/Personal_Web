/**
 * Layout 组件 - 页面布局
 * =======================
 *
 * 【小白解释：
 * 这是所有页面的"框架"
 * 包含导航栏和页脚，让每个页面都有统一的外观
 * 就像餐厅的装修，每个房间都有同样的门和墙
 */

import React from 'react'

const Layout = ({ children }) =&gt; {
  return (
    &lt;div className="min-h-screen bg-background-light dark:bg-background-dark"&gt;
      {/* 顶部导航栏 */}
      &lt;nav className="h-16 border-b border-primary/10 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md"&gt;
        {/* Logo 和网站名称 */}
        &lt;div className="flex items-center gap-3"&gt;
          &lt;div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center"&gt;
            &lt;i className="fas fa-bolt text-xl"&gt;&lt;/i&gt;
          &lt;/div&gt;
          &lt;h1 className="text-lg font-bold tracking-tight text-slate-900"&gt;EasyFolio AI&lt;/h1&gt;
        &lt;/div&gt;
        {/* 导航链接 */}
        &lt;div className="flex items-center gap-4"&gt;
          &lt;a href="/" className="text-slate-600 hover:text-primary transition-colors"&gt;首页&lt;/a&gt;
          &lt;a href="/analyzer" className="text-slate-600 hover:text-primary transition-colors"&gt;AI分析&lt;/a&gt;
          &lt;a href="../easyfolio-portfolio/index.html" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"&gt;
            作品集
          &lt;/a&gt;
        &lt;/div&gt;
      &lt;/nav&gt;
      {/* 页面内容区域（children 是其他页面传进来的内容） */}
      &lt;main className="min-h-[calc(100vh-64px)]"&gt;
        {children}
      &lt;/main&gt;
    &lt;/div&gt;
  )
}

export default Layout

