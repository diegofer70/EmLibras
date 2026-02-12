// Menu Mobile Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    });
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    }
});

// Accordion
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        const content = document.getElementById(header.getAttribute('aria-controls'));
        
        // Fechar todos os outros accordions
        accordionHeaders.forEach(otherHeader => {
            if (otherHeader !== header) {
                otherHeader.setAttribute('aria-expanded', 'false');
                const otherContent = document.getElementById(otherHeader.getAttribute('aria-controls'));
                if (otherContent) {
                    otherContent.classList.remove('active');
                }
            }
        });
        
        // Toggle do accordion atual
        header.setAttribute('aria-expanded', !isExpanded);
        if (content) {
            content.classList.toggle('active');
        }
    });
    
    // Suporte para teclado (Enter e Space)
    header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
        }
    });
});

// Scroll suave para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Validação do formulário
const contactForm = document.getElementById('contactForm');
const formFields = {
    nome: {
        input: document.getElementById('nome'),
        error: document.getElementById('nome-error'),
        validate: (value) => {
            if (!value.trim()) {
                return 'Nome completo é obrigatório';
            }
            if (value.trim().length < 3) {
                return 'Nome deve ter pelo menos 3 caracteres';
            }
            return '';
        }
    },
    email: {
        input: document.getElementById('email'),
        error: document.getElementById('email-error'),
        validate: (value) => {
            if (!value.trim()) {
                return 'E-mail é obrigatório';
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'E-mail inválido';
            }
            return '';
        }
    },
    telefone: {
        input: document.getElementById('telefone'),
        error: document.getElementById('telefone-error'),
        validate: (value) => {
            if (value.trim()) {
                const phoneRegex = /^[\d\s\(\)\-\+]+$/;
                if (!phoneRegex.test(value)) {
                    return 'Telefone inválido';
                }
            }
            return '';
        }
    },
    servico: {
        input: document.getElementById('servico'),
        error: document.getElementById('servico-error'),
        validate: (value) => {
            // Serviço é opcional, então sempre retorna vazio
            return '';
        }
    },
    mensagem: {
        input: document.getElementById('mensagem'),
        error: document.getElementById('mensagem-error'),
        validate: (value) => {
            if (!value.trim()) {
                return 'Mensagem é obrigatória';
            }
            if (value.trim().length < 10) {
                return 'Mensagem deve ter pelo menos 10 caracteres';
            }
            return '';
        }
    }
};

// Validação em tempo real
Object.keys(formFields).forEach(fieldName => {
    const field = formFields[fieldName];
    if (field.input) {
        field.input.addEventListener('blur', () => {
            validateField(fieldName);
        });
        
        field.input.addEventListener('input', () => {
            // Limpar erro quando o usuário começar a digitar
            if (field.error) {
                field.error.textContent = '';
            }
        });
    }
});

function validateField(fieldName) {
    const field = formFields[fieldName];
    if (!field || !field.input) return true;
    
    const value = field.input.value;
    const error = field.validate(value);
    
    if (field.error) {
        field.error.textContent = error;
    }
    
    if (error) {
        field.input.setAttribute('aria-invalid', 'true');
        return false;
    } else {
        field.input.setAttribute('aria-invalid', 'false');
        return true;
    }
}

// Validação do formulário completo
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    Object.keys(formFields).forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Simular envio do formulário
        const submitButton = contactForm.querySelector('.btn-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        // Simular delay de envio
        setTimeout(() => {
            alert('Solicitação enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Limpar todos os erros
            Object.keys(formFields).forEach(fieldName => {
                const field = formFields[fieldName];
                if (field.error) {
                    field.error.textContent = '';
                }
                if (field.input) {
                    field.input.setAttribute('aria-invalid', 'false');
                }
            });
        }, 1500);
    } else {
        // Focar no primeiro campo com erro
        const firstErrorField = Object.keys(formFields).find(fieldName => {
            const field = formFields[fieldName];
            return field.error && field.error.textContent;
        });
        
        if (firstErrorField && formFields[firstErrorField].input) {
            formFields[firstErrorField].input.focus();
        }
    }
});

// Máscara para telefone
const telefoneInput = document.getElementById('telefone');
if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
        }
        e.target.value = value;
    });
}

// Header fixo com sombra ao fazer scroll
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Animação de entrada para elementos ao fazer scroll
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

// Observar cards de serviços e diferenciais
document.querySelectorAll('.service-card, .diferencial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Botão "Voltar ao topo" - mostrar/ocultar
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Inicializar como oculto
    backToTop.style.opacity = '0';
    backToTop.style.visibility = 'hidden';
    backToTop.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
}

// Prevenir envio de formulário com Enter em campos de texto (exceto textarea)
document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Focar no próximo campo
            const form = input.closest('form');
            const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
            const currentIndex = inputs.indexOf(input);
            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
            }
        }
    });
});

// Melhorias de acessibilidade - anunciar mudanças dinâmicas
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Adicionar classe sr-only ao CSS via JavaScript se não existir
if (!document.querySelector('style[data-sr-only]')) {
    const style = document.createElement('style');
    style.setAttribute('data-sr-only', 'true');
    style.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
    `;
    document.head.appendChild(style);
}

// Suporte para preferência de movimento reduzido
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition', 'none');
}

