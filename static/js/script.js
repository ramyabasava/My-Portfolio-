// Wait for the entire HTML document to be fully loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navbar Active Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const activateLink = (id) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activateLink(entry.target.id);
            }
        });
    }, {
        // Adjusts the "trigger zone" for the intersection.
        // Activates when a section is roughly in the middle of the viewport.
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });


    // --- 2. Interactive Certificate Accordion ---
    const certItems = document.querySelectorAll('.cert-item');

    certItems.forEach(item => {
        const header = item.querySelector('.cert-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other accordion items
            certItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // If the clicked item wasn't already open, open it.
            // This creates the toggle effect.
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });


    // --- 3. Contact Form Submission with EmailJS ---
    const contactForm = document.getElementById('contact-form');
    
    // Check if the contact form exists on the page to avoid errors
    if (contactForm) {
        // Initialize EmailJS with your Public Key
        emailjs.init('46pE0NXEgIt0HGJr9'); // Your Public Key

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop the default page reload

            const formStatus = document.getElementById('form-status');
            const sendButton = contactForm.querySelector('button');
            const originalButtonText = sendButton.innerHTML;
            
            // Provide visual feedback to the user
            sendButton.disabled = true;
            sendButton.innerHTML = 'Sending...';

            const serviceID = 'service_v8i6o0a'; // Your EmailJS Service ID
            const templateID = 'template_rw1uin6'; // Your EmailJS Template ID

            // Use the EmailJS SDK to send the form data
            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    // On Success:
                    formStatus.innerHTML = "Thank you! Your message has been sent.";
                    formStatus.className = 'success';
                    contactForm.reset(); // Clear form fields
                })
                .catch((err) => {
                    // On Error:
                    formStatus.innerHTML = "Oops! Something went wrong. Please try again.";
                    formStatus.className = 'error';
                    console.error('EmailJS Error:', JSON.stringify(err));
                })
                .finally(() => {
                    // This runs regardless of success or error
                    sendButton.disabled = false;
                    sendButton.innerHTML = originalButtonText;
                });
        });
    }
});