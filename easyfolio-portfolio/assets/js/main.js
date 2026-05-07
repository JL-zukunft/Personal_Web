// 导入内容服务模块
import { contentService } from './contentService.js';

/**
 * 页面加载完成后执行初始化操作
 */
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();      // 加载项目列表
    setupScrollAnimation();  // 设置滚动动画
    setupNavHighlight(); // 设置导航高亮
});

/**
 * 加载项目列表并渲染到页面
 */
async function loadProjects() {
    // 获取项目列表容器元素
    const casesList = document.getElementById('casesList');
    
    // 如果容器不存在，直接返回
    if (!casesList) {
        return;
    }
    
    try {
        // 从 contentService 获取项目列表
        const projects = await contentService.getProjectList();
        
        // 遍历每个项目，创建对应的 DOM 元素
        projects.forEach(project => {
            const caseItem = document.createElement('div');
            caseItem.className = 'case-item';
            // 设置项目卡片的 HTML 结构
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
            // 将项目卡片添加到容器中
            casesList.appendChild(caseItem);
        });
    } catch (error) {
        // 如果加载失败，显示错误提示
        console.error('Failed to load projects:', error);
        casesList.innerHTML = `
            <div class="error-message">
                <p>加载项目列表失败，请稍后重试。</p>
            </div>
        `;
    }
}

/**
 * 切换项目卡片的展开/收起状态
 * @param {string} projectId - 项目 ID
 */
function toggleCase(projectId) {
    // 找到对应的项目卡片元素
    const caseItem = document.querySelector(`[onclick="toggleCase('${projectId}')"]`).parentElement;
    // 切换 open 类
    caseItem.classList.toggle('open');
    
    // 找到详情区域
    const detail = document.getElementById(`detail-${projectId}`);
    // 根据状态设置最大高度（实现展开/收起动画）
    if (caseItem.classList.contains('open')) {
        detail.style.maxHeight = '500px';
    } else {
        detail.style.maxHeight = '0';
    }
}

/**
 * 跳转到项目详情页
 * @param {string} projectId - 项目 ID
 */
function openProject(projectId) {
    // 跳转到项目详情页，携带项目 ID 参数
    window.location.href = `/project.html?id=${projectId}`;
}

/**
 * 切换移动端菜单显示/隐藏
 */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    mobileMenu.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
}

/**
 * 关闭移动端菜单
 */
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
}

/**
 * 滚动到页面顶部
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 滚动到指定区域
 * @param {string} sectionId - 区域 ID
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * 设置滚动动画效果
 * 当元素进入视口时添加 visible 类
 */
function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // 观察所有带有 reveal 类的元素
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

/**
 * 设置导航高亮
 * 根据当前滚动位置高亮对应的导航链接
 */
function setupNavHighlight() {
    window.addEventListener('scroll', () => {
        const sections = ['hero', 'cases', 'about', 'contact'];
        let currentSection = '';

        // 遍历所有区域，判断哪个区域在视口中
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = section;
                }
            }
        });

        // 更新导航链接的高亮状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}