//--- START OF FILE legal-script.js ---

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

    // Smooth scrolling for on-page anchor links (IF YOU ADD ANY ON THIS PAGE)
    // For now, this page doesn't have internal # links in the nav for its sections
    // but the header CTA to quote page's form needs to be handled carefully or removed if not relevant here.
    // The header CTA currently links to ../QUOTE/quote.html which is fine.
    // The nav links also go to ../index.html or ../QUOTE/quote.html

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Optional: Add slight animation to hamburger icon
    const style = document.createElement('style');
    style.innerHTML = `
    .mobile-menu-toggle.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
    .mobile-menu-toggle.open span:nth-child(2) { opacity: 0; }
    .mobile-menu-toggle.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
    `;
    document.head.appendChild(style);

    // Close mobile nav if an external link (or a link to another page section) is clicked
    document.querySelectorAll('.main-nav a, .header-cta').forEach(link => {
        link.addEventListener('click', () => {
            // Check if the link is NOT strictly an on-page anchor for *this* page
            // Since this page has no internal nav scrolling currently, any click will likely navigate away
            // or is handled by browser's default for external links.
            // This ensures menu closes if an item like "Home" or "Get Started" (to quote page) is clicked.
            if (mainNav && mainNav.classList.contains('nav-active')) {
                // A small delay can sometimes help ensure navigation happens before menu visually disappears
                // but usually direct removal is fine.
                setTimeout(() => {
                    mainNav.classList.remove('nav-active');
                    if(menuToggle) menuToggle.classList.remove('open');
                }, 100);
            }
        });
    });
});
//--- END OF FILE legal-script.js ---