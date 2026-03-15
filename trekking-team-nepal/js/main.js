/**
 * Trekking Team Nepal - Main JavaScript
 * Includes: Navigation, Animations, Form Validation, Filtering, Security
 */

(function() {
    'use strict';

    // ========================================
    // DOM Ready
    // ========================================
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initScrollAnimations();
        initBackToTop();
        initTrekFilters();
        initContactForm();
        initBookingForm();
        initSmoothScroll();
    });

    // ========================================
    // Navigation
    // ========================================
    function initNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');

        // Scroll effect
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close menu when clicking a link
            navLinks.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    navToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        }
    }

    // ========================================
    // Scroll Animations
    // ========================================
    function initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in');

        if (fadeElements.length === 0) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    // ========================================
    // Back to Top
    // ========================================
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        
        if (!backToTop) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // Trek Filters & Sorting
    // ========================================
    function initTrekFilters() {
        const difficultyFilter = document.getElementById('difficulty');
        const durationFilter = document.getElementById('duration');
        const regionFilter = document.getElementById('region');
        const sortByFilter = document.getElementById('sortBy');
        const searchInput = document.getElementById('trekSearch');
        const resultsCount = document.getElementById('resultsCount');
        const treksGrid = document.getElementById('treksGrid');

        if (!treksGrid) return;

        const trekLinks = Array.from(treksGrid.querySelectorAll('.trek-card-link'));
        const initialOrder = [...trekLinks];
        const totalTreks = trekLinks.length;

        function updateDisplay() {
            const difficulty = difficultyFilter ? difficultyFilter.value : '';
            const duration = durationFilter ? durationFilter.value : '';
            const region = regionFilter ? regionFilter.value : '';
            const sortBy = sortByFilter ? sortByFilter.value : 'featured';
            const search = searchInput ? searchInput.value.toLowerCase() : '';

            // 1. Filter
            let visibleCount = 0;
            trekLinks.forEach(function(link) {
                const card = link.querySelector('.trek-card');
                const cardDifficulty = card.getAttribute('data-difficulty');
                const cardDuration = parseInt(card.getAttribute('data-duration'));
                const cardRegion = card.getAttribute('data-region');
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();

                let show = true;

                if (difficulty && cardDifficulty !== difficulty) show = false;
                if (duration) {
                    const maxDuration = parseInt(duration);
                    if (duration === '25') {
                        if (cardDuration < 20) show = false;
                    } else if (cardDuration > maxDuration) {
                        show = false;
                    }
                }
                if (region && cardRegion !== region) show = false;
                if (search && !title.includes(search) && !description.includes(search)) show = false;

                link.style.display = show ? '' : 'none';
                if (show) visibleCount++;
            });

            // 2. Sort
            const sortedLinks = [...trekLinks].sort((a, b) => {
                const cardA = a.querySelector('.trek-card');
                const cardB = b.querySelector('.trek-card');

                if (sortBy === 'price-low') {
                    return parseInt(cardA.getAttribute('data-price')) - parseInt(cardB.getAttribute('data-price'));
                } else if (sortBy === 'price-high') {
                    return parseInt(cardB.getAttribute('data-price')) - parseInt(cardA.getAttribute('data-price'));
                } else if (sortBy === 'duration-short') {
                    return parseInt(cardA.getAttribute('data-duration')) - parseInt(cardB.getAttribute('data-duration'));
                } else if (sortBy === 'duration-long') {
                    return parseInt(cardB.getAttribute('data-duration')) - parseInt(cardA.getAttribute('data-duration'));
                } else {
                    // Default/Featured: use original index or some featured logic
                    return 0;
                }
            });

            // Re-append in sorted order
            if (sortBy !== 'featured') {
                sortedLinks.forEach(link => treksGrid.appendChild(link));
            } else {
                initialOrder.forEach(link => treksGrid.appendChild(link));
            }

            // 3. Update UI
            if (resultsCount) {
                resultsCount.textContent = `Showing ${visibleCount} of ${totalTreks} treks`;
            }

            // Handle "No Results"
            let noResults = treksGrid.querySelector('.no-results');
            if (visibleCount === 0) {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.className = 'no-results';
                    noResults.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 3rem; color: var(--color-text-muted);">No treks match your criteria. Try adjusting your filters.</p>';
                    treksGrid.appendChild(noResults);
                }
            } else if (noResults) {
                noResults.remove();
            }
        }

        // Event listeners
        [difficultyFilter, durationFilter, regionFilter, sortByFilter].forEach(el => {
            if (el) el.addEventListener('change', updateDisplay);
        });

        if (searchInput) {
            searchInput.addEventListener('input', debounce(updateDisplay, 300));
        }

        // Initial update
        updateDisplay();
    }

    // ========================================
    // Contact Form
    // ========================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Security: Check honeypot field
            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) {
                // Bot detected, silently fail
                console.log('Bot detected');
                return;
            }

            // Validate form
            if (!validateForm(form)) {
                return;
            }

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (in production, this would be an actual API call)
            setTimeout(function() {
                // Show success message
                showNotification('Thank you for your inquiry! We will get back to you within 24 hours.', 'success');
                
                // Reset form
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(input);
            });
            
            input.addEventListener('input', function() {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    }

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(function(field) {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Check required
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Min length validation
        if (field.hasAttribute('minlength') && value) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (value.length < minLength) {
                isValid = false;
                errorMessage = 'Minimum ' + minLength + ' characters required';
            }
        }

        // Update UI
        const formGroup = field.closest('.form-group') || field.parentElement;
        let errorElement = formGroup ? formGroup.querySelector('.error-message') : null;

        if (!isValid) {
            field.classList.add('error');
            field.classList.remove('valid');
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.color = 'var(--color-error)';
                errorElement.style.fontSize = '0.85rem';
                errorElement.style.marginTop = '0.5rem';
                if (formGroup) {
                    formGroup.appendChild(errorElement);
                }
            }
            errorElement.textContent = errorMessage;
        } else {
            field.classList.remove('error');
            field.classList.add('valid');
            if (errorElement) {
                errorElement.remove();
            }
        }

        return isValid;
    }

    // ========================================
    // Smooth Scroll
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ========================================
    // Booking Form
    // ========================================
    function initBookingForm() {
        const form = document.getElementById('bookingForm');
        
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Security: Check honeypot field
            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) {
                console.log('Bot detected');
                return;
            }

            // Validate form
            if (!validateForm(form)) {
                return;
            }

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(function() {
                showNotification('Thank you for booking! We will contact you within 24 hours to confirm your reservation.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ========================================
    // Notification System
    // ========================================
    function showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        if (type === 'success') {
            notification.style.background = 'var(--color-success)';
        } else if (type === 'error') {
            notification.style.background = 'var(--color-error)';
        }

        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(function() {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // ========================================
    // Utility Functions
    // ========================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ========================================
    // Security Enhancements
    // ========================================
    // Disable right-click on sensitive areas (optional)
    document.addEventListener('contextmenu', function(e) {
        // Uncomment to disable right-click globally
        // e.preventDefault();
    });

    // Prevent form double submission
    let formSubmitted = false;
    window.addEventListener('beforeunload', function() {
        if (formSubmitted) {
            return 'Form submission in progress. Are you sure you want to leave?';
        }
    });

})();

// ========================================
// CSS Animations (injected)
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .error {
        border-color: var(--color-error) !important;
    }
    
    .valid {
        border-color: var(--color-success) !important;
    }
    
    input.error, 
    textarea.error, 
    select.error,
    input:focus.error,
    textarea:focus.error,
    select:focus.error {
        border-color: var(--color-error) !important;
        box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
    }
    
    .trek-highlights {
        list-style: none;
        margin: 1rem 0;
        padding: 0;
    }
    
    .trek-highlights li {
        padding: 0.25rem 0;
        color: var(--color-text-secondary);
        font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
        .notification {
            left: 20px !important;
            right: 20px !important;
            max-width: none !important;
        }
    }
`;
document.head.appendChild(style);
