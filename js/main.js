/**
 * AutoCare - Main JavaScript File
 * Written in ES6+ Vanilla JavaScript
 */

// ==========================================
// 0. Global CSS Loader Injector
// ==========================================
const initLoader = () => {
    // Inject the loader HTML directly into DOM before everything else renders
    const loaderHTML = `<div id="global-loader"><div class="spinner"></div></div>`;
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);

    // Fade out the loader once the full page, images, and fonts are loaded
    window.addEventListener('load', () => {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.classList.add('hidden-loader');
            // Remove from DOM after fade finishes
            setTimeout(() => loader.remove(), 600);
        }
    });
};
initLoader(); // Execute immediately

// ==========================================
// 1. Navbar & Mobile Menu Logic
// ==========================================
const initNavbar = () => {
    const navbar = document.querySelector('nav');
    if (!navbar) return;

    // Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg', 'bg-[#0f0f0f]/95');
            navbar.classList.remove('bg-[#0f0f0f]/90');
        } else {
            navbar.classList.add('bg-[#0f0f0f]/90');
            navbar.classList.remove('shadow-lg', 'bg-[#0f0f0f]/95');
        }
    });

    // Mobile Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
            mobileBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });
    }
};

// ==========================================
// 2. Smooth Scrolling
// ==========================================
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for sticky navbar
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ==========================================
// 3. Multi-Step Booking Form Logic
// ==========================================
let currentBookingStep = 1;
const totalBookingSteps = 4;

window.updateProgressBar = (step) => {
    const progressBar = document.getElementById('progressBar');
    const indicators = document.getElementById('stepIndicators')?.children;
    
    if (progressBar) {
        const percentage = ((step - 1) / (totalBookingSteps - 1)) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    if (indicators) {
        Array.from(indicators).forEach((indicator, index) => {
            if (index < step) {
                indicator.classList.replace('text-gray-500', 'text-yellow-400');
            } else {
                indicator.classList.replace('text-yellow-400', 'text-gray-500');
            }
        });
    }
};

window.showStep = (step) => {
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}`)?.classList.add('active');
    window.updateProgressBar(step);
};

window.validateStep = (step) => {
    const errorMsg = document.getElementById(`error-step${step}`);
    if (errorMsg) errorMsg.classList.add('hidden');
    
    let isValid = true;

    if (step === 1) {
        const service = document.getElementById('serviceType');
        if (!service?.value) {
            if (errorMsg) errorMsg.classList.remove('hidden');
            isValid = false;
        }
    } else if (step === 2) {
        const date = document.getElementById('serviceDate');
        const time = document.getElementById('serviceTime');
        
        [date, time].forEach(el => {
            if (el && !el.value) {
                el.style.borderColor = '#ef4444';
                isValid = false;
            } else if (el) {
                el.style.borderColor = '';
            }
        });
        
        if (!isValid && errorMsg) errorMsg.classList.remove('hidden');
    } else if (step === 3) {
        const fields = ['userName', 'userPhone', 'vehicleType', 'vehicleNumber'];
        
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.value.trim()) {
                el.style.borderColor = '#ef4444';
                isValid = false;
            } else if (el) {
                el.style.borderColor = '';
            }
        });

        if (!isValid && errorMsg) errorMsg.classList.remove('hidden');
    }
    return isValid;
};

window.nextStep = (step) => {
    if (window.validateStep(step)) {
        currentBookingStep = step + 1;
        window.showStep(currentBookingStep);
    }
};

window.prevStep = (step) => {
    currentBookingStep = step - 1;
    window.showStep(currentBookingStep);
};

window.submitBooking = () => {
    if (window.validateStep(3)) {
        // Generate a fake Booking ID
        const fakeId = `AC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        // Populate confirmation screen
        const nameEl = document.getElementById('confirmName');
        const serviceEl = document.getElementById('confirmService');
        const dateEl = document.getElementById('confirmDate');
        const timeEl = document.getElementById('confirmTime');
        const idDisplay = document.getElementById('bookingIdDisplay');
        
        if (nameEl) nameEl.textContent = document.getElementById('userName')?.value || '';
        if (serviceEl) serviceEl.textContent = document.getElementById('serviceType')?.value || '';
        if (timeEl) timeEl.textContent = document.getElementById('serviceTime')?.value || '';
        if (idDisplay) idDisplay.textContent = fakeId;
        
        // Robust Date Parsing
        const dateVal = document.getElementById('serviceDate')?.value || '';
        if (dateEl && dateVal) {
            let dateObj;
            if (dateVal.includes('-')) {
                const parts = dateVal.split('-');
                dateObj = parts[0].length === 4 
                    ? new Date(parts[0], parts[1] - 1, parts[2]) 
                    : new Date(parts[2], parts[1] - 1, parts[0]);
            } else {
                dateObj = new Date(dateVal);
            }
            if (isNaN(dateObj.getTime())) dateObj = new Date();
            
            dateEl.textContent = dateObj.toLocaleDateString('en-US', { 
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
            });
        }

        // Move to final Confirmation step
        currentBookingStep = 4;
        window.showStep(currentBookingStep);
    }
};

// ==========================================
// 4. Contact Form Validation
// ==========================================
window.handleContactSubmit = (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');
    
    const errName = document.getElementById('errorName');
    const errEmail = document.getElementById('errorEmail');
    const errMessage = document.getElementById('errorMessage');

    let isValid = true;

    // Validate Name
    if (name && !name.value.trim()) {
        name.style.borderColor = '#ef4444';
        if (errName) errName.classList.remove('hidden');
        isValid = false;
    } else if (name) {
        name.style.borderColor = '';
        if (errName) errName.classList.add('hidden');
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && (!email.value.trim() || !emailPattern.test(email.value.trim()))) {
        email.style.borderColor = '#ef4444';
        if (errEmail) errEmail.classList.remove('hidden');
        isValid = false;
    } else if (email) {
        email.style.borderColor = '';
        if (errEmail) errEmail.classList.add('hidden');
    }

    // Validate Message
    if (message && !message.value.trim()) {
        message.style.borderColor = '#ef4444';
        if (errMessage) errMessage.classList.remove('hidden');
        isValid = false;
    } else if (message) {
        message.style.borderColor = '';
        if (errMessage) errMessage.classList.add('hidden');
    }

    // Success State
    if (isValid) {
        const successState = document.getElementById('successState');
        if (successState) {
            successState.classList.remove('hidden');
            successState.style.animation = 'slideIn 0.4s ease forwards';
        }
    }
};

window.resetContactForm = () => {
    document.getElementById('contactForm')?.reset();
    document.getElementById('successState')?.classList.add('hidden');
    ['contactName', 'contactEmail', 'contactMessage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.borderColor = '';
    });
};

// ==========================================
// 5. Service Tracking Mock Logic
// ==========================================
window.trackService = () => {
    const input = document.getElementById('trackInput');
    const errorMsg = document.getElementById('trackError');
    const resultState = document.getElementById('resultState');
    const loadingState = document.getElementById('loadingState');
    
    if (!input || !input.value.trim()) {
        if (input) input.style.borderColor = '#ef4444';
        if (errorMsg) errorMsg.classList.remove('hidden');
        return;
    }

    input.style.borderColor = '';
    if (errorMsg) errorMsg.classList.add('hidden');
    
    if (resultState) resultState.classList.add('hidden');
    if (loadingState) loadingState.classList.remove('hidden');

    // Generate random status (1-3)
    const randomStatus = Math.floor(Math.random() * 3) + 1;
    
    setTimeout(() => {
        if (loadingState) loadingState.classList.add('hidden');
        
        const identifier = document.getElementById('resultIdentifier');
        if (identifier) identifier.textContent = `Tracking ID: ${input.value.trim().toUpperCase()}`;
        
        window.updateTrackerUI(randomStatus);
        if (resultState) resultState.classList.remove('hidden');
    }, 1500);
};

window.updateTrackerUI = (statusLevel) => {
    const dots = [document.getElementById('step1Dot'), document.getElementById('step2Dot'), document.getElementById('step3Dot')];
    const inners = [document.getElementById('step1Inner'), document.getElementById('step2Inner'), document.getElementById('step3Inner')];
    const titles = [document.getElementById('step1Title'), document.getElementById('step2Title'), document.getElementById('step3Title')];
    const line = document.getElementById('progressLine');
    const statusText = document.getElementById('resultStatusText');

    // Reset styles
    for (let i = 0; i < 3; i++) {
        if (dots[i]) dots[i].classList.replace('bg-yellow-400', 'bg-[#2a2a2a]');
        if (inners[i]) inners[i].className = 'w-4 h-4 rounded-full bg-transparent transition-colors duration-500';
        if (titles[i]) titles[i].className = 'font-bold mb-1 text-gray-400';
    }

    // Apply Active States
    for (let i = 0; i < statusLevel; i++) {
        if (dots[i]) dots[i].classList.replace('bg-[#2a2a2a]', 'bg-yellow-400');
        if (titles[i]) titles[i].className = 'font-bold mb-1 text-white';
        
        if (i === statusLevel - 1) {
            if (inners[i]) inners[i].classList.add('bg-[#1a1a1a]'); 
        } else {
            if (inners[i]) inners[i].classList.add('bg-yellow-400');
        }
    }

    // Update Text & Line
    if (statusLevel === 1) {
        if (line) line.style.height = '0%';
        if (statusText) {
            statusText.textContent = 'Request Received';
            statusText.className = 'text-white font-bold';
        }
    } else if (statusLevel === 2) {
        if (line) line.style.height = '50%';
        if (statusText) {
            statusText.textContent = 'In Progress';
            statusText.className = 'text-yellow-400 font-bold';
        }
    } else if (statusLevel === 3) {
        if (line) line.style.height = '100%';
        if (statusText) {
            statusText.textContent = 'Completed';
            statusText.className = 'text-green-500 font-bold';
        }
    }
};

window.resetTracker = () => {
    const input = document.getElementById('trackInput');
    const resultState = document.getElementById('resultState');
    if (input) input.value = '';
    if (resultState) resultState.classList.add('hidden');
};

// ==========================================
// 6. UI Animations (Scroll Reveal & Counters)
// ==========================================
const initScrollReveal = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
};

const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'), 10);
                const suffix = entry.target.getAttribute('data-suffix') || '';
                let current = 0;
                const increment = target / 60;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(current) + suffix;
                    }
                }, 25);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(c => observer.observe(c));
};

// ==========================================
// 7. Active Nav Indicator
// ==========================================
const initActiveNav = () => {
    const path = window.location.pathname;
    // Handle root path or folder paths by defaulting to index.html
    const page = path.split("/").pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Clean up current filename from the link href (handles ../index.html or pages/services.html)
        const linkPage = href.split("/").pop();

        // Reset classes first
        link.classList.remove('text-yellow-400', 'font-bold', 'border-b-2', 'border-yellow-400', 'pb-1');
        if (link.closest('#mobile-menu')) {
            link.classList.remove('text-yellow-400');
            link.classList.add('text-gray-300');
        } else {
            link.classList.add('text-gray-400');
        }

        // Check for match
        if (page === linkPage) {
            link.classList.add('text-yellow-400', 'font-bold');
            link.classList.remove('text-gray-400', 'text-gray-300');
            
            // Add underline for desktop nav
            if (!link.closest('#mobile-menu')) {
                link.classList.add('border-b-2', 'border-yellow-400', 'pb-1');
            }
        }
    });
};

// ==========================================
// 8. FAQ Toggle Logic
// ==========================================
window.toggleFAQ = (btn) => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('svg');
    const allFaqs = document.querySelectorAll('.faq-content');
    const allIcons = document.querySelectorAll('.faq-icon');

    // Close others
    allFaqs.forEach((faq, i) => {
        if (faq !== content) {
            faq.classList.add('hidden');
            allIcons[i].classList.remove('rotate-180');
        }
    });

    // Toggle current
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
};

// ==========================================
// 9. Global Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSmoothScroll();
    initScrollReveal();
    animateCounters();
    initActiveNav();

    // Set minimum date for booking picker dynamically
    const dateInput = document.getElementById('serviceDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});
