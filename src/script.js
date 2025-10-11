// Основная интерактивность сайта сантехника

document.addEventListener('DOMContentLoaded', function() {
    console.log('[script] DOMContentLoaded — script.js loaded');

    // Sticky header: add small shadow class when scrolled (header now scrolls with page)
    const siteTopEl = document.querySelector('.site-top');

    // For FAB show/hide on scroll
    const fabEl = document.querySelector('.fab-whatsapp');
    let lastScrollY = window.scrollY || 0;
    function onScroll() {
        if (siteTopEl) {
            if (window.scrollY > 8) siteTopEl.classList.add('scrolled'); else siteTopEl.classList.remove('scrolled');
        }

        // FAB show/hide based on scroll direction
        if (fabEl) {
            const current = window.scrollY || 0;
            if (current > lastScrollY + 8) {
                // scrolled down -> hide
                fabEl.style.transform = 'translateY(20px) scale(0.95)';
                fabEl.style.opacity = '0';
                fabEl.style.pointerEvents = 'none';
            } else if (current < lastScrollY - 8) {
                // scrolled up -> show
                fabEl.style.transform = '';
                fabEl.style.opacity = '1';
                fabEl.style.pointerEvents = '';
            }
            lastScrollY = current;
        }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();

    // Mobile menu toggle (accessible)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const headerNav = document.querySelector('.header-nav');
    if (mobileBtn && headerNav) {
        function openMenu() {
            headerNav.classList.add('open');
            mobileBtn.setAttribute('aria-expanded', 'true');
            const firstLink = headerNav.querySelector('a');
            if (firstLink) firstLink.focus();
        }
        function closeMenu() {
            headerNav.classList.remove('open');
            mobileBtn.setAttribute('aria-expanded', 'false');
            mobileBtn.focus();
        }

        mobileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const willOpen = !headerNav.classList.contains('open');
            if (willOpen) openMenu(); else closeMenu();
        });

        // keyboard support: Enter / Space toggles, Escape closes
        mobileBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileBtn.click();
            }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && headerNav.classList.contains('open')) {
                closeMenu();
            }
        });

        // close when clicking outside
        document.addEventListener('click', function(e) {
            if (!headerNav.contains(e.target) && !mobileBtn.contains(e.target)) {
                if (headerNav.classList.contains('open')) closeMenu();
            }
        });
        // close when clicking a nav link
        headerNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
    }

    // Плавная прокрутка по якорям (без смещения — хедер теперь нефиксированный)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    // Scrollspy: highlight header nav link for the section in view
    (function initScrollSpy(){
        const navLinks = Array.from(document.querySelectorAll('.header-nav a'));
        const sectionIds = navLinks.map(a => a.getAttribute('href')).filter(h => h && h.startsWith('#')).map(h => h.replace('#',''));
        const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
        if (sections.length === 0) return;

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.target.id) return;
                const id = entry.target.id;
                const link = document.querySelector('.header-nav a[href="#' + id + '"]');
                if (entry.isIntersecting) {
                    // remove active from others
                    navLinks.forEach(l => l.classList.remove('active'));
                    if (link) link.classList.add('active');
                }
            });
        }, { threshold: 0.55 });

        sections.forEach(s => spyObserver.observe(s));
    })();

    // --- Gallery modal viewer ---
    const galleryImgs = Array.from(document.querySelectorAll('.gallery-images img'));
    if (galleryImgs.length > 0) {
        let currentIndex = 0;
        let overlayEl = null;

        function openImage(index) {
            currentIndex = index;
            const src = galleryImgs[currentIndex].src;
            const alt = galleryImgs[currentIndex].alt || '';

            overlayEl = document.createElement('div');
            overlayEl.className = 'img-modal-overlay';
            overlayEl.innerHTML = `
                <div class="img-modal" role="dialog" aria-modal="true" aria-label="Превью изображения">
                    <button class="close-btn" aria-label="Закрыть">✕</button>
                    <img src="${src}" alt="${alt}">
                </div>
            `;
            document.body.appendChild(overlayEl);
            document.body.style.overflow = 'hidden';

            const closeBtn = overlayEl.querySelector('.close-btn');
            closeBtn.focus();

            // click outside to close
            overlayEl.addEventListener('click', function(e) {
                if (e.target === overlayEl) closeModal();
            });

            closeBtn.addEventListener('click', closeModal);

            // keyboard navigation inside modal
            function modalKey(e) {
                if (!overlayEl) return;
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            }
            document.addEventListener('keydown', modalKey);

            // store reference so we can remove listener on close
            overlayEl._modalKey = modalKey;
        }

        function closeModal() {
            if (!overlayEl) return;
            document.body.style.overflow = '';
            document.removeEventListener('keydown', overlayEl._modalKey);
            overlayEl.remove();
            overlayEl = null;
            // return focus to the thumbnail
            const thumb = galleryImgs[currentIndex];
            if (thumb) thumb.focus();
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % galleryImgs.length;
            if (overlayEl) overlayEl.querySelector('img').src = galleryImgs[currentIndex].src;
        }
        function prevImage() {
            currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
            if (overlayEl) overlayEl.querySelector('img').src = galleryImgs[currentIndex].src;
        }

        galleryImgs.forEach((img, idx) => {
            img.setAttribute('tabindex', '0');
            img.addEventListener('click', () => openImage(idx));
            img.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openImage(idx);
                }
            });
        });
    }
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
