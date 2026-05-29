# 项目文件标准化规范

## 1. 文件命名规范

### 1.1 命名格式
```
{年份}-{月份}-{序号}-{slug}.md
```

### 1.2 格式说明

| 组成部分 | 格式要求 | 示例 |
|---------|---------|------|
| 年份 | 4位数字 | 2024 |
| 月份 | 2位数字，前导零 | 06 (六月) |
| 序号 | 2位数字，前导零 | 01 |
| slug | 小写英文，连字符分隔 | ai-assistant |

### 1.3 命名示例
```
2024-06-01-ai-assistant.md      # AI智能助手设计
2024-03-02-data-analytics.md    # 数据分析平台
2023-11-03-smart-customer.md    # 智能客服系统
2023-08-04-smart-home.md        # 智能家居控制中心
```

### 1.4 命名规则
- **年份**: 项目完成年份
- **月份**: 项目完成月份
- **序号**: 同月份内的项目顺序（01开始）
- **slug**: 项目名称的英文缩写，全部小写，单词间用连字符分隔

---

## 2. Frontmatter字段规范

### 2.1 字段分类

#### 必填字段

| 字段名         | 类型     | 说明          | 示例                               |
| ----------- | ------ | ----------- | -------------------------------- |
| title       | string | 项目中文标题      | AI智能助手设计                         |
| subtitle    | string | 项目英文标题      | AI-powered Personal Assistant    |
| date        | string | 完成日期（ISO格式） | 2024-06-15                       |
| category    | string | 项目分类        | AI                               |
| tags        | array  | 标签列表（YAML列表格式） | - AI<br>- SaaS<br>- Product Design |
| role        | string | 担任角色        | Lead Designer                    |
| year        | string | 完成年份        | 2024                             |
| order       | number | 显示顺序（升序）    | 1                                |
| description | string | 项目简短描述      | 为企业用户设计的AI智能助手...                |
| Teamsize    | string | 团队规模        | 1设计师 + 3工程师                     |
| deliverables | string | 交付物清单       | 产品原型 + 设计规范 + 技术文档              |

#### 可选字段

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| techStack | array | 技术栈列表（YAML列表格式） | - React<br>- Node.js<br>- MongoDB |
| coverImage | string | 封面图片路径 | ../assets/images/project-covers/xxx.png |
| projectUrl | string | 项目链接 | https://github.com/example/project |

### 2.2 Frontmatter示例

```yaml
---
title: AI智能助手设计
subtitle: AI-powered Personal Assistant
date: 2024-06-15
category: AI
tags:
  - AI
  - SaaS
  - Product Design
techStack:
  - React 18
  - Node.js
  - MongoDB
  - Tailwind CSS
coverImage: ../assets/images/project-covers/ai-assistant.png
projectUrl: https://github.com/example/ai-assistant
role: Lead Designer
year: 2024
order: 1
description: 为企业用户设计的AI智能助手，集成了自然语言理解、任务管理和数据分析功能。
Teamsize: 1设计师 + 3工程师
deliverables: 产品原型 + 设计规范 + 技术文档
---
```

---

## 3. 内容结构规范

### 3.1 章节结构

```markdown
---
[Frontmatter]
---

## 项目概述
[项目简介描述]

## 项目背景
[项目背景和动机]

## 核心功能
[功能列表或描述]

## 设计亮点
[设计亮点和创新点]

## 技术栈
[技术栈列表]

## 我的角色
[个人职责描述]

## 完成时间
[完成时间说明]
```

### 3.2 章节说明

| 章节 | 要求 | 说明 |
|------|------|------|
| 项目概述 | 必填 | 项目的核心价值和目标 |
| 项目背景 | 必填 | 项目产生的背景和市场需求 |
| 核心功能 | 必填 | 项目的主要功能点 |
| 设计亮点 | 必填 | 项目的创新和优势 |
| 技术栈 | 必填 | 技术实现方案 |
| 我的角色 | 必填 | 个人在项目中的职责 |
| 完成时间 | 必填 | 项目完成时间 |

---

## 4. 分类规范

### 4.1 允许的分类值

| 分类         | 说明     | 适用范围             |
| ---------- | ------ | ---------------- |
| AI         | 人工智能相关 | AI助手、智能客服、AI分析平台 |
| Enterprise | 企业服务   | B2B产品、企业管理系统     |
| IoT        | 物联网    | 智能家居、智能硬件        |
| Consumer   | 消费级产品  | 面向消费者的应用         |
| Web        | 网站开发   | 网站、Web应用         |
| Mobile     | 移动应用   | iOS/Android应用    |
| Design     | 设计系统   | 设计规范、组件库         |
| Testing    | 测试项目   | 测试用例、演示项目        |

### 4.2 标签规范

- 使用英文单词，首字母大写（如：AI、Dashboard、Enterprise）
- 标签数量建议3-5个
- 避免过于宽泛的标签（如"App"）
- 采用YAML列表格式，每个标签独占一行，使用缩进
- 中文标签可使用中文（如：前端网页设计）

---

## 5. 文件名重命名对照表

| 原文件名 | 新文件名 |
|----------|----------|
| project-1.md | 2026-06-01-ai-assistant.md |
| project-2.md | 2026-03-02-data-analytics.md |
| project-3.md | 2026-11-03-smart-customer.md |
| project-4.md | 2026-08-04-smart-home.md |
| project-test.md | 2026-12-99-test-project.md |

---

## 6. 统计与查找说明

### 6.1 文件统计

```bash
# 按年份统计
ls | grep "^2024" | wc -l

# 按分类统计（通过Frontmatter）
grep -l "category: AI" *.md | wc -l
```

### 6.2 文件查找

```bash
# 按年份查找
ls | grep "^2024"

# 按关键词查找
grep -l "智能" *.md
```

---

**版本**: 1.0  
**创建日期**: 2026-05-06  
**适用范围**: EasyFolio项目内容管理