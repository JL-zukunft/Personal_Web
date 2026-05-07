/**
 * AIResumeAnalyzer 组件 - AI 简历分析器
 * ======================================
 *
 * 【小白解释：
 * 这是核心功能页面，用户在这里和 AI 对话
 * 就像餐厅的点菜区，用户告诉 AI 需求，AI 给出建议
 *
 * 【后端中转方式】：
 * 通过 Vercel Serverless Function (api/chat.js) 安全调用 Coze API
 * API Key 保存在 Vercel 环境变量中，不在前端暴露
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'

const AIResumeAnalyzer = () => {
  // ========================================
  // 状态变量
  // ========================================
  const [messages, setMessages] = useState([])              // 聊天记录
  const [inputValue, setInputValue] = useState('')          // 输入框内容
  const [isLoading, setIsLoading] = useState(false)         // 是否正在加载
  const [progress, setProgress] = useState(0)               // 进度条（0-100）
  const [progressMessage, setProgressMessage] = useState('准备就绪')  // 进度提示文字
  const [aiTasks, setAiTasks] = useState([])                // AI 任务规划列表
  const chatBodyRef = useRef(null)                          // 聊天区域引用

  // ========================================
  // 从 AI 响应中解析任务规划
  // ========================================
  const parseTasksFromAIResponse = useCallback((text) => {
    const tasks = []

    // 1. 尝试从 JSON 代码块中提取
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1])
        if (data.tasks && Array.isArray(data.tasks)) {
          return data.tasks
        }
      } catch (e) {
        console.log('JSON解析失败，尝试其他格式')
      }
    }

    // 2. 从列表中提取
    const lines = text.split('\n')
    let taskIndex = 0

    lines.forEach((line) => {
      const numberMatch = line.match(/^\s*(\d+)\.\s*(.+)$/)
      if (numberMatch) {
        taskIndex++
        tasks.push({
          id: `task_${taskIndex}`,
          content: numberMatch[2].trim(),
          status: 'pending'
        })
      }
      const checkboxMatch = line.match(/^\s*-\s*\[([ x])\]\s*(.+)$/)
      if (checkboxMatch) {
        taskIndex++
        tasks.push({
          id: `task_${taskIndex}`,
          content: checkboxMatch[2].trim(),
          status: checkboxMatch[1] === 'x' ? 'completed' : 'pending'
        })
      }
    })

    return tasks
  }, [])

  // ========================================
  // 从 AI 响应中提取思考过程
  // ========================================
  const parseThinkingFromResponse = useCallback((text) => {
    if (text.includes('⋘') && text.includes('⋙')) {
      const thinkStart = text.indexOf('⋘')
      const thinkEnd = text.indexOf('⋙')
      return text.slice(thinkStart + 7, thinkEnd)
    }
    return ''
  }, [])

  // ========================================
  // 发送消息函数（通过 Vercel 后端中转）
  // ========================================
  const sendMessage = async () => {
    if (!inputValue.trim()) return

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setProgress(5)
    setProgressMessage('接收您的请求...')

    try {
      setProgress(20)
      setProgressMessage('连接AI服务...')

      // ========================================
      // 调用 Vercel 后端中转 API
      // ========================================
      // 开发环境使用相对路径，Vercel 会自动路由到 api/chat
      const API_URL = '/api/chat'

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: inputValue, content_type: 'text' }],
          stream: true
        })
      })

      setProgress(50)
      setProgressMessage('接收AI响应...')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'AI服务请求失败')
      }

      // ========================================
      // 处理流式响应
      // ========================================
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim()
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.event === 'conversation.message.delta' && parsed.data) {
                const content = parsed.data.content || ''
                fullResponse += content
                setProgress(75)
                setProgressMessage('生成智能响应...')
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      // 提取任务规划
      const tasks = parseTasksFromAIResponse(fullResponse)
      if (tasks.length > 0) {
        setAiTasks(tasks)
      }

      // 添加 AI 回复
      const aiMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: fullResponse,
        thinking: parseThinkingFromResponse(fullResponse)
      }
      setMessages(prev => [...prev, aiMessage])
      setProgress(100)
      setProgressMessage('分析完成！')

    } catch (error) {
      console.error('AI API错误:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `抱歉，AI服务暂时不可用：${error.message}`
      }
      setMessages(prev => [...prev, errorMessage])
      setProgress(0)
      setProgressMessage('分析过程中出现错误')

    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setProgress(0)
        setProgressMessage('准备就绪')
      }, 2000)
    }
  }

  // ========================================
  // 切换思考过程显示
  // ========================================
  const toggleThinking = (e) => {
    const content = e.currentTarget.nextElementSibling
    const chevron = e.currentTarget.querySelector('.fa-chevron-down')
    content.classList.toggle('hidden')
    chevron.classList.toggle('rotate-180')
  }

  // ========================================
  // 自动滚动到底部
  // ========================================
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages])

  // ========================================
  // 渲染界面
  // ========================================
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 左侧栏 */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* 后端状态提示 */}
            <div className="p-4 border border-primary/10 bg-primary/5 rounded-xl">
              <div className="flex items-center gap-2">
                <i className="fas fa-shield-check text-primary"></i>
                <span className="text-sm font-medium text-primary">API Key 安全保护中</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">通过 Vercel Serverless Function 中转</p>
            </div>

            {/* 进度条卡片 */}
            <div className="p-6 border border-primary/10 bg-white/40 rounded-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary/70 mb-4">流程进度</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700 italic">"{progressMessage}"</span>
                  <span className="text-sm font-bold text-primary">{progress}%</span>
                </div>
                <div className="w-full bg-primary/10 rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>

            {/* 任务规划卡片 */}
            <div className="p-6 border border-primary/10 bg-white/20 rounded-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">AI任务规划</h4>
              <div className="space-y-3">
                {aiTasks.length > 0 ? (
                  aiTasks.map(task => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-white transition-colors">
                      <div className="h-5 w-5 mt-0.5 rounded border border-primary/30 flex items-center justify-center bg-white flex-shrink-0">
                        {task.status === 'completed' && <i className="fas fa-check text-primary text-xs"></i>}
                        {task.status === 'in_progress' && <i className="fas fa-spinner fa-spin text-amber-500 text-xs"></i>}
                        {task.status === 'pending' && <i className="fas fa-circle text-slate-300 text-xs"></i>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${task.status === 'completed' ? 'text-slate-700 line-through decoration-primary/40 opacity-60' : 'text-slate-700'}`}>
                          {task.content}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400">
                    <i className="fas fa-tasks text-2xl mb-2"></i>
                    <p className="text-xs">AI将根据您的需求</p>
                    <p className="text-xs">自动规划任务目标</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧聊天区域 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-primary/10 overflow-hidden">
            {/* 标题栏 */}
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold">AI简历分析器</h2>
              <p className="text-sm text-slate-500 mt-1">描述您的简历内容或上传文件，获取专业分析建议</p>
            </div>

            {/* 聊天内容 */}
            <div ref={chatBodyRef} className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-robot text-primary text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">你好！我是EasyFolio AI助手</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    请描述您的简历内容或上传简历文件，我将为您提供专业的分析和优化建议。
                  </p>
                </div>
              ) : (
                messages.map(message => (
                  <div key={message.id} className={`flex flex-col items-${message.type === 'user' ? 'end' : 'start'} gap-3 mb-8`}>
                    {message.type === 'bot' && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white shadow-md">
                          <i className="fas fa-robot text-sm"></i>
                        </div>
                        <span className="text-xs font-bold text-slate-500">AI助手</span>
                      </div>
                    )}

                    {message.type === 'bot' && message.thinking && (
                      <div className="w-full max-w-[85%]">
                        <div className="thinking-container">
                          <div className="thinking-header flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-t-xl cursor-pointer hover:bg-amber-100 transition-colors" onClick={toggleThinking}>
                            <i className="fas fa-brain text-amber-600"></i>
                            <span className="text-sm font-medium text-amber-700">思考过程</span>
                            <i className="fas fa-chevron-down text-amber-500 ml-auto transition-transform"></i>
                          </div>
                          <div className="thinking-content p-3 bg-amber-50/50 border-x border-amber-200 text-amber-800 text-sm whitespace-pre-wrap hidden">
                            {message.thinking}
                          </div>
                          <div className="h-0.5 bg-amber-200"></div>
                        </div>
                      </div>
                    )}

                    <div className={`max-w-[85%] p-5 rounded-xl ${message.type === 'user' ? 'bg-primary text-white shadow-lg shadow-primary/10' : 'bg-white shadow-sm border border-primary/5 text-slate-800'}`}>
                      {message.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 输入区域 */}
            <div className="p-6 border-t border-slate-200">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="请输入您的简历内容或问题..."
                  className="flex-1 px-5 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                  <span>{isLoading ? '分析中' : '发送'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIResumeAnalyzer
