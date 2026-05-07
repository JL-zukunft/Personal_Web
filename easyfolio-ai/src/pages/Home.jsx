/**
 * Home 组件 - 首页
 * =================
 *
 * 【小白解释：
 * 这是用户打开网站看到的第一个页面
 * 就像餐厅的大门和迎宾区，告诉客人这里是做什么的
 */

import React from 'react'

const Home = () =&gt; {
  return (
    &lt;div className="max-w-6xl mx-auto px-8 py-16"&gt;
      {/* 顶部标题区域 */}
      &lt;div className="text-center mb-16"&gt;
        {/* 小徽章，显示 AI 驱动 */}
        &lt;div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"&gt;
          &lt;span className="w-2 h-2 bg-primary rounded-full animate-pulse"&gt;&lt;/span&gt;
          &lt;span className="text-sm font-medium text-primary"&gt;AI驱动的简历优化&lt;/span&gt;
        &lt;/div&gt;
        {/* 主标题 */}
        &lt;h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"&gt;
          让AI帮你打造
          &lt;span className="text-primary"&gt;完美简历&lt;/span&gt;
        &lt;/h1&gt;
        {/* 副标题描述 */}
        &lt;p className="text-lg text-slate-600 max-w-2xl mx-auto"&gt;
          使用先进的AI技术分析你的简历，获取专业的优化建议，提升求职成功率
        &lt;/p&gt;
      &lt;/div&gt;

      {/* 三个功能卡片 */}
      &lt;div className="grid md:grid-cols-3 gap-8 mb-16"&gt;
        {/* 卡片 1 - 简历分析 */}
        &lt;div className="p-8 bg-white rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow"&gt;
          &lt;div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4"&gt;
            &lt;i className="fas fa-file-alt text-primary text-2xl"&gt;&lt;/i&gt;
          &lt;/div&gt;
          &lt;h3 className="text-lg font-semibold text-slate-900 mb-2"&gt;简历分析&lt;/h3&gt;
          &lt;p className="text-slate-600"&gt;智能分析简历内容，识别亮点和改进空间&lt;/p&gt;
        &lt;/div&gt;
        {/* 卡片 2 - 能力评估 */}
        &lt;div className="p-8 bg-white rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow"&gt;
          &lt;div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4"&gt;
            &lt;i className="fas fa-chart-line text-primary text-2xl"&gt;&lt;/i&gt;
          &lt;/div&gt;
          &lt;h3 className="text-lg font-semibold text-slate-900 mb-2"&gt;能力评估&lt;/h3&gt;
          &lt;p className="text-slate-600"&gt;全面评估职场能力，发现个人优势&lt;/p&gt;
        &lt;/div&gt;
        {/* 卡片 3 - 岗位匹配 */}
        &lt;div className="p-8 bg-white rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow"&gt;
          &lt;div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4"&gt;
            &lt;i className="fas fa-briefcase text-primary text-2xl"&gt;&lt;/i&gt;
          &lt;/div&gt;
          &lt;h3 className="text-lg font-semibold text-slate-900 mb-2"&gt;岗位匹配&lt;/h3&gt;
          &lt;p className="text-slate-600"&gt;智能推荐适合的岗位，提升匹配度&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      {/* 底部按钮 - 开始使用 */}
      &lt;div className="text-center"&gt;
        &lt;a
          href="/analyzer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
        &gt;
          &lt;i className="fas fa-rocket"&gt;&lt;/i&gt;
          开始AI分析
        &lt;/a&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  )
}

export default Home

