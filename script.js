document.addEventListener('DOMContentLoaded', function() {

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('nav-active');
            this.classList.toggle('open'); // For hamburger animation
        });
    }

    // Smooth scrolling for nav links & active class management
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = document.querySelector('header')?.offsetHeight || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
            if (mainNav.classList.contains('nav-active')) {
                mainNav.classList.remove('nav-active');
                if (menuToggle) menuToggle.classList.remove('open');
            }
        });
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('main section[id]');
    const homeLinkId = 'home'; // ID of your home section
    const contactLinkId = 'contact'; // ID of your contact section

    function updateActiveLink() {
        let currentId = '';
        const headerHeight = document.querySelector('header')?.offsetHeight || 70;
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 1. Default to Home if at the very top
        const firstSection = sections[0];
        if (firstSection && scrollPosition < (firstSection.offsetTop - headerHeight - 50)) {
            currentId = homeLinkId;
        } else if (!firstSection && scrollPosition < 50) { // No sections, but at top
            currentId = homeLinkId;
        } else {
            // 2. Determine currentId based on general scroll position through sections
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 50;
                if (scrollPosition >= sectionTop) {
                    currentId = section.getAttribute('id');
                }
            });
        }

        // 3. Special handling for "Contacto" link when near/at the bottom:
        const contactSectionElement = document.getElementById(contactLinkId);
        if (contactSectionElement) {
            const contactSectionTop = contactSectionElement.offsetTop - headerHeight - 50;
            if ((scrollPosition + windowHeight >= documentHeight - 1) ||
                (scrollPosition >= contactSectionTop && currentId === contactLinkId) ||
                (currentId === 'testimonials' && scrollPosition >= contactSectionTop)) {
                currentId = contactLinkId;
            }
        }

        // 4. Apply 'active' class
        let activeLinkSet = false;
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.startsWith('#') && linkHref === `#${currentId}`) {
                link.classList.add('active');
                activeLinkSet = true;
            }
        });

        // 5. Final safety check for Home
        const homeLinkElement = document.querySelector(`.main-nav a[href="#${homeLinkId}"]`);
        if (!activeLinkSet && homeLinkElement && scrollPosition < 50 && currentId !== homeLinkId) {
            navLinks.forEach(l => l.classList.remove('active')); // Clear others
            homeLinkElement.classList.add('active');
        }
    }

    if (sections.length > 0 || document.querySelector(`.main-nav a[href="#${homeLinkId}"]`)) {
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink(); // Initial call
    }

    // Unit Size Tabs
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    if (tabLinks.length > 0 && tabContents.length > 0) {
        tabLinks.forEach(tabLink => {
            tabLink.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                tabLinks.forEach(link => link.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                this.classList.add('active');
                const activeContent = document.getElementById(tabId);
                if (activeContent) activeContent.classList.add('active');
            });
        });
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();


    // --- START: Mouse Trail Dots Effect (Refined) ---
    const heroSectionForTrail = document.getElementById('home'); // Targeting the hero section with id="home"

    if (heroSectionForTrail && window.matchMedia('(pointer: fine)').matches) {
        const trailDotContainer = heroSectionForTrail.querySelector('.trail-dot-container');

        if (trailDotContainer) {
            let mouseX = 0;
            let mouseY = 0;
            let lastDotTime = 0;
            const dotCreationInterval = 50; // Create a dot roughly every 50ms if mouse is moving
            let animationFrameId = null; // To store the request ID

            heroSectionForTrail.addEventListener('mousemove', function(e) {
                const rect = heroSectionForTrail.getBoundingClientRect();
                mouseX = e.clientX - rect.left;
                mouseY = e.clientY - rect.top;

                // If no animation frame is scheduled to create a dot, schedule one
                if (!animationFrameId) {
                    animationFrameId = requestAnimationFrame(createDotIfMoved);
                }
            });

            function createDotIfMoved() {
                const currentTime = Date.now();
                if (currentTime - lastDotTime > dotCreationInterval) {
                    const dot = document.createElement('div');
                    dot.classList.add('trail-dot');

                    // Jitter gives a more organic feel
                    const jitterX = Math.random() * 8 - 4; // -4px to +4px
                    const jitterY = Math.random() * 8 - 4; // -4px to +4px
                    dot.style.left = `${mouseX - 4 + jitterX}px`; // -4 for half of 8px dot size
                    dot.style.top = `${mouseY - 4 + jitterY}px`;

                    trailDotContainer.appendChild(dot);
                    lastDotTime = currentTime;

                    // Trigger the fade and scatter animation via CSS transitions
                    // Apply these styles in the next frame to ensure transition triggers
                    requestAnimationFrame(() => {
                        dot.style.opacity = '0';
                        const scatterX = Math.random() * 50 - 25; // -25px to +25px
                        const scatterY = Math.random() * 50 - 25; // -25px to +25px
                        dot.style.transform = `scale(0.2) translate(${scatterX}px, ${scatterY}px)`;
                    });

                    // Remove the dot after the animation
                    setTimeout(() => {
                        dot.remove();
                    }, 700); // Match CSS transition duration
                }
                animationFrameId = null; // Reset ID to allow next frame to be scheduled
            }
            
            // Optional: Stop creating dots if mouse leaves the hero section
            heroSectionForTrail.addEventListener('mouseleave', function() {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            });
        }
    }
    // --- END: Mouse Trail Dots Effect ---

}); // End of DOMContentLoaded

// Optional: Add slight animation to hamburger icon (This was outside DOMContentLoaded, keeping it there)
const style = document.createElement('style');
style.innerHTML = `
.mobile-menu-toggle.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
.mobile-menu-toggle.open span:nth-child(2) { opacity: 0; }
.mobile-menu-toggle.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
`;
document.head.appendChild(style);