// 项目文件列表（自动生成）
const projectFiles = [
    "2026-03-02-data-analytics.md",
    "2026-06-01-ai-assistant.md",
    "2026-08-04-smart-home.md",
    "2026-11-03-smart-customer.md",
    "2026-12-99-test-project.md"
];

// 内容服务类
class ContentService {
    constructor() {
        this.cache = new Map();
        this.projectList = null;
    }

    async fetchMarkdown(filePath) {
        const cacheKey = filePath;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${filePath}: ${response.status}`);
            }
            const content = await response.text();
            this.cache.set(cacheKey, content);
            return content;
        } catch (error) {
            console.error('ContentService error:', error);
            throw error;
        }
    }

    parseFrontmatter(content) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (!match) {
            return { metadata: null, content: content };
        }

        const frontmatter = match[1];
        const markdownContent = match[2];
        
        try {
            const metadata = this.parseYAML(frontmatter);
            return { metadata, content: markdownContent };
        } catch (error) {
            console.warn('Failed to parse frontmatter YAML');
            return { metadata: null, content: content };
        }
    }

    parseYAML(yamlString) {
        const result = {};
        const lines = yamlString.split('\n');
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue;
            }
            
            const colonIndex = trimmedLine.indexOf(':');
            if (colonIndex === -1) {
                continue;
            }
            
            const key = trimmedLine.substring(0, colonIndex).trim();
            const value = trimmedLine.substring(colonIndex + 1).trim();
            
            if (value.startsWith('[') && value.endsWith(']')) {
                try {
                    result[key] = JSON.parse(value);
                } catch {
                    result[key] = value.slice(1, -1).split(',').map(item => item.trim().replace(/["']/g, ''));
                }
            } else if (value === 'true' || value === 'false') {
                result[key] = value === 'true';
            } else if (!isNaN(value)) {
                result[key] = parseFloat(value);
            } else if (value.startsWith('"') && value.endsWith('"')) {
                result[key] = value.slice(1, -1);
            } else {
                result[key] = value;
            }
        }
        
        return result;
    }

    async getProjectList() {
        if (this.projectList) {
            return this.projectList;
        }

        const projects = [];

        for (const fileName of projectFiles) {
            try {
                const content = await this.fetchMarkdown(`/content/projects/${fileName}`);
                const { metadata } = this.parseFrontmatter(content);
                
                projects.push({
                    id: fileName.replace('.md', ''),
                    ...metadata
                });
            } catch (error) {
                console.warn(`Failed to load project: ${fileName}`, error);
            }
        }

        this.projectList = projects.sort((a, b) => (a.order || 999) - (b.order || 999));
        return this.projectList;
    }
}

// 创建内容服务实例
const contentService = new ContentService();

// 页面加载完成后执行初始化操作
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    setupScrollAnimation();
    setupNavHighlight();
});

// 加载项目列表
async function loadProjects() {
    const casesList = document.getElementById('casesList');
    if (!casesList) {
        return;
    }
    
    try {
        const projects = await contentService.getProjectList();
        
        projects.forEach(project => {
            const caseItem = document.createElement('div');
            caseItem.className = 'case-item';
            caseItem.innerHTML = `
                <div class="case-header" onclick="toggleCase('${project.id}')">
                    <div class="case-number">${String(project.order || 1).padStart(2, '0')}</div>
                    <div class="case-info">
                        <div class="case-title">${project.title || '未命名项目'}</div>
                        <div class="case-subtitle">${project.subtitle || ''}</div>
                    </div>
                    <div class="case-tags">
                        ${(project.tags || []).map(tag => `<span class="case-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="case-toggle">+</div>
                </div>
                <div class="case-detail" id="detail-${project.id}">
                    <div class="case-detail-inner">
                        <div class="case-block">
                            <div class="case-block-label">项目描述</div>
                            <div class="case-block-content">
                                <p>${project.description || ''}</p>
                            </div>
                        </div>
                        <div class="case-block">
                            <div class="case-block-label">我的角色</div>
                            <div class="case-block-content">
                                <p>${project.role || ''} | ${project.year || ''}</p>
                            </div>
                        </div>
                        <button class="btn-primary" onclick="openProject('${project.id}')">查看详情</button>
                    </div>
                </div>
            `;
            casesList.appendChild(caseItem);
        });
    } catch (error) {
        console.error('Failed to load projects:', error);
        casesList.innerHTML = `
            <div class="error-message">
                <p>加载项目列表失败，请稍后重试。</p>
            </div>
        `;
    }
}

// 切换项目卡片状态
function toggleCase(projectId) {
    const caseItem = document.querySelector(`[onclick="toggleCase('${projectId}')"]`).parentElement;
    caseItem.classList.toggle('open');
    
    const detail = document.getElementById(`detail-${projectId}`);
    if (caseItem.classList.contains('open')) {
        detail.style.maxHeight = '500px';
    } else {
        detail.style.maxHeight = '0';
    }
}

// 打开项目详情页
function openProject(projectId) {
    window.location.href = `/project.html?id=${projectId}`;
}

// 切换移动端菜单
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    mobileMenu.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
}

// 关闭移动端菜单
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
}

// 滚动到顶部
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 滚动到指定区域
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 设置滚动动画
function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// 设置导航高亮
function setupNavHighlight() {
    window.addEventListener('scroll', () => {
        const sections = ['hero', 'cases', 'about', 'contact'];
        let currentSection = '';

        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = section;
                }
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}