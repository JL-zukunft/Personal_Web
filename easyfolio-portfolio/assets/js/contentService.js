// 导入自动生成的项目文件列表
// 这个文件由 scripts/generate-project-list.js 在运行 npm run dev 时自动生成
import { projectFiles } from './projects-data.js';

/**
 * 内容服务类 - 负责加载和解析 Markdown 项目文件
 * 
 * 主要功能：
 * 1. 从服务器加载 Markdown 文件
 * 2. 解析 YAML frontmatter 元数据
 * 3. 提供缓存机制避免重复加载
 * 4. 管理项目列表和项目详情
 */
class ContentService {
    constructor() {
        // 创建缓存 Map，存储已加载的 Markdown 内容
        this.cache = new Map();
        // 存储项目列表数据
        this.projectList = null;
    }

    /**
     * 从服务器获取 Markdown 文件内容
     * @param {string} filePath - 文件路径
     * @returns {Promise<string>} - 文件内容
     */
    async fetchMarkdown(filePath) {
        const cacheKey = filePath;
        
        // 如果缓存中有，直接返回，避免重复请求
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            // 使用 fetch API 获取文件
            const response = await fetch(filePath);
            
            // 如果请求失败，抛出错误
            if (!response.ok) {
                throw new Error(`Failed to fetch ${filePath}: ${response.status}`);
            }
            
            // 读取文件内容为文本
            const content = await response.text();
            // 存入缓存
            this.cache.set(cacheKey, content);
            
            return content;
        } catch (error) {
            console.error('ContentService error:', error);
            throw error;
        }
    }

    /**
     * 解析 Markdown 文件中的 YAML frontmatter
     * @param {string} content - Markdown 文件内容
     * @returns {object} - 包含 metadata（元数据）和 content（正文内容）
     */
    parseFrontmatter(content) {
        // 正则表达式匹配 YAML frontmatter
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        // 如果没有匹配到，返回原始内容
        if (!match) {
            return {
                metadata: null,
                content: content
            };
        }

        // 提取 frontmatter 和正文内容
        const frontmatter = match[1];
        const markdownContent = match[2];
        
        try {
            // 解析 YAML 为对象
            const metadata = this.parseYAML(frontmatter);
            return { metadata, content: markdownContent };
        } catch (error) {
            // 如果解析失败，给出警告但继续执行
            console.warn('Failed to parse frontmatter YAML, treating as plain content');
            return {
                metadata: null,
                content: content
            };
        }
    }

    /**
     * 解析 YAML 字符串为 JavaScript 对象
     * @param {string} yamlString - YAML 字符串
     * @returns {object} - 解析后的对象
     */
    parseYAML(yamlString) {
        const result = {};
        const lines = yamlString.split('\n');
        
        // 逐行解析
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // 跳过空行和注释
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue;
            }
            
            // 找到冒号分隔符
            const colonIndex = trimmedLine.indexOf(':');
            if (colonIndex === -1) {
                continue;
            }
            
            // 提取键和值
            const key = trimmedLine.substring(0, colonIndex).trim();
            const value = trimmedLine.substring(colonIndex + 1).trim();
            
            // 根据值的类型进行转换
            if (value.startsWith('[') && value.endsWith(']')) {
                // 数组类型
                try {
                    result[key] = JSON.parse(value);
                } catch {
                    // 如果 JSON 解析失败，手动解析
                    result[key] = value.slice(1, -1).split(',').map(item => item.trim().replace(/["']/g, ''));
                }
            } else if (value === 'true' || value === 'false') {
                // 布尔类型
                result[key] = value === 'true';
            } else if (!isNaN(value)) {
                // 数字类型
                result[key] = parseFloat(value);
            } else if (value.startsWith('"') && value.endsWith('"')) {
                // 带引号的字符串
                result[key] = value.slice(1, -1);
            } else {
                // 默认字符串类型
                result[key] = value;
            }
        }
        
        return result;
    }

    /**
     * 获取所有项目列表
     * @returns {Promise<array>} - 项目对象数组
     */
    async getProjectList() {
        // 如果已经加载过，直接返回缓存
        if (this.projectList) {
            return this.projectList;
        }

        const projects = [];

        // 遍历所有项目文件
        for (const fileName of projectFiles) {
            try {
                // 获取文件内容
                const content = await this.fetchMarkdown(`/content/projects/${fileName}`);
                // 解析 frontmatter
                const { metadata } = this.parseFrontmatter(content);
                
                // 创建项目对象
                projects.push({
                    id: fileName.replace('.md', ''),  // 文件名作为项目 ID
                    ...metadata  // 展开元数据
                });
            } catch (error) {
                // 单个项目加载失败不影响其他项目
                console.warn(`Failed to load project: ${fileName}`, error);
            }
        }

        // 按 order 字段排序
        this.projectList = projects.sort((a, b) => (a.order || 999) - (b.order || 999));
        return this.projectList;
    }

    /**
     * 根据项目 ID 获取项目详情
     * @param {string} projectId - 项目 ID（即文件名去掉 .md）
     * @returns {Promise<object>} - 项目详情对象
     */
    async getProjectById(projectId) {
        const filePath = `/content/projects/${projectId}.md`;
        
        try {
            // 获取文件内容
            const content = await this.fetchMarkdown(filePath);
            // 解析 frontmatter 和正文
            const { metadata, content: markdownContent } = this.parseFrontmatter(content);
            
            return {
                id: projectId,
                metadata: metadata || {},  // 元数据对象
                content: markdownContent   // Markdown 正文内容
            };
        } catch (error) {
            console.error(`Failed to get project ${projectId}:`, error);
            throw error;
        }
    }

    /**
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
        this.projectList = null;
    }
}

// 创建单例实例，供外部使用
const contentService = new ContentService();

// 导出实例和类
export { contentService, ContentService };