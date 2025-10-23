// Интерактивность для сайта сантехника

document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен');

    // Плавная прокрутка по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Кнопка "Развернуть" в Hero секции
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function() {
            document.querySelector('.services-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Модальное окно для формы обратной связи
    const modal = document.getElementById('contactModal');
    const btnPrimary = document.querySelectorAll('.hero-buttons .btn-primary');
    const closeBtn = document.querySelector('.modal-close');

    btnPrimary.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Обработка отправки формы в модальном окне
    const modalForm = document.getElementById('modalContactForm');
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = this.querySelector('input[name="name"]').value;
            const phone = this.querySelector('input[name="phone"]').value;
            const message = this.querySelector('textarea[name="message"]').value;

            if (name && phone && message) {
                alert('✅ Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
                this.reset();
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else {
                alert('⚠️ Пожалуйста, заполните все обязательные поля.');
            }
        });
    }

    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками услуг
    document.querySelectorAll('.service-card, .gallery-item, .about-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Валидация формы на странице
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = this.querySelector('input[type="text"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const description = this.querySelector('textarea').value;

            if (name && phone && description) {
                alert('✅ Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
                this.reset();
            } else {
                alert('⚠️ Пожалуйста, заполните все обязательные поля.');
            }
        });
    }

    // Эффект параллакса для hero секции
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });

    // Подсветка активного пункта меню при скролле
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Модальное окно для галереи
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const galleryModal = document.createElement('div');
            galleryModal.className = 'modal-gallery';
            galleryModal.innerHTML = `
                <div class="modal-gallery-content">
                    <span class="close-gallery">&times;</span>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;
            document.body.appendChild(galleryModal);
            document.body.style.overflow = 'hidden';

            // Стили для модального окна галереи
            galleryModal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s;
            `;

            const modalContent = galleryModal.querySelector('.modal-gallery-content');
            modalContent.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
            `;

            const modalImg = galleryModal.querySelector('img');
            modalImg.style.cssText = `
                max-width: 100%;
                max-height: 90vh;
                border-radius: 10px;
                box-shadow: 0 10px 50px rgba(0,0,0,0.5);
            `;

            const closeBtn = galleryModal.querySelector('.close-gallery');
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                color: white;
                font-size: 40px;
                cursor: pointer;
                font-weight: bold;
                transition: color 0.3s;
            `;

            closeBtn.addEventListener('mouseover', function() {
                this.style.color = '#2c5aa0';
            });

            closeBtn.addEventListener('mouseout', function() {
                this.style.color = 'white';
            });

            // Закрытие модального окна галереи
            function closeGalleryModal() {
                galleryModal.style.animation = 'fadeOut 0.3s';
                setTimeout(() => {
                    galleryModal.remove();
                    document.body.style.overflow = 'auto';
                }, 300);
            }

            closeBtn.addEventListener('click', closeGalleryModal);
            galleryModal.addEventListener('click', function(e) {
                if (e.target === galleryModal) {
                    closeGalleryModal();
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeGalleryModal();
                }
            });
        });
    });

    // Добавляем CSS анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .nav-menu a.active {
            color: #2c5aa0;
        }
        .nav-menu a.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);

    // Онлайн чат виджет
    const chatButton = document.getElementById('chatButton');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    const quickReplies = document.querySelectorAll('.quick-reply');
    const chatBadge = document.querySelector('.chat-badge');

    // Открытие/закрытие чата
    chatButton.addEventListener('click', function() {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
            chatBadge.style.display = 'none';
        }
    });

    chatClose.addEventListener('click', function() {
        chatWindow.classList.remove('active');
    });

    // Функция добавления сообщения
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;

        const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            ${!isUser ? `
                <div class="message-avatar">
                    <img src="https://cdn-icons-png.flaticon.com/512/2933/2933811.png" alt="Bot">
                </div>
            ` : ''}
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
            ${isUser ? `
                <div class="message-avatar">
                    <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="User">
                </div>
            ` : ''}
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Автоответы бота
    function getBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('цен') || lowerMessage.includes('стоимость') || lowerMessage.includes('сколько')) {
            return 'Наши цены зависят от типа работ:\n\n🔧 Установка смесителя - от 1500₽\n🚽 Установка унитаза - от 2500₽\n🛁 Установка ванны - от 4000₽\n⚡ Срочный вызов - от 1000₽\n\nХотите получить точную смету? Оставьте заявку!';
        } else if (lowerMessage.includes('вызвать') || lowerMessage.includes('заявк') || lowerMessage.includes('мастер')) {
            return 'Отлично! Для вызова мастера, пожалуйста, нажмите на кнопку "Оставить заявку" на сайте, или позвоните нам по телефону +6 666 666 666. Мы работаем 24/7! 🚀';
        } else if (lowerMessage.includes('срочн') || lowerMessage.includes('аварий') || lowerMessage.includes('протечк')) {
            return '⚡ Срочный выезд мастера - в течение 1 часа!\n\nЗвоните прямо сейчас: +6 666 666 666\n\nМы устраним любую протечку или аварию быстро и качественно!';
        } else if (lowerMessage.includes('привет') || lowerMessage.includes('здравств')) {
            return 'Здравствуйте! 👋 Рады помочь вам! Чем могу быть полезен?';
        } else if (lowerMessage.includes('спасибо') || lowerMessage.includes('благодар')) {
            return 'Всегда рады помочь! 😊 Если возникнут вопросы - пишите!';
        } else {
            return 'Спасибо за сообщение! Наш специалист свяжется с вами в ближайшее время. Или позвоните нам: +6 666 666 666 📞';
        }
    }

    // Отправка сообщения
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';

            // Эмуляция печатания бота
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, false);
            }, 1000);
        }
    }

    // Обработчики отправки
    chatSend.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Быстрые ответы
    quickReplies.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            addMessage(message, true);

            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, false);
            }, 1000);
        });
    });

    // Показать уведомление через 5 секунд после загрузки
    setTimeout(() => {
        if (!chatWindow.classList.contains('active')) {
            chatBadge.style.display = 'flex';
            chatButton.style.animation = 'pulse 2s infinite, bounce-badge 0.5s 3';
        }
    }, 5000);

    console.log('✅ Все функции загружены успешно!');
    console.log('💬 Онлайн чат активирован!');
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
