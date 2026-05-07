/**
 * 开发环境本地服务器
 * ====================
 * 
 * 【小白解释：
 * 这是开发时用的临时服务器，模拟 Vercel Serverless Function
 * 启动后可以在本地测试 API，不用每次都部署到 Vercel
 * 
 * 【启动方式】：
 * cd easyfolio-ai
 * npm run dev:server
 * 
 * 【访问地址】：
 * http://localhost:3000/api/chat
 */

const express = require('express')
const cors = require('cors')
const path = require('path')

// 根据 NODE_ENV 加载对应的环境配置文件
const env = process.env.NODE_ENV || 'development'
const envPath = path.resolve(__dirname, `../.env.${env}`)
require('dotenv').config({ path: envPath })
// 如果特定环境文件不存在，回退到 .env
if (!process.env.COZE_API_KEY) {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
}

const app = express()
const PORT = process.env.PORT || 3000

// 配置中间件
app.use(cors())
app.use(express.json())

// ========================================
// AI 聊天接口
// ========================================
app.post('/api/chat', async (req, res) => {
  try {
    const COZE_API_KEY = process.env.COZE_API_KEY
    const COZE_BOT_ID = process.env.COZE_BOT_ID

    if (!COZE_API_KEY || !COZE_BOT_ID) {
      return res.status(500).json({ error: '请配置 COZE_API_KEY 和 COZE_BOT_ID' })
    }

    const { messages, stream = true } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '消息不能为空' })
    }

    const requestBody = {
      bot_id: COZE_BOT_ID,
      user_id: `dev_user_${Date.now()}`,
      stream: stream,
      auto_save_history: true,
      additional_messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        content_type: msg.content_type || 'text'
      }))
    }

    const response = await fetch('https://api.coze.com/v3/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COZE_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Coze API 请求失败')
    }

    if (!stream) {
      const data = await response.json()
      return res.status(200).json(data)
    }

    // 流式响应
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        res.write('data: [DONE]\n\n')
        break
      }
      const chunk = decoder.decode(value)
      res.write(chunk)
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    res.end()

  } catch (error) {
    console.error('API 错误:', error)
    return res.status(500).json({ error: error.message })
  }
})

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'EasyFolio AI 开发服务器运行正常',
    timestamp: new Date().toISOString()
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log('')
  console.log('='.repeat(50))
  console.log('  EasyFolio AI 开发服务器已启动')
  console.log('='.repeat(50))
  console.log(`  服务地址: http://localhost:${PORT}`)
  console.log(`  API路由: http://localhost:${PORT}/api/chat`)
  console.log(`  健康检查: http://localhost:${PORT}/api/health`)
  console.log('='.repeat(50))
  console.log('')
})
