//--- START OF FILE quote-script.js ---

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

    // Smooth scrolling for on-page anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && document.querySelector(targetId)) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerOffset = document.querySelector('header')?.offsetHeight || 70;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    if (mainNav && mainNav.classList.contains('nav-active')) {
                        mainNav.classList.remove('nav-active');
                        if (menuToggle) menuToggle.classList.remove('open');
                    }
                }
            }
        });
    });

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Hamburger icon animation style
    const hamburgerStyle = document.createElement('style');
    hamburgerStyle.innerHTML = `
    .mobile-menu-toggle.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
    .mobile-menu-toggle.open span:nth-child(2) { opacity: 0; }
    .mobile-menu-toggle.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
    `;
    document.head.appendChild(hamburgerStyle);

    // Close mobile nav if an external link is clicked
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (!link.getAttribute('href').startsWith('#')) {
                if (mainNav && mainNav.classList.contains('nav-active')) {
                    mainNav.classList.remove('nav-active');
                    if(menuToggle) menuToggle.classList.remove('open');
                }
            }
        });
    });

    // --- START: AJAX Form Submission for Quote Page Contact Form (LIVE VERSION - STAGE 3) ---
    const contactFormQuote = document.getElementById('contactFormQuote'); 
    const flashMessageContainer = document.getElementById('flash-message-container');

    // Function to display flash messages
    function displayFlashMessage(message, type) {
        if (!flashMessageContainer) {
            console.error('Flash message container not found!');
            return;
        }
        flashMessageContainer.innerHTML = ''; 

        const flashDiv = document.createElement('div');
        flashDiv.className = `flash-message ${type}`; 
        flashDiv.textContent = message;
        
        flashMessageContainer.appendChild(flashDiv);

        setTimeout(() => {
            flashDiv.style.opacity = '0';
            setTimeout(() => {
                if (flashDiv.parentNode === flashMessageContainer) {
                    flashMessageContainer.innerHTML = ''; 
                }
            }, 600); 
        }, 5000); 
    }


    if (contactFormQuote) {
        contactFormQuote.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const formData = new FormData(contactFormQuote);
            const submitButton = contactFormQuote.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            if (flashMessageContainer) flashMessageContainer.innerHTML = '';

            let isValid = true;
            const requiredFields = ['firstName', 'lastName', 'email', 'message'];
            requiredFields.forEach(fieldName => {
                const field = contactFormQuote.elements[fieldName];
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#cf2f3f'; 
                } else {
                    field.style.borderColor = '#ccc'; 
                }
            });

            if (!isValid) {
                displayFlashMessage('Por favor, completa todos los campos marcados en rojo.', 'error');
                requiredFields.forEach(fieldName => {
                    const field = contactFormQuote.elements[fieldName];
                    if (field.value.trim() && field.style.borderColor === 'rgb(207, 47, 63)') { 
                        field.style.borderColor = '#ccc';
                    }
                });
                return;
            }
            requiredFields.forEach(fieldName => {
                contactFormQuote.elements[fieldName].style.borderColor = '#ccc';
            });

            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            // LIVE FETCH LOGIC
            fetch(contactFormQuote.action, { 
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // Crucial for FormSubmit AJAX
                }
            })
            .then(response => {
                if (response.ok) {
                    // For FormSubmit, a successful AJAX POST usually returns a simple success message
                    // or just a 200 OK. We don't strictly need to parse JSON if its success response is text.
                    // However, parsing as JSON is good practice if the service might send structured data.
                    return response.json().catch(() => ({ok: true, message: "Success but no JSON response"}));
                }
                // If response is not ok, try to parse error from FormSubmit
                return response.json().then(errData => { 
                    throw new Error(errData.error || `Error ${response.status}: ${response.statusText}`); 
                });
            })
            .then(data => {
                console.log('Success (FormSubmit):', data); 
                displayFlashMessage('¡Mensaje enviado con éxito!', 'success');
                contactFormQuote.reset(); 
                requiredFields.forEach(fieldName => { // Reset borders after successful submission
                    contactFormQuote.elements[fieldName].style.borderColor = '#ccc';
                });
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                displayFlashMessage(`Error al enviar el mensaje: ${error.message}. Inténtalo de nuevo.`, 'error');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        });
    }
    // --- END: AJAX Form Submission ---

});
//--- END OF FILE quote-script.js (Stage 3 - Live Version) ---