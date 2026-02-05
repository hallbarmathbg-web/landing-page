// script.js - Premium Redesign with Robust MD Handling

document.addEventListener('DOMContentLoaded', async () => {
    const appEl = document.getElementById('main-content');
    const headerEl = document.querySelector('.logo-container');

    // ============================================
    // 1. Dynamic Header Padding & Branding
    // ============================================
    const setupHeader = () => {
        if (!headerEl) return;

        // Add brand name if not present
        if (!headerEl.querySelector('.header-brand-name')) {
            const brandName = document.createElement('span');
            brandName.className = 'header-brand-name';
            brandName.textContent = 'Hållbar Mat Hbg';
            headerEl.appendChild(brandName);
        }

        // Dynamic padding
        const updatePadding = () => {
            const height = headerEl.offsetHeight;
            const appWrapper = document.getElementById('app');
            if (appWrapper) {
                appWrapper.style.paddingTop = (height + 24) + 'px'; // 24px = 3 × 8pt
            }
        };

        updatePadding();
        window.addEventListener('resize', updatePadding);
    };

    setupHeader();

    // ============================================
    // 2. Load & Parse Markdown
    // ============================================
    try {
        const response = await fetch('content.md?t=' + Date.now());
        if (!response.ok) throw new Error(`Fel vid laddning (${response.status})`);

        const text = await response.text();
        if (!text.trim()) throw new Error('Innehållsfilen är tom');

        const htmlContent = marked.parse(text);
        appEl.innerHTML = htmlContent;
        appEl.classList.remove('loading');

        // 3. Process Layout
        processLayout(appEl);

    } catch (error) {
        appEl.innerHTML = `
            <div style="text-align:center; padding: 64px 24px; max-width: 400px; margin: 0 auto;">
                <p style="color:var(--color-accent); font-weight:600; font-size: 1.25rem; margin-bottom: 16px;">
                    Kunde inte ladda innehållet
                </p>
                <p style="opacity: 0.7; font-size: 0.9rem;">${error.message}</p>
            </div>
        `;
        appEl.classList.remove('loading');
        console.error('Content loading failed:', error);
    }
});

// ============================================
// Layout Processing - Robust Section Splitting
// ============================================
function processLayout(container) {
    const children = Array.from(container.children);
    if (children.length === 0) return;

    // Detect splitting strategy
    const hasHR = children.some(c => c.tagName === 'HR');
    const hasH2 = children.some(c => c.tagName === 'H2');

    container.innerHTML = '';

    let currentSection = document.createElement('section');
    container.appendChild(currentSection);

    if (hasHR) {
        // STRATEGY A: Split by <hr> (preferred)
        children.forEach(child => {
            if (child.tagName === 'HR') {
                if (currentSection.children.length > 0) {
                    currentSection = document.createElement('section');
                    container.appendChild(currentSection);
                }
            } else {
                currentSection.appendChild(child);
            }
        });
    } else if (hasH2) {
        // STRATEGY B: Split by <h2> (fallback)
        children.forEach(child => {
            if (child.tagName === 'H2' && currentSection.children.length > 0) {
                currentSection = document.createElement('section');
                container.appendChild(currentSection);
            }
            currentSection.appendChild(child);
        });
    } else {
        // STRATEGY C: Single block
        children.forEach(child => currentSection.appendChild(child));
    }

    // ============================================
    // Post-Process Sections
    // ============================================
    const sections = container.querySelectorAll('section');

    sections.forEach((section, index) => {
        // Remove empty sections
        if (section.children.length === 0 || !section.innerText.trim()) {
            section.remove();
            return;
        }

        // Hero section (first one)
        if (index === 0) {
            section.classList.add('hero-section');
        }

        // Contact section (keyword detection)
        const text = section.innerText.toLowerCase();
        const contactKeywords = ['swish', 'bankgiro', 'bg:', 'kontakt', 'medlem', 'e-post', 'följ oss'];
        if (contactKeywords.some(kw => text.includes(kw))) {
            section.classList.add('contact-section');
        }

        // Move first image to top of section (if not hero)
        if (index > 0) {
            promoteFirstImage(section);
        }
    });
}

// ============================================
// Image Promotion - Move to Top of Card
// ============================================
function promoteFirstImage(section) {
    // Find the first <img> that's not an icon
    const images = section.querySelectorAll('img:not([src*="icon_"])');
    if (images.length === 0) return;

    const firstImg = images[0];

    // Only promote if it's NOT already the first child
    if (section.firstElementChild !== firstImg) {
        // Clone to preserve position, then move original to top
        section.insertBefore(firstImg, section.firstChild);
    }

    // Ensure proper styling
    firstImg.classList.add('section-hero-img');
}
