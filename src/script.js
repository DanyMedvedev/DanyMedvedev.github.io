// Основная интерактивность сайта сантехника

document.addEventListener('DOMContentLoaded', function() {
    console.log('[script] DOMContentLoaded — script.js loaded');
    // Плавная прокрутка по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
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
