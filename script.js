(function() {
    "use strict";

    // ===== SCROLL TO SECTION FUNCTION =====
    // Make it globally available for onclick handlers
    window.scrollToSection = function(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    // ===== PRELOADER =====
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hide');
            }, 800);
        }
    });

    // ===== DARK MODE TOGGLE =====
    const toggleBtn = document.getElementById('themeToggle');
    const body = document.body;
    const icon = toggleBtn.querySelector('i');

    // Load saved theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark');
        icon.className = 'fas fa-sun';
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // ===== MOBILE NAV TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close nav when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ===== ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a:not(.theme-toggle)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.num');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'), 10);
                    let current = 0;
                    const increment = Math.ceil(target / 40);
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target + '+';
                            clearInterval(timer);
                        } else {
                            counter.textContent = current + '+';
                        }
                    }, 30);
                });
            }
        });
    }, { threshold: 0.3 });

    if (counters.length > 0) {
        counterObserver.observe(counters[0].closest('.hero-stats'));
    }

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== PROFILE PHOTO UPLOAD =====
    const photoUpload = document.getElementById('photoUpload');
    const profilePhoto = document.getElementById('profilePhoto');
    const defaultAvatar = document.getElementById('defaultAvatar');

    if (photoUpload) {
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePhoto.src = event.target.result;
                    profilePhoto.style.display = 'block';
                    defaultAvatar.style.display = 'none';
                    
                    // Save to localStorage
                    try {
                        localStorage.setItem('profilePhoto', event.target.result);
                    } catch (error) {
                        console.log('Could not save photo to localStorage');
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        // Load saved photo from localStorage
        try {
            const savedPhoto = localStorage.getItem('profilePhoto');
            if (savedPhoto) {
                profilePhoto.src = savedPhoto;
                profilePhoto.style.display = 'block';
                defaultAvatar.style.display = 'none';
            }
        } catch (error) {
            console.log('Could not load saved photo');
        }
    }

    // ===== EMAILJS CONTACT FORM =====
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    // EmailJS Configuration - REPLACE WITH YOUR ACTUAL CREDENTIALS
    const EMAILJS_CONFIG = {
        PUBLIC_KEY: 'LFw0Nsj2yV4EdFP3a',
        SERVICE_ID: 'service_bdlh4wd',
        TEMPLATE_ID: 'template_3jarndd'
    };

    // Load EmailJS library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = function() {
        try {
            emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
            console.log('✅ EmailJS initialized successfully');
        } catch (error) {
            console.error('❌ EmailJS initialization failed:', error);
        }
    };
    script.onerror = function() {
        console.error('❌ Failed to load EmailJS library');
        if (status) {
            status.textContent = '⚠️ Email service unavailable. Please try again later.';
            status.style.color = '#ef4444';
        }
    };
    document.head.appendChild(script);

    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                status.textContent = '⚠️ Please fill all fields.';
                status.style.color = '#ef4444';
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                status.textContent = '⚠️ Please enter a valid email address.';
                status.style.color = '#ef4444';
                return;
            }

            if (typeof emailjs === 'undefined') {
                status.textContent = '⏳ Email service is loading. Please try again in a moment.';
                status.style.color = '#f59e0b';
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            status.textContent = '📤 Sending your message...';
            status.style.color = '#3b82f6';

            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_name: 'Vrushali Kanavadey',
                reply_to: email
            };

            emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
                .then((response) => {
                    console.log('✅ Email sent successfully:', response);
                    status.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
                    status.style.color = '#22c55e';
                    form.reset();
                })
                .catch((error) => {
                    console.error('❌ EmailJS error:', error);
                    let errorMessage = '❌ Failed to send message. ';
                    if (error.text) {
                        errorMessage += error.text;
                    } else {
                        errorMessage += 'Please try again later.';
                    }
                    status.textContent = errorMessage;
                    status.style.color = '#ef4444';
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                });
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('🚀 Portfolio website loaded successfully!');
})();