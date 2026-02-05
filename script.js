// script.js

document.addEventListener('DOMContentLoaded', async () => {
    const appEl = document.getElementById('main-content'); // Use the main element for content

    try {
        const response = await fetch('content.md');
        if (!response.ok) throw new Error('Failed to load content');
        const text = await response.text();

        // 1. Parse Markdown using 'marked' library
        const htmlContent = marked.parse(text);

        // 2. Inject initial HTML
        appEl.innerHTML = htmlContent;
        appEl.classList.remove('loading');

        // 3. Post-Process the DOM to match the "Canva" layout
        processLayout(appEl);

    } catch (error) {
        appEl.innerHTML = `<p style="color:red; text-align:center;">Kunde inte ladda innehållet. (${error.message})</p>`;
        console.error(error);
    }
});

function processLayout(container) {
    // A. Detect "HR" elements as section dividers
    // We want to wrap content between typical HRs into <section> tags

    // Strategy: Iterate through children, group them into sections based on <hr> or H2
    // Since Markdown parser produces flat list of elements (H1, P, HR, H2, P, IMG, etc.)

    const children = Array.from(container.children);
    container.innerHTML = ''; // Clear container to rebuild

    let currentSection = document.createElement('section');
    container.appendChild(currentSection);

    // Check if the very first element is H1 (Hero Title), maybe keep it separate?
    // Let's stick to the flow:

    children.forEach(child => {
        if (child.tagName === 'HR') {
            // Start a new section
            currentSection = document.createElement('section');
            container.appendChild(currentSection);
            // Don't append the HR itself
        } else {
            // Append element to current section
            currentSection.appendChild(child);
        }
    });

    // B. Special Handling for Specific Sections

    const sections = container.querySelectorAll('section');

    sections.forEach((section, index) => {
        // If empty (residual from HR at end), remove
        if (section.children.length === 0) {
            section.remove();
            return;
        }

        // 1. Hero Section (usually index 0)
        // Check if it contains the main H1
        const h1 = section.querySelector('h1');
        if (h1) {
            section.classList.add('hero-section');
            // Maybe make the image full width or background?
            // For now, CSS handles simple centering
        }

        // 2. Contact Section (usually last)
        // Heuristic: Check for "Kontakta" or "Kontakt" in H2
        const h2 = section.querySelector('h2');
        if (h2 && (h2.innerText.includes('Kontakt') || h2.innerText.includes('Medlem'))) {
            section.classList.add('contact-section');
        }

        // 3. Image Handling
        const imgs = section.querySelectorAll('img');
        imgs.forEach(img => {
            // Add a small rotation or visual flare
            // img.style.transform = `rotate(${Math.random() * 2 - 1}deg)`;
        });
    });
}
