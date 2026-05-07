/**
 * Vercel Serverless Function - Coze AI 对话中转
 * ===============================================
 *
 * 【小白解释：
 * 这是一个"安全中转站"，前端不直接调用 Coze API
 * 而是通过这个函数中转，保护 API Key 不被泄露
 *
 * 【部署方式】：
 * 1. 将此文件放在 easyfolio-ai/api/chat.js
 * 2. 在 Vercel 配置环境变量：COZE_API_KEY 和 COZE_BOT_ID
 * 3. 部署到 Vercel
 *
 * 【前端调用方式】：
 * POST /api/chat
 * Body: { messages: [{ role: 'user', content: '你好' }], stream: true }
 *
 * 【响应】：
 * 流式响应（SSE），逐字返回 AI 回复
 */

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' })
  }

  try {
    // ========================================
    // 1. 从环境变量获取配置
    // ========================================
    const COZE_API_KEY = process.env.COZE_API_KEY
    const COZE_BOT_ID = process.env.COZE_BOT_ID

    // 检查配置是否存在
    if (!COZE_API_KEY || !COZE_BOT_ID) {
      return res.status(500).json({ error: '请配置 COZE_API_KEY 和 COZE_BOT_ID 环境变量' })
    }

    // ========================================
    // 2. 获取请求参数
    // ========================================
    const { messages, stream = true } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '消息不能为空' })
    }

    // ========================================
    // 3. 构建请求数据
    // ========================================
    const requestBody = {
      bot_id: COZE_BOT_ID,
      user_id: `vercel_user_${Date.now()}`,  // 生成唯一用户ID
      stream: stream,
      auto_save_history: true,
      additional_messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        content_type: msg.content_type || 'text'
      }))
    }

    // ========================================
    // 4. 调用 Coze API
    // ========================================
    const response = await fetch('https://api.coze.com/v3/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COZE_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    })

    // ========================================
    // 5. 处理响应
    // ========================================
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Coze API 请求失败')
    }

    // 如果是非流式响应，直接返回
    if (!stream) {
      const data = await response.json()
      return res.status(200).json(data)
    }

    // ========================================
    // 6. 流式响应处理
    // ========================================
    // 设置响应头
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

    // 获取响应流
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        // 发送结束标记
        res.write('data: [DONE]\n\n')
        break
      }

      // 解码数据并转发给前端
      const chunk = decoder.decode(value)
      res.write(chunk)
      
      // 刷新响应（确保数据立即发送）
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    // 结束响应
    res.end()

  } catch (error) {
    console.error('API 错误:', error)
    return res.status(500).json({ error: error.message })
  }
}

// 配置 Vercel 函数
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true
  }
}
