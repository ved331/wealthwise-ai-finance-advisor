// main.js - Core functionality

document.addEventListener('DOMContentLoaded', () => {
    // Always hide any inline loader first
    window.hideLoader();
    loadComponents();
});

async function loadComponents() {
    const components = [
        { id: 'navbar-placeholder', path: 'components/navbar.html' },
        { id: 'footer-placeholder', path: 'components/footer.html' },
        { id: 'sidebar-placeholder', path: 'components/sidebar.html' },
        { id: 'loader-placeholder', path: 'components/loader.html' }
    ];

    const loadPromises = components.map(async (comp) => {
        const el = document.getElementById(comp.id);
        if (!el) return;
        try {
            const response = await fetch(comp.path);
            if (response.ok) {
                const html = await response.text();
                el.innerHTML = html;
                if (comp.id === 'navbar-placeholder') initNavbar();
                if (comp.id === 'sidebar-placeholder') initSidebar();
            }
        } catch (error) {
            console.warn(`Component ${comp.path} could not be loaded:`, error.message);
        }
    });

    // Load all components in parallel
    await Promise.allSettled(loadPromises);

    // Always hide loader after components attempt to load
    window.hideLoader();
}

function initNavbar() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

function initSidebar() {
    // Sidebar toggle logic
}

// Global Loader Functions
window.showLoader = () => {
    const loader = document.querySelector('.loader-container');
    if (loader) {
        loader.classList.remove('hidden');
        loader.style.display = 'flex';
    }
};

window.hideLoader = () => {
    // Hide any inline loader-placeholder divs immediately
    const placeholders = ['loader-placeholder', 'global-app-loader'];
    placeholders.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            el.classList.add('hidden');
        }
    });
    // Also handle dynamically injected .loader-container
    document.querySelectorAll('.loader-container').forEach(loader => {
        loader.classList.add('hidden');
        loader.style.display = 'none';
    });
};

// Guaranteed fallback — loader ALWAYS hides after 800ms no matter what
window.addEventListener('load', () => {
    setTimeout(() => {
        window.hideLoader();
    }, 800);
});

