# EasyFolio - AI简历分析器与作品集生成平台

基于AI驱动的个人作品集生成工具，包含AI简历分析和作品集网站两个核心模块，支持模块化共享样式。

## 📁 项目结构

```
easyfolio/
├── easyfolio-ai/           # AI简历分析子项目（React + Vite）
│   ├── api/               # Vercel Serverless Functions
│   │   ├── chat.js        # AI对话接口（核心后端）
│   │   └── server.js      # 开发环境本地服务器
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── pages/          # 页面组件
│   │   └── styles/         # 全局样式（引用共享样式）
│   ├── index.html          # 入口HTML
│   ├── package.json        # 依赖配置
│   ├── vite.config.js      # Vite构建配置
│   └── tailwind.config.js  # Tailwind主题配置
├── easyfolio-portfolio/    # 作品集网站子项目（静态HTML）【主入口】
│   ├── assets/             # 静态资源
│   │   ├── css/            # CSS样式（引用共享样式）
│   │   └── js/             # JavaScript
│   ├── content/            # Markdown内容
│   │   └── projects/       # 项目文档
│   ├── index.html          # 作品集主页（项目主入口）
│   ├── project.html        # 项目详情页模板
│   └── package.json        # 依赖配置
├── styles/                 # 设计系统样式文件（共享）
│   ├── base/               # 基础样式（变量、字体）
│   ├── components/         # 组件样式（按钮、卡片等）
│   ├── sections/           # 区块样式（Hero、案例等）
│   ├── utilities/          # 工具类（动画等）
│   └── main.css            # 样式入口文件
├── docs/                   # 项目文档
│   ├── EasyFolio-产品PRD.md        # 产品需求文档
│   ├── project-architecture.canvas # 架构思维导图
│   ├── project-files-explanation.md # 文件说明文档
│   └── cleanup-report.md   # 文件清理报告
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions 部署脚本
├── .gitignore              # Git忽略配置
├── .env                    # 环境变量配置
├── package.json            # 根目录便捷脚本
└── README.md               # 本文件
```

## 🎯 核心功能

### 1. AI简历分析器 (easyfolio-ai)
- 🤖 智能简历优化分析
- 📊 职场能力评估
- 🔍 岗位匹配分析
- ✅ AI任务规划（TodoList）
- 💬 实时AI对话（流式响应）

### 2. 作品集网站 (easyfolio-portfolio) - 主入口
- 🎨 现代化主页设计
- 📁 基于Markdown的内容管理
- 📱 响应式布局
- 🔗 多项目子页跳转
- ✨ 精美动画效果

### 3. 设计系统 (styles/)
- 🎨 统一的设计规范，两个子项目共享
- 📐 模块化样式组件（按钮、卡片、导航等）
- 🎯 响应式设计支持

## 🔗 模块化架构

两个子项目通过相对路径实现对共享资源的模块化调用：

| 子项目 | 样式来源 |
|--------|----------|
| **easyfolio-ai** | `@styles/base/`, `@styles/components/` |
| **easyfolio-portfolio** | `styles/base/`, `styles/components/`, `styles/sections/` |

## 🔗 模块跳转

两个子项目之间可以通过按钮相互跳转：

| 模块 | 跳转目标 | 跳转方式 |
|------|----------|----------|
| **作品集网站** | AI简历分析器 | 导航栏「AI分析」按钮 |
| **AI简历分析器** | 作品集网站 | 导航栏「作品集」按钮 |

## 🚀 快速开始

### 方式一：启动作品集网站（主入口）

```bash
cd easyfolio-portfolio
npm install
npm run dev
```

访问 `http://localhost:3001`，点击导航栏的「AI分析」按钮跳转到AI模块。

### 方式二：启动AI简历分析器（含后端）

```bash
# 安装依赖
cd easyfolio-ai
npm install

# 终端1：启动前端开发服务器
npm run dev

# 终端2：启动开发环境后端服务器（模拟Vercel）
npm run dev:server
```

访问 `http://localhost:5173`

### 方式三：一键安装所有依赖

```bash
npm run install:all
```

## 🛠️ 技术栈

| 模块 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 18.x |
| 构建工具 | Vite | 5.x |
| CSS框架 | Tailwind CSS | 4.x |
| 后端服务 | Vercel Serverless Functions | - |
| AI服务 | Coze API | - |
| 图标库 | Font Awesome | 6.x |
| 开发工具 | Concurrently | 8.x |

## 🔧 开发命令

```bash
# 根目录命令
npm run dev:ai             # 启动AI模块开发服务器 (端口 5173)
npm run dev:portfolio      # 启动作品集开发服务器 (端口 3001)
npm run install:all        # 安装所有子项目依赖
npm run build:all          # 构建所有子项目

# easyfolio-ai
npm run dev                # 开发模式 (端口 5173)
npm run dev:server         # 启动开发环境后端 (端口 3000)
npm run build              # 生产构建
npm run preview            # 预览构建结果

# easyfolio-portfolio
npm run dev                # 开发模式 (端口 3001)

# 部署到 Vercel
npm run build              # 先构建
vercel --prod              # 部署到生产环境
```

## 📋 项目文件说明

### easyfolio-ai/ (AI简历分析子项目)
| 文件/目录 | 说明 |
|-----------|------|
| `api/chat.js` | **Vercel Serverless Function** - AI对话接口（核心） |
| `api/server.js` | 开发环境本地服务器（模拟Vercel） |
| `src/components/` | React组件（布局、UI组件） |
| `src/pages/` | 页面组件（首页、AI分析页） |
| `src/styles/` | 全局样式文件（引用共享样式） |
| `index.html` | Vite入口HTML |
| `vite.config.js` | Vite构建配置（端口5173） |
| `tailwind.config.js` | Tailwind CSS主题配置 |
| `package.json` | React项目依赖 |

### easyfolio-portfolio/ (作品集网站 - 主入口)
| 文件/目录 | 说明 |
|-----------|------|
| `assets/css/` | 作品集样式（引用共享样式库） |
| `assets/js/` | 作品集交互脚本 |
| `content/projects/` | 项目Markdown文档（可编辑） |
| `index.html` | 作品集主页（项目主入口） |
| `project.html` | 项目详情页模板 |
| `package.json` | 静态站点依赖 |

### styles/ (设计系统 - 共享)
| 文件/目录 | 说明 |
|-----------|------|
| `base/variables.css` | 设计变量（颜色、字体、间距） |
| `base/typography.css` | 字体规范 |
| `components/` | 组件样式（Button、Card、Navigation、Tabs、Badge、Modal） |
| `sections/` | 区块样式（Hero、Cases、Method、Contact、Footer） |
| `utilities/animations.css` | 动画工具类 |
| `main.css` | 样式入口（整合所有模块） |

### docs/ (项目文档)
| 文件/目录 | 说明 |
|-----------|------|
| `EasyFolio-产品PRD.md` | 产品需求文档 |
| `project-architecture.canvas` | 架构思维导图（Obsidian Canvas） |
| `project-files-explanation.md` | 文件详细说明 |
| `cleanup-report.md` | 项目文件清理报告 |

### 根目录文件
| 文件 | 说明 |
|------|------|
| `.gitignore` | Git忽略配置（排除node_modules、dist等） |
| `.env` | 环境变量配置（Coze API Key等） |
| `package.json` | 根目录便捷脚本 |
| `README.md` | 项目说明文档 |

## 🌐 部署方案

### 开发环境
```bash
# 启动前端
cd easyfolio-ai
npm run dev

# 启动开发后端（另一个终端）
npm run dev:server
```

### 生产部署

**推荐平台：Vercel**

1. **配置环境变量**（在Vercel控制台设置）：
   ```bash
   COZE_API_KEY=your_api_key_here
   COZE_BOT_ID=your_bot_id_here
   ```

2. **部署命令**：
   ```bash
   cd easyfolio-ai
   npm run build
   vercel --prod
   ```

**部署流程**：
```
前端请求 → Vercel Edge Network → Serverless Function (api/chat.js) → Coze API → 返回响应
```

### 静态网站部署

作品集网站可部署到：
- **GitHub Pages**: 免费静态托管
- **Vercel**: 与AI模块一起部署
- **Netlify**: 自动构建部署

## 🔑 环境变量配置

在 `.env` 文件中配置：

```bash
# Coze API配置（必填！）
VITE_COZE_API_KEY=your_api_key_here
VITE_COZE_BOT_ID=your_bot_id_here

# 服务器配置（开发环境）
PORT=3000

# API配置
API_BASE_URL=http://localhost:3000
```

**获取方式**：
1. 登录 [Coze 平台](https://www.coze.com)
2. 创建机器人，获取 `COZE_BOT_ID`（URL末尾的数字）
3. 在设置页面生成 `COZE_API_KEY`（格式：`pat_xxxxxxxxxxxxx`）

**注意**: `.env` 文件包含敏感信息，不应提交到版本控制。

## 🔒 安全说明

- ✅ API Key 保存在 Vercel 环境变量中，不在前端暴露
- ✅ 前端通过 Serverless Function 中转调用 Coze API
- ✅ 使用 HTTPS 加密传输（Vercel 默认支持）
- ✅ 开发环境使用本地服务器，不暴露密钥

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'Add xxx'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题，请提交 Issue 或查看 `docs/` 目录下的文档。

---

**开始你的AI驱动作品集之旅！** 🚀
