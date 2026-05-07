# EasyFolio 环境配置指南

## 目录

1. [概述](#概述)
2. [环境变量说明](#环境变量说明)
3. [快速开始](#快速开始)
4. [开发环境配置](#开发环境配置)
5. [生产环境部署](#生产环境部署)
6. [常见问题](#常见问题)

---

## 概述

EasyFolio 使用环境变量来管理不同运行环境的配置。所有环境配置文件都放在项目根目录。

### 文件结构

```
easyfolio/
├── .env.example              # 配置模板（可提交）
├── .env.development          # 开发环境配置（可提交）
├── .env.production           # 生产环境配置（不提交）
├── .env                      # 本地环境配置（不提交）
└── .gitignore                # Git忽略配置
```

### 环境文件说明

| 文件 | 用途 | 是否提交Git |
|------|------|------------|
| `.env.example` | 配置模板，包含所有可用配置项的说明 | ✅ 是 |
| `.env.development` | 开发环境默认配置 | ✅ 是 |
| `.env.production` | 生产环境配置（仅本地参考） | ❌ 否 |
| `.env` | 本地个人配置（优先级最高） | ❌ 否 |

---

## 环境变量说明

### Coze API 配置（必填）

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `COZE_API_KEY` | Coze API Key | `pat_xxxxxxxxxxxxx` |
| `COZE_BOT_ID` | Coze Bot ID | `73xxxxxxxxxxxxx` |
| `COZE_API_BASE_URL` | Coze API 基础地址 | `https://api.coze.com` |

### 服务器配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 本地开发服务器端口 | `3000` |
| `API_BASE_URL` | API 基础地址 | `http://localhost:3000` |

### 应用配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `development` |
| `APP_NAME` | 应用名称 | `EasyFolio` |
| `APP_VERSION` | 应用版本 | `1.0.0` |

---

## 快速开始

### 1. 复制配置模板

```bash
# 复制模板为本地配置
cp .env.example .env
```

### 2. 配置 Coze API

编辑 `.env` 文件，填入您的 Coze API 信息：

```bash
COZE_API_KEY=pat_your_actual_api_key
COZE_BOT_ID=73your_actual_bot_id
```

### 3. 获取 Coze API 凭证

1. 访问 [coze.com](https://www.coze.com)
2. 登录或注册账号
3. 创建或选择一个机器人
4. 在机器人设置页面获取 Bot ID
5. 在 API 设置页面生成 API Key

---

## 开发环境配置

### 方式一：使用 .env.development（推荐）

1. 编辑 `.env.development`，填入开发环境的 API 凭证
2. 设置环境变量并启动：

```bash
# Linux/Mac
export NODE_ENV=development
npm run dev:server

# Windows (PowerShell)
$env:NODE_ENV="development"
npm run dev:server

# Windows (CMD)
set NODE_ENV=development
npm run dev:server
```

### 方式二：使用 .env（本地覆盖）

1. 复制 `.env.example` 为 `.env`
2. 编辑 `.env` 填入您的配置
3. 直接启动，系统会自动加载 `.env`

### 启动开发环境

```bash
# 安装所有依赖
npm run install:all

# 启动开发服务器（后端）
cd easyfolio-ai
npm run dev:server

# 在另一个终端启动前端
npm run dev:ai
```

---

## 生产环境部署

### Vercel 部署（推荐）

1. 在 Vercel 项目设置中配置环境变量：
   - `COZE_API_KEY`
   - `COZE_BOT_ID`
   - `COZE_API_BASE_URL`
   - `NODE_ENV=production`

2. 推送代码到 GitHub，Vercel 会自动部署

### 其他平台部署

确保在部署平台的环境变量配置中设置：
- `COZE_API_KEY`
- `COZE_BOT_ID`
- `COZE_API_BASE_URL`

### 环境变量加载优先级

系统按以下优先级加载环境变量：

1. 系统环境变量（最高优先级）
2. `.env.{NODE_ENV}` 文件
3. `.env` 文件
4. 默认值

---

## 常见问题

### Q: 如何确认环境变量是否正确加载？

A: 启动开发服务器后，访问 `http://localhost:3000/api/health`，会返回服务器状态信息。

### Q: 我修改了环境变量，为什么没有生效？

A: 修改环境变量后需要重启服务器才能生效。

### Q: .env 文件不小心提交到 Git 了怎么办？

A: 

```bash
# 从 Git 中移除（但保留本地文件）
git rm --cached .env
git rm --cached .env.production

# 提交更改
git commit -m "Remove sensitive env files"

# 确保在 .gitignore 中正确配置
```

### Q: 可以在前端代码中访问环境变量吗？

A: 为了安全，前端不能直接访问 `COZE_*` 开头的敏感变量。只有以下非敏感变量可以访问：
- `import.meta.env.APP_NAME`
- `import.meta.env.APP_VERSION`
- `import.meta.env.NODE_ENV`

### Q: 如何切换不同的开发环境？

A: 通过设置 `NODE_ENV` 环境变量来切换：

```bash
# 开发环境
export NODE_ENV=development
npm run dev:server

# 如果需要其他环境，可以创建 .env.staging 等文件
```

---

## 安全最佳实践

1. ✅ **永远不要**将包含真实 API Key 的文件提交到 Git
2. ✅ 使用 `.env.example` 作为配置模板
3. ✅ 在不同环境使用不同的 API Key
4. ✅ 定期轮换 API Key
5. ✅ 在部署平台使用加密的环境变量存储

---

## 更新日志

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2026-05-06 | 初始版本，完成环境配置标准化 |
