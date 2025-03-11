// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : 'none';
        });

        // Handle dropdown clicks on mobile
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && 
                !navLinks.contains(e.target) && 
                navLinks.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });

    // Form validation with modern feedback
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message fade-in';
                successMessage.textContent = 'Form submitted successfully!';
                form.appendChild(successMessage);

                // Reset form
                setTimeout(() => {
                    form.reset();
                    successMessage.remove();
                }, 3000);
            }
        });
    });

    function validateInput(input) {
        const errorMessage = input.parentElement.querySelector('.error-message');
        
        if (input.hasAttribute('required') && !input.value.trim()) {
            showError(input, 'This field is required');
            return false;
        }

        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                showError(input, 'Please enter a valid email address');
                return false;
            }
        }

        if (input.type === 'tel' && input.value.trim()) {
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(input.value.trim())) {
                showError(input, 'Please enter a valid phone number');
                return false;
            }
        }

        // Clear error if validation passes
        input.classList.remove('error');
        if (errorMessage) {
            errorMessage.remove();
        }
        return true;
    }

    function showError(input, message) {
        input.classList.add('error');
        let errorMessage = input.parentElement.querySelector('.error-message');
        
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            input.parentElement.appendChild(errorMessage);
        }
        
        errorMessage.textContent = message;
    }

    // Investment Calculator
    document.addEventListener('DOMContentLoaded', function() {
        const amountSlider = document.getElementById('investmentAmount');
        const amountDisplay = document.querySelector('.amount-display');
        
        if (amountSlider && amountDisplay) {
            function formatCurrency(amount) {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(amount);
            }

            function getRate(amount) {
                if (amount >= 50000) return 0.10; // 10% APY
                if (amount >= 25000) return 0.08; // 8% APY
                return 0.06; // 6% APY
            }

            function calculateReturns(amount) {
                const rate = getRate(amount);
                const yearOneReturn = amount * (1 + rate);
                const yearTwoReturn = amount * (1 + rate * 2);

                return {
                    totalReturn: yearTwoReturn,
                    annualReturn: rate * 100,
                    yearOneReturn: yearOneReturn
                };
            }

            function updateCalculator() {
                const amount = parseInt(amountSlider.value);
                const returns = calculateReturns(amount);

                amountDisplay.textContent = formatCurrency(amount);
                document.getElementById('totalReturn').textContent = formatCurrency(returns.totalReturn);
                document.getElementById('annualReturn').textContent = returns.annualReturn.toFixed(0) + '%';
                document.getElementById('yearOneReturn').textContent = formatCurrency(returns.yearOneReturn);

                // Update tier card highlighting
                document.querySelectorAll('.tier-card').forEach(card => {
                    card.classList.remove('active');
                    const cardAmount = parseInt(card.querySelector('.tier-amount').textContent.replace(/[^0-9]/g, ''));
                    if (amount === cardAmount) {
                        card.classList.add('active');
                    }
                });
            }

            // Event listeners
            amountSlider.addEventListener('input', updateCalculator);
            
            // Initialize calculator
            updateCalculator();

            // Add click handlers for tier cards
            document.querySelectorAll('.tier-card').forEach(card => {
                card.addEventListener('click', () => {
                    const amount = parseInt(card.querySelector('.tier-amount').textContent.replace(/[^0-9]/g, ''));
                    amountSlider.value = amount;
                    updateCalculator();
                });
            });
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
});

// Dropdown menu enhancement
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const content = dropdown.querySelector('.dropdown-content');

    if (trigger && content) {
        // Touch device handling
        trigger.addEventListener('touchstart', (e) => {
            e.preventDefault();
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                content.style.display = 'none';
            }
        });
    }
});

// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
});
