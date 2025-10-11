// Основная интерактивность сайта сантехника

document.addEventListener('DOMContentLoaded', function() {
    console.log('[script] DOMContentLoaded — script.js loaded');

    // Helper: adjust CSS var for fixed header height so body content isn't hidden
    function adjustHeaderHeight() {
        const siteTop = document.querySelector('.site-top');
        if (siteTop) {
            const h = siteTop.getBoundingClientRect().height;
            document.documentElement.style.setProperty('--site-top-height', h + 'px');
        } else {
            document.documentElement.style.setProperty('--site-top-height', '0px');
        }
    }
    adjustHeaderHeight();
    window.addEventListener('resize', adjustHeaderHeight);

    // Sticky header: add small shadow class when scrolled
    const siteTopEl = document.querySelector('.site-top');
    function onScroll() {
        if (!siteTopEl) return;
        if (window.scrollY > 8) {
            siteTopEl.classList.add('scrolled');
        } else {
            siteTopEl.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();

    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const headerNav = document.querySelector('.header-nav');
    if (mobileBtn && headerNav) {
        mobileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            headerNav.classList.toggle('open');
        });
        // close when clicking outside
        document.addEventListener('click', function(e) {
            if (!headerNav.contains(e.target) && !mobileBtn.contains(e.target)) {
                headerNav.classList.remove('open');
            }
        });
        // close when clicking a nav link
        headerNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => headerNav.classList.remove('open')));
    }

    // Плавная прокрутка по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                // if header exists, account for its height with scrollBy after smooth scroll
                const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--site-top-height')) || 0;
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // small adjustment for fixed header: scroll a little up after a delay
                if (headerOffset) {
                    setTimeout(() => {
                        window.scrollBy({ top: -headerOffset + 8, left: 0, behavior: 'smooth' });
                    }, 320);
                }
            }
        });
    });

    // Валидация формы и уведомление
    const form = document.querySelector('.contact-form-section form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let valid = true;
            form.querySelectorAll('input, textarea').forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    valid = false;
                } else {
                    field.classList.remove('error');
                }
            });
            if (valid) {
                showPopup('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                form.reset();
            }
        });
    }

    // Анимация появления секций при прокрутке
    let animatedSections = document.querySelectorAll('.welcome, .advantages, .services, .steps, .gallery, .reviews, .contacts, .contact-form-section');
    console.log('[script] animatedSections count (initial selector):', animatedSections.length);
    if (animatedSections.length === 0) {
        // fallback — наблюдаем за всеми секциями на странице
        animatedSections = document.querySelectorAll('section');
        console.log('[script] fallback: using all <section> elements, count:', animatedSections.length);
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('[script] intersecting:', entry.target.className || entry.target.tagName);
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    animatedSections.forEach(section => observer.observe(section));
});

// Всплывающее уведомление
function showPopup(message) {
    let popup = document.createElement('div');
    popup.className = 'popup-message';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.classList.add('show');
    }, 100);
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 400);
    }, 3000);
}
