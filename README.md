# EasyFolio - 个人作品集生成平台

现代化个人作品集生成工具，提供精美的视觉设计和流畅的交互体验，支持基于Markdown的内容管理。

## 📁 项目结构

```
easyfolio/
├── easyfolio-portfolio/    # 作品集网站子项目（静态HTML）【主入口】
│   ├── assets/            # 静态资源
│   │   ├── css/           # CSS样式（引用共享样式）
│   │   └── js/            # JavaScript
│   ├── content/           # Markdown内容
│   │   └── projects/      # 项目文档
│   ├── index.html         # 作品集主页（项目主入口）
│   ├── project.html       # 项目详情页模板
│   └── package.json       # 依赖配置
├── styles/                # 设计系统样式文件（共享）
│   ├── base/              # 基础样式（变量、字体）
│   ├── components/        # 组件样式（按钮、卡片等）
│   ├── sections/          # 区块样式（Hero、案例等）
│   ├── utilities/         # 工具类（动画等）
│   └── main.css          # 样式入口文件
├── docs/                  # 项目文档
│   ├── EasyFolio-产品PRD.md        # 产品需求文档
│   ├── tech-design.md     # 技术设计文档
│   ├── project-architecture.canvas # 架构思维导图
│   ├── user-journey-flow.canvas    # 用户旅程图
│   └── website-sitemap.canvas      # 网站地图
├── env.example            # 环境变量配置模板
├── .gitignore             # Git忽略配置
├── package.json           # 根目录便捷脚本
└── README.md              # 本文件
```

## 🎯 核心功能

### 1. 作品集网站 (easyfolio-portfolio) - 主入口
- 🎨 现代化主页设计
- 📁 基于Markdown的内容管理
- 📱 响应式布局
- 🔗 多项目子页跳转
- ✨ 精美动画效果

### 2. 设计系统 (styles/)
- 🎨 统一的设计规范
- 📐 模块化样式组件（按钮、卡片、导航等）
- 🎯 响应式设计支持

## 🚀 快速开始

### 启动作品集网站（主入口）

```bash
cd easyfolio-portfolio
npm install
npm run dev
```

访问 `http://localhost:3001`

## 🛠️ 技术栈

| 模块 | 技术 | 版本 |
|------|------|------|
| 构建工具 | Vite | 5.x |
| CSS框架 | Tailwind CSS | 4.x |
| 图标库 | Font Awesome | 6.x |
| Markdown解析 | marked | 12.x |

## 🔧 开发命令

```bash
# 根目录命令
npm run dev:portfolio      # 启动作品集开发服务器 (端口 3001)

# easyfolio-portfolio
npm run dev                # 开发模式 (端口 3001)
npm run generate           # 生成项目列表
```

## 📋 项目文件说明

### easyfolio-portfolio/ (作品集网站 - 主入口)
| 文件/目录 | 说明 |
|-----------|------|
| `assets/css/` | 作品集样式（引用共享样式库） |
| `assets/js/` | 作品集交互脚本 |
| `content/projects/` | 项目案例Markdown文档（可编辑） |
| `index.html` | 作品集主页（项目主入口） |
| `project.html` | 项目详情页模板 |
| `package.json` | 静态站点依赖 |

### styles/ (设计系统 - 共享)
| 文件/目录 | 说明 |
|-----------|------|
| `base/variables.css` | CSS变量（定义颜色、字体、间距等） |
| `base/typography.css` | 字体样式 |
| `components/` | 组件样式（Button、Card、Navigation、Tabs、Badge、Modal） |
| `sections/` | 区块样式（Hero、Cases、Method、Contact、Footer） |
| `utilities/` | 工具类（动画效果） |
| `main.css` | 样式入口文件（整合所有模块） |

### docs/ (项目文档)
| 文件/目录 | 说明 |
|-----------|------|
| `EasyFolio-产品PRD.md` | 产品需求文档 |
| `tech-design.md` | 技术设计文档 |
| `project-architecture.canvas` | 架构思维导图（Obsidian Canvas） |
| `user-journey-flow.canvas` | 用户旅程图（Obsidian Canvas） |
| `website-sitemap.canvas` | 网站地图（Obsidian Canvas） |

### 根目录文件
| 文件 | 说明 |
|------|------|
| `.gitignore` | Git忽略配置（排除node_modules、dist等） |
| `env.example` | 环境变量配置模板 |
| `package.json` | 根目录便捷脚本 |
| `README.md` | 项目说明文档 |

## 🌐 部署方案

### 静态网站部署

作品集网站可部署到：
- **GitHub Pages**: 免费静态托管
- **Vercel**: 快速部署
- **Netlify**: 自动构建部署

## 🔑 环境变量配置

如需配置环境变量，请复制 `env.example` 为 `.env` 并填写相应值：

```bash
# 复制模板
cp env.example .env
```

**注意**: `.env` 文件包含敏感信息，不应提交到版本控制。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'Add xxx'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

## 📄 许可证

MIT License

---

**开始你的作品集之旅！** 🚀
