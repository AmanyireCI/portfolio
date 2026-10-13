// ========================================
// NAVIGATION
// ========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========================================
// THEME TOGGLE (follows the device until the visitor picks one)
// ========================================
const themeToggle = document.getElementById('themeToggle');
const deviceLightQuery = window.matchMedia('(prefers-color-scheme: light)');

function savedTheme() {
    try {
        return localStorage.getItem('theme');
    } catch (e) {
        return null;
    }
}

function applyTheme(theme) {
    const isLight = theme === 'light';
    if (isLight) {
        document.documentElement.dataset.theme = 'light';
    } else {
        delete document.documentElement.dataset.theme;
    }
    const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    themeToggle.innerHTML = `<i class="fas ${isLight ? 'fa-moon' : 'fa-sun'}"></i>`;
    themeToggle.setAttribute('aria-label', label);
    themeToggle.title = label;
}

applyTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try {
        localStorage.setItem('theme', next);
    } catch (e) {}
});

// If the visitor hasn't picked a theme, switch along with the device.
deviceLightQuery.addEventListener('change', (e) => {
    if (!savedTheme()) applyTheme(e.matches ? 'light' : 'dark');
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========================================
// CONTACT FORM
// ========================================
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks for reaching out! I\'ll get back to you soon.');
    contactForm.reset();
});

// ========================================
// PROJECTS
// ========================================
// Every public repo on GitHub is shown automatically.
// Use projectDetails to give a repo a nicer title, description, tech list,
// icon, demo link or "featured" badge. Use hiddenRepos to leave a repo out.
const GITHUB_USER = 'AmanyireCI';

const hiddenRepos = ['portfolio'];

const projectDetails = {
    'final-hotel-website': {
        title: 'Hotel Booking Website',
        description: 'Full-stack platform with authentication, room management, payment integration, and real-time availability.',
        tech: ['HTML', 'SCSS', 'JavaScript', 'Bootstrap', 'jQuery'],
        icon: 'fa-hotel',
        category: 'Web',
        featured: true
    },
    'deployed-model': {
        title: 'EEG Mental Stress Detection',
        description: 'Deep learning model that detects mental stress from EEG recordings, trained with PyTorch and evaluated on accuracy, precision, recall, and F1-score.',
        tech: ['Python', 'PyTorch', 'MNE', 'Scikit-learn', 'NumPy'],
        icon: 'fa-brain',
        category: 'Machine Learning',
        featured: true
    },
    'hi-res-digital-mapping': {
        title: 'Hi-Res Digital Mapping',
        icon: 'fa-map-location-dot',
        category: 'Web'
    }
};

// Projects that are not GitHub repos (or are private). They are always shown.
const extraProjects = [
    {
        title: 'E-Commerce Platform',
        description: 'Full-featured platform with product management, shopping cart, orders, and admin dashboard.',
        tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
        icon: 'fa-shopping-cart',
        category: 'Web'
    },
    {
        title: 'Data Dashboard',
        description: 'Interactive visualization dashboard with real-time updates, customizable widgets, and filtering.',
        tech: ['Vue.js', 'D3.js', 'Express', 'MongoDB'],
        icon: 'fa-chart-line',
        category: 'Analytics'
    }
];

const projectsGrid = document.getElementById('projectsGrid');
const projectFilters = document.getElementById('projectFilters');

function prettifyRepoName(name) {
    return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function repoToProject(repo) {
    const details = projectDetails[repo.name] || {};
    const isNew = Date.now() - new Date(repo.created_at).getTime() < 1000 * 60 * 60 * 24 * 90;
    return {
        title: details.title || prettifyRepoName(repo.name),
        description: details.description || repo.description || 'No description yet.',
        tech: details.tech || (repo.topics && repo.topics.length ? repo.topics : [repo.language].filter(Boolean)),
        icon: details.icon || 'fa-code',
        category: details.category || repo.language || 'Other',
        featured: details.featured || false,
        isNew,
        code: repo.html_url,
        demo: details.demo || repo.homepage || (repo.has_pages ? `https://${GITHUB_USER.toLowerCase()}.github.io/${repo.name}/` : null),
        updated: repo.pushed_at
    };
}

function projectCard(project) {
    const tags = [];
    if (project.featured) tags.push('<span class="project-tag featured">Featured</span>');
    if (project.isNew) tags.push('<span class="project-tag new">New</span>');
    tags.push(`<span class="project-tag">${escapeHtml(project.category)}</span>`);

    const links = [];
    if (project.code) links.push(`<a href="${project.code}" target="_blank"><i class="fab fa-github"></i> Code</a>`);
    if (project.demo) links.push(`<a href="${project.demo}" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>`);

    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = project.category;
    card.innerHTML = `
        <div class="project-image">
            <i class="fas ${project.icon}"></i>
        </div>
        <div class="project-body">
            <div class="project-meta">${tags.join('')}</div>
            <h3 class="project-title">${escapeHtml(project.title)}</h3>
            <p class="project-description">${escapeHtml(project.description)}</p>
            <div class="project-tech">${project.tech.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
            <div class="project-links">${links.join('')}</div>
        </div>`;
    return card;
}

function renderFilters(projects) {
    const categories = [...new Set(projects.map(p => p.category))].sort();
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = category;
        btn.textContent = category;
        projectFilters.appendChild(btn);
    });

    projectFilters.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        projectFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        projectsGrid.querySelectorAll('.project-card').forEach(card => {
            const show = btn.dataset.filter === 'all' || card.dataset.category === btn.dataset.filter;
            card.style.display = show ? '' : 'none';
        });
    });
}

function renderProjects(projects) {
    projects.sort((a, b) =>
        (b.featured - a.featured) || ((b.updated || '').localeCompare(a.updated || ''))
    );
    projectsGrid.innerHTML = '';
    projects.forEach(project => {
        const card = projectCard(project);
        projectsGrid.appendChild(card);
        animateOnScroll(card);
    });
    renderFilters(projects);
}

async function loadProjects() {
    let repoProjects = [];
    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`);
        if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
        const repos = await res.json();
        repoProjects = repos
            .filter(repo => !repo.fork && !hiddenRepos.includes(repo.name))
            .map(repoToProject);
    } catch (err) {
        // GitHub unreachable or rate limited: fall back to the repos listed above.
        console.warn('Could not load repos from GitHub:', err);
        repoProjects = Object.entries(projectDetails).map(([name, details]) => ({
            description: '',
            tech: [],
            icon: 'fa-code',
            category: 'Other',
            featured: false,
            ...details,
            title: details.title || prettifyRepoName(name),
            code: `https://github.com/${GITHUB_USER}/${name}`
        }));
    }
    renderProjects([...repoProjects, ...extraProjects]);
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

function animateOnScroll(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
}

document.querySelectorAll('.skill-category, .highlight-card, .contact-card').forEach(animateOnScroll);

loadProjects();