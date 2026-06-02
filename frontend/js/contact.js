const contactForm = document.querySelector('[data-contact-form]');
const contactStatus = document.querySelector('[data-contact-status]');
const serviceSelect = document.querySelector('[data-service-select]');
const canvasSizeGroup = document.getElementById('canvas-size-group');
const isGithubPages = window.location.hostname.endsWith('github.io');

// Handle canvas size selector visibility
if (serviceSelect && canvasSizeGroup) {
  serviceSelect.addEventListener('change', (event) => {
    if (event.target.value === 'canvas-paintings') {
      canvasSizeGroup.style.display = 'block';
    } else {
      canvasSizeGroup.style.display = 'none';
    }
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(contactForm).entries());

   // WhatsApp message formatting

const waNumber = '918275223989';

const referenceInput =
  document.getElementById('reference');

let imageText = '';

if (
  referenceInput &&
  referenceInput.files.length > 0
) {

  imageText =
    `Reference Images Selected: ${referenceInput.files.length} image(s)\n`;

}

const waMessage =
  `Hello Rachanatmak,\n\n` +

  `Name: ${formData.name}\n` +

  `Phone: ${formData.phone || 'N/A'}\n` +

  `City: ${formData.city || 'N/A'}\n` +

  `Service: ${formData.service || 'N/A'}\n` +

  `Canvas Size: ${formData['canvas-size'] || 'N/A'}\n\n` +

  `${imageText}\n` +

  `Project Details:\n${formData.message}`;


// Open WhatsApp

const waUrl =
  `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

window.open(
  waUrl,
  '_blank',
  'noopener'
);

    if (isGithubPages) {
      // For demo purposes, open email client
      const emailBody = `Name: ${formData.name}%0DEmail: ${formData.email}%0DPhone: ${formData.phone}%0DService: ${formData.service}%0DCanvas Size: ${formData['canvas-size'] || 'N/A'}%0D%0DMessage:%0D${formData.message}`;
      window.location.href = `mailto:rachanashirkande28@gmail.com?subject=Contact Form Submission from ${formData.name}&body=${emailBody}`;
      contactStatus.textContent = 'Opening email client...';
      return;
    }

    contactStatus.textContent = 'Sending...';

    try {
      const response = await fetch('api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Message failed.');
      }

      contactForm.reset();
      if (canvasSizeGroup) canvasSizeGroup.style.display = 'none';
      contactStatus.textContent = 'Thank you. Your message has been sent.';
    } catch (error) {
      contactStatus.textContent = error.message;
    }
  });
}

