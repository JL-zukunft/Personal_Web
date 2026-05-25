// 项目文件列表（自动生成）
const projectFiles = [
    "2026-03-02-data-analytics.md",
    "2026-06-01-ai-assistant.md",
    "2026-08-04-smart-home.md",
    "2026-11-03-smart-customer.md",
    "2026-12-99-test-project.md",
    "2026-12-99-test-project 2.md",
    "2026-12-99-test-project3.md",
    "2026-12-99-test-project 4.md",
    "2026-12-99-test-project 5.md",
    "2026-12-99-test-project 6.md"
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

let currentProjectIndex = 0;
let projectsData = [];

// 加载项目索引和内容
async function loadProjects() {
    const casesIndex = document.getElementById('casesIndex');
    const casesContent = document.querySelector('.cases-main-content');
    
    if (!casesIndex || !casesContent) {
        return;
    }
    
    try {
        projectsData = await contentService.getProjectList();
        
        // 生成左侧索引
        casesIndex.innerHTML = projectsData.map((project, index) => `
            <div class="cases-index-item ${index === 0 ? 'active' : ''}" 
                 onclick="switchProject(${index})"
                 data-index="${index}">
                <span class="cases-index-number">${String(index + 1).padStart(2, '0')}</span>
                <span class="cases-index-title">${project.title || '未命名项目'}</span>
            </div>
        `).join('');
        
        // 加载第一个项目详情
        if (projectsData.length > 0) {
            loadProjectDetail(0);
        }
        
        // 添加索引按钮点击事件
        setupIndexButtons();
    } catch (error) {
        console.error('Failed to load projects:', error);
        casesIndex.innerHTML = `
            <div class="error-message">
                <p>加载项目列表失败，请稍后重试。</p>
            </div>
        `;
    }
}

// 切换项目
function switchProject(index) {
    if (index === currentProjectIndex || !projectsData[index]) return;
    
    // 更新索引高亮
    const indexItems = document.querySelectorAll('.cases-index-item');
    indexItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // 更新当前项目索引
    currentProjectIndex = index;
    
    // 加载项目详情
    loadProjectDetail(index);
    
    // 触发动画
    animateContentTransition();
}

// 加载项目详情
function loadProjectDetail(index) {
    const project = projectsData[index];
    const casesContent = document.querySelector('.cases-main-content');
    
    if (!project || !casesContent) return;
    
    // 更新右侧标题区
    const projectTitle = document.getElementById('casesProjectTitle');
    const projectIndexLabel = document.getElementById('casesProjectIndexLabel');
    const previewNumber = document.getElementById('casesPreviewNumber');
    
    if (projectTitle) {
        projectTitle.textContent = project.title || '未命名项目';
    }
    
    if (projectIndexLabel) {
        projectIndexLabel.textContent = `${String(index + 1).padStart(2, '0')} / ${String(projectsData.length).padStart(2, '0')}`;
    }
    
    if (previewNumber) {
        previewNumber.textContent = String(index + 1).padStart(2, '0');
    }

    // 更新Minimap标题
    const minimapTitle = document.getElementById('casesMinimapTitle');
    if (minimapTitle) {
        minimapTitle.textContent = project.title || '项目导航';
    }

    // 更新Minimap节点
    const minimapGrid = document.getElementById('casesMinimapGrid');
    if (minimapGrid) {
        const minimapNodes = project.minimap || [
            { icon: "📋", label: "项目背景" },
            { icon: "🎯", label: "设计目标" },
            { icon: "💡", label: "设计亮点" },
            { icon: "⚙️", label: "技术栈" },
            { icon: "👤", label: "我的角色" },
            { icon: "🚀", label: "项目成果" }
        ];
        
        minimapGrid.innerHTML = minimapNodes.map((node, idx) => `
            <div class="cases-minimap-node">
                <span class="cases-minimap-node-icon">${node.icon}</span>
                <span class="cases-minimap-node-label">${node.label}</span>
            </div>
        `).join('');
    }

    // 更新项目标签
    const projectTags = document.getElementById('casesProjectTags');
    if (projectTags) {
        if (project.tags && project.tags.length > 0) {
            projectTags.innerHTML = project.tags.map(tag => `
                <span class="cases-project-tag">${tag}</span>
            `).join('');
        } else {
            projectTags.innerHTML = '';
        }
    }
    
    // 更新背景序号水印
    setTimeout(() => {
        const sectionBlock = document.querySelector('.cases-section-block');
        if (sectionBlock) {
            const number = String(index + 1).padStart(2, '0');
            sectionBlock.style.setProperty('--section-number', `"${number}"`);
        }
    }, 10);
    
    casesContent.innerHTML = `
        <div class="cases-detail-card">
            <div class="cases-detail-grid">
                <!-- 左栏：叙述内容 -->
                <div class="cases-narrative">
                    <div class="cases-section-block">
                        <h3 class="cases-section-label">项目背景</h3>
                        <p class="cases-section-text">${project.description || '暂无描述'}</p>
                    </div>
                    
                    ${project.outcomes && project.outcomes.length > 0 ? `
                        <div class="cases-section-block">
                            <h3 class="cases-section-label">项目成果</h3>
                            <div class="cases-outcomes">
                                ${project.outcomes.map(outcome => `
                                    <div class="cases-outcome-item">
                                        <svg class="cases-outcome-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                                            <path d="M22 4L12 14.01l-3-3"/>
                                        </svg>
                                        <div class="cases-outcome-content">
                                            <h4>${outcome.title || '成果标题'}</h4>
                                            <p>${outcome.description || '成果描述'}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <!-- 右栏：元数据 -->
                <div class="cases-metadata">
                    <div class="cases-metadata-block">
                        <h3 class="cases-metadata-title">项目概况</h3>
                        <div class="cases-metadata-list">
                            <div class="cases-metadata-item">
                                <span class="cases-metadata-label">角色</span>
                                <span class="cases-metadata-value">${project.role || '待定'}</span>
                            </div>
                            <div class="cases-metadata-item">
                                <span class="cases-metadata-label">时间</span>
                                <span class="cases-metadata-value">${project.year || '待定'}</span>
                            </div>
                            ${project.timeline ? `
                                <div class="cases-metadata-item">
                                    <span class="cases-metadata-label">周期</span>
                                    <span class="cases-metadata-value">${project.timeline}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${project.links && project.links.length > 0 ? `
                        <div class="cases-metadata-block">
                            <h3 class="cases-metadata-title">外部资源</h3>
                            <div class="cases-resources">
                                ${project.links.map(link => `
                                    <a href="${link.url || '#'}" class="cases-resource-link" target="_blank" rel="noopener">
                                        <span>${link.title || '资源链接'}</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                                        </svg>
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// 内容切换动画
function animateContentTransition() {
    const casesContent = document.querySelector('.cases-content');
    if (!casesContent) return;
    
    casesContent.animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
    ], {
        duration: 500,
        easing: 'ease-out'
    });
}

// 设置索引按钮交互
function setupIndexButtons() {
    const indexButtons = document.querySelectorAll('.cases-index-item');
    
    indexButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active')) {
                btn.style.opacity = '0.7';
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('active')) {
                btn.style.opacity = '0.4';
            }
        });
    });
}

// 打开当前项目的详情页
function openCurrentProject() {
    const project = projectsData[currentProjectIndex];
    if (project && project.id) {
        openProject(project.id);
    }
}

// 切换项目卡片状态
function toggleCase(projectId) {
    const caseHeader = document.querySelector(`[onclick="toggleCase('${projectId}')"]`);
    const caseCard = caseHeader.closest('.case-card') || caseHeader.closest('.case-item');
    caseCard.classList.toggle('open');
}

// 打开项目详情页
// view 参数：'map' 跳转到地图视图，'article' 跳转到文章视图（默认）
function openProject(projectId, view = 'article') {
    const url = new URL('/project', window.location.origin);
    url.searchParams.set('id', projectId);
    if (view === 'map') {
        // 地图视图：不带 section 参数
    } else {
        // 文章视图：带 section 参数
        url.searchParams.set('section', 'background');
    }
    window.location.href = url.toString();
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

// 滚动到顶部（这个函数现在不会被使用，因为我们用自定义的导航函数）
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

// 打开项目详情页 - 地图视图（点击预览卡时触发）
function openProjectDetail() {
    const project = projectsData[currentProjectIndex];
    if (project && project.id) {
        openProject(project.id, 'map');
    }
}

// 打开项目详情页 - 文章视图（点击"查看详情"按钮时触发）
function openProjectDetailArticle() {
    const project = projectsData[currentProjectIndex];
    if (project && project.id) {
        openProject(project.id, 'article');
    }
}

// Map交互功能
class MapController {
    constructor() {
        this.container = document.getElementById('previewInteractive');
        this.canvas = document.querySelector('.preview-canvas');
        
        if (!this.container || !this.canvas) return;
        
        // 状态管理
        this.isDragging = false;
        this.isLongPress = false;
        this.isHovering = false;
        this.hasDragged = false; // 新增：记录是否发生过拖动
        this.longPressTimer = null;
        this.mouseDownTimer = null;
        
        // 位置和缩放
        this.startX = 0;
        this.startY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1;
        this.minScale = 0.8;
        this.maxScale = 2.0;
        
        // 时间戳
        this.lastClickTime = 0;
        this.lastTouchDistance = null;
        
        // 阈值
        this.LONG_PRESS_DURATION = 300; // 长按时间 300ms
        this.DRAG_THRESHOLD = 8; // 拖动阈值
        
        this.init();
    }
    
    init() {
        this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.container.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        this.container.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        this.container.addEventListener('click', this.handleClick.bind(this));
        this.container.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.container.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        
        // 触摸事件支持
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    }
    
    handleMouseEnter() {
        this.isHovering = true;
        this.container.style.cursor = 'grab';
    }
    
    handleMouseLeave() {
        this.isHovering = false;
        this.container.style.cursor = 'default';
        // 离开时重置状态
        clearTimeout(this.longPressTimer);
        if (this.isDragging) {
            this.container.classList.remove('dragging');
        }
        this.isDragging = false;
        this.isLongPress = false;
    }
    
    handleMouseDown(e) {
        this.startX = e.clientX - this.offsetX;
        this.startY = e.clientY - this.offsetY;
        this.hasDragged = false; // 重置拖动标志
        
        // 如果按住 Ctrl/Cmd 键，直接跳过长按检测
        if (e.ctrlKey || e.metaKey) {
            return;
        }
        
        // 开始长按检测（600ms）
        this.longPressTimer = setTimeout(() => {
            this.isLongPress = true;
            this.isDragging = true;
            this.container.classList.add('dragging');
            this.container.style.cursor = 'grabbing';
        }, this.LONG_PRESS_DURATION);
    }
    
    handleMouseMove(e) {
        if (!this.isDragging && !this.isLongPress) {
            // 如果移动超过阈值，取消长按
            const dx = Math.abs(e.clientX - this.startX);
            const dy = Math.abs(e.clientY - this.startY);
            if (dx > this.DRAG_THRESHOLD || dy > this.DRAG_THRESHOLD) {
                clearTimeout(this.longPressTimer);
            }
            return;
        }
        
        if (this.isDragging) {
            this.hasDragged = true; // 标记发生了拖动
            this.offsetX = e.clientX - this.startX;
            this.offsetY = e.clientY - this.startY;
            this.updateTransform();
        }
    }
    
    handleMouseUp() {
        clearTimeout(this.longPressTimer);
        
        if (this.isDragging) {
            this.container.classList.remove('dragging');
            this.container.style.cursor = 'grab';
        }
        
        this.isDragging = false;
        this.isLongPress = false;
    }
    
    handleWheel(e) {
        // 只有在容器上方且按住 Ctrl/Cmd 键时才进行缩放
        if (!this.isHovering) {
            return;
        }
        
        // 只有按住 Ctrl/Cmd 键时才进行缩放
        if (!e.ctrlKey && !e.metaKey) {
            // 不按快捷键，允许页面滚动
            return;
        }
        
        // 按住快捷键时，阻止页面滚动，进行缩放
        e.preventDefault();
        e.stopPropagation();
        
        const delta = e.deltaY > 0 ? -0.08 : 0.08;
        const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + delta));
        
        if (newScale !== this.scale) {
            this.scale = newScale;
            this.updateTransform();
        }
    }
    
    handleClick(e) {
        const now = Date.now();
        const timeSinceLastClick = now - this.lastClickTime;
        this.lastClickTime = now;
        
        // 如果发生过拖动，不触发点击跳转
        if (this.hasDragged) {
            this.hasDragged = false; // 重置标志
            return;
        }
        
        // 如果是长按后松开，不触发点击
        if (this.isLongPress || timeSinceLastClick < 200) {
            return;
        }
        
        // 触发点击跳转
        openProjectDetail();
    }
    
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            this.startX = e.touches[0].clientX - this.offsetX;
            this.startY = e.touches[0].clientY - this.offsetY;
            
            // 开始长按检测（600ms）
            this.longPressTimer = setTimeout(() => {
                this.isLongPress = true;
                this.isDragging = true;
                this.container.classList.add('dragging');
            }, this.LONG_PRESS_DURATION);
        }
    }
    
    handleTouchMove(e) {
        if (e.touches.length === 1) {
            // 检查是否超过拖动阈值
            if (!this.isDragging && !this.isLongPress) {
                const dx = Math.abs(e.touches[0].clientX - this.startX);
                const dy = Math.abs(e.touches[0].clientY - this.startY);
                if (dx > this.DRAG_THRESHOLD || dy > this.DRAG_THRESHOLD) {
                    clearTimeout(this.longPressTimer);
                }
            }
            
            if (this.isDragging) {
                this.offsetX = e.touches[0].clientX - this.startX;
                this.offsetY = e.touches[0].clientY - this.startY;
                this.updateTransform();
            }
        } else if (e.touches.length === 2) {
            // 双指缩放
            clearTimeout(this.longPressTimer);
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            if (this.lastTouchDistance) {
                const delta = currentDistance - this.lastTouchDistance;
                const scaleDelta = delta * 0.003;
                const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + scaleDelta));
                this.scale = newScale;
                this.updateTransform();
            }
            this.lastTouchDistance = currentDistance;
        }
    }
    
    handleTouchEnd() {
        clearTimeout(this.longPressTimer);
        this.lastTouchDistance = null;
        
        if (this.isDragging) {
            this.container.classList.remove('dragging');
        }
        
        this.isDragging = false;
        this.isLongPress = false;
    }
    
    updateTransform() {
        const transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
        this.canvas.style.transform = transform;
        this.canvas.style.transformOrigin = 'center center';
    }
    
    reset() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1;
        this.updateTransform();
    }
}

// 初始化Map控制器
let mapController = null;

function initMapController() {
    mapController = new MapController();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initMapController();
});

// 设置导航高亮
function setupNavHighlight() {
    window.addEventListener('scroll', () => {
        const sections = ['hero', 'cases', 'contact'];
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