# EasyFolio 项目文件通俗说明文档

## 📖 概述
这是给小白看的超级详细的项目文件说明文档！每个文件是干什么的、有什么用、可以怎么改，都讲得明明白白。

---

## 📦 根目录文件

### 1. package.json（根目录）
**通俗解释：** 这是整个项目的"命令遥控器"和"购物清单"

**里面的东西：**
- `name`: 项目名称，叫"easyfolio"
- `scripts`: 这里是**快捷命令**，就像电视机遥控器的按键
  - `npm run dev:ai` → 只启动AI简历分析器
  - `npm run dev:portfolio` → 只启动作品集网站
  - `npm run server` → 只启动后端服务
  - `npm run dev:all` → **一键启动所有服务**（推荐！）
  - `npm run install:all` → 一键安装所有依赖（就像一次性买齐所有食材）
- `devDependencies`: 开发时需要的工具包，只有"concurrently"（同时运行多个命令的工具）

**可以自定义的地方：**
- 你可以自己添加新的 script 命令，比如加个"test"命令

---

### 2. .env
**通俗解释：** 这是项目的"密码本"和"设置表"，存着敏感信息和配置

**里面的内容：**
```bash
# API配置
API_BASE_URL=http://localhost:5000
# 解释：告诉前端后端服务在哪里（就像告诉服务员厨房在哪）

# Coze API配置
COZE_API_KEY=your_api_key_here
# 解释：AI服务的密钥，就像外卖平台的会员码，要换成你自己的！
COZE_WORKLOAD_IDENTITY_API_KEY=
COZE_INTEGRATION_BASE_URL=https://api.coze.com
COZE_INTEGRATION_MODEL_BASE_URL=https://model.coze.com

# 服务器配置
PORT=5000
# 解释：后端服务运行在哪个端口（就像餐厅地址门牌号）
NODE_ENV=development
# 解释：开发模式还是生产模式

# 前端配置
REACT_APP_API_URL=http://localhost:5000
REACT_APP_COZE_API_KEY=your_api_key_here
```

**必须改的地方：**
- `COZE_API_KEY`：一定要换成你自己的Coze API密钥！

**可以改的地方：**
- `PORT`：如果5000端口被占用，可以改成别的（比如3000、8080）

---

## 🗂️ config/ 目录（配置文件）
这个目录存放的是两个子项目共用的配置，就像餐厅的统一管理制度。

### config/tailwind/main.config.js
**通俗解释：** Tailwind CSS的"装修风格手册"

**可以自定义的地方：**
- 主题颜色
- 字体大小
- 间距大小
- 等等...

---

## 🤖 easyfolio-ai/ 目录（AI简历分析器）

### easyfolio-ai/package.json
**通俗解释：** AI模块单独的"购物清单"

**里面的东西：**
- `dependencies`: 运行时需要的包
  - `react`: React框架（搭积木的工具）
  - `react-dom`: 让React能在浏览器显示
  - `react-router-dom`: 页面跳转路由
- `devDependencies`: 开发工具
  - `vite`: 快速的开发服务器
  - `tailwindcss`: CSS框架（装修工具箱）

### easyfolio-ai/vite.config.js
**通俗解释：** Vite开发工具的"使用说明书"

**重点：**
- `alias`: 路径别名，就像给文件起绰号
  - `@` → `src/` 目录
  - `@styles` → 共享的样式目录
  - `@utils` → 共享的工具函数目录
- `port: 5173`: 开发服务器运行在5173端口

**可以改的地方：**
- `port`: 改成你喜欢的端口号

### easyfolio-ai/src/App.jsx
**通俗解释：** AI模块的"交通指挥中心"，管理所有页面

**功能：**
- 设置路由（页面跳转）
- `/` → 首页
- `/analyzer` → AI分析页面

### easyfolio-ai/src/main.jsx
**通俗解释：** AI模块的"启动开关"

### easyfolio-ai/src/pages/Home.jsx
**通俗解释：** AI模块的首页

### easyfolio-ai/src/pages/AIResumeAnalyzer.jsx
**通俗解释：** AI简历分析的主页面

### easyfolio-ai/src/components/layout/Layout.jsx
**通俗解释：** 页面布局组件（导航栏、页脚等）

### easyfolio-ai/src/styles/global.css
**通俗解释：** AI模块的全局样式

---

## 🎨 easyfolio-portfolio/ 目录（作品集网站）

### easyfolio-portfolio/package.json
**通俗解释：** 作品集模块的"购物清单"

### easyfolio-portfolio/index.html
**通俗解释：** 作品集网站的主页（主入口）

### easyfolio-portfolio/project.html
**通俗解释：** 项目详情页模板

### easyfolio-portfolio/assets/css/main.css
**通俗解释：** 作品集的样式文件

### easyfolio-portfolio/assets/js/main.js
**通俗解释：** 作品集的交互脚本

### easyfolio-portfolio/content/projects/
**通俗解释：** 存放项目案例的文件夹，用Markdown格式写
- project-1.md, project-2.md... 每个文件就是一个项目介绍

**可以自定义的地方：**
- 你可以在这里添加/修改/删除你的项目案例！

---

## 🍳 server/ 目录（后端服务）

### server/package.json
**通俗解释：** 后端服务的"购物清单"

**里面的依赖：**
- `express`: 后端框架（厨房管理系统）
- `cors`: 允许跨域请求（允许不同域名的前端访问）
- `coze-coding-dev-sdk`: 调用豆包AI的工具包

### server/server.js
**通俗解释：** 后端服务的"主厨"，处理所有请求

**核心功能：**
- `/api/chat`: AI对话接口
- `/api/health`: 健康检查接口

---

## 🎨 styles/ 目录（共享样式库）
这里存放两个子项目共用的样式，就像餐厅统一的餐具和装修风格。

### styles/base/
- `variables.css`: CSS变量（定义颜色、字体、间距等）
- `typography.css`: 字体样式

**可以自定义的地方：**
- 改颜色、改字体、改间距

### styles/components/
- `Button.css`: 按钮样式
- `Card.css`: 卡片样式
- `navigation.css`: 导航栏样式
- `tabs.css`: 标签页样式
- `Badge.css`: 徽章样式
- `Modal.css`: 弹窗样式

### styles/sections/
- `hero.css`: 首页大横幅样式
- `cases.css`: 案例展示区域样式
- `method.css`: 方法论区域样式
- `contact.css`: 联系区域样式
- `footer.css`: 页脚样式

### styles/utilities/
- `animations.css`: 动画效果

### styles/main.css
**通俗解释：** 样式总入口文件，把所有样式整合在一起

---

## 🔧 utils/ 目录（共享工具函数）
这里存放两个子项目共用的工具函数，就像餐厅的通用工具（开瓶器、切菜器等）。

### utils/api.js
**通俗解释：** API调用工具函数

**功能：**
- `fetchAPI`: 通用的API请求函数
- `postAPI`: POST请求
- `getAPI`: GET请求

### utils/storage.js
**通俗解释：** 本地存储工具函数

**功能：**
- `getLocalStorage`: 从浏览器本地存储读取数据
- `setLocalStorage`: 保存数据到浏览器本地存储

### utils/markdown.js
**通俗解释：** Markdown解析工具

**功能：**
- 把Markdown文本转换成HTML显示

---

## 💡 总结
现在你应该对每个文件是干什么的有概念了！

**核心文件：**
1. 根目录 `package.json` - 一键启动命令
2. `.env` - 配置API密钥
3. `server/server.js` - 后端AI服务
4. `easyfolio-ai/src/` - AI分析器前端
5. `easyfolio-portfolio/content/projects/` - 你的项目案例
