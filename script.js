document.addEventListener('DOMContentLoaded', async () => {
    const introCard = document.getElementById('intro-card');
    const navActions = document.getElementById('nav-actions');
    const mainContent = document.getElementById('main-content');
    const heroSection = document.getElementById('hero-section');
    const navContainer = document.getElementById('dynamic-nav');

    try {
        // 1. Fetch Markdown
        const response = await fetch('content.md?t=' + Date.now());
        if (!response.ok) throw new Error('Failed to load content');
        const text = await response.text();

        // 2. Parse Markdown
        // We use a temporary container to parse HTML so we can manipulate DOM nodes
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = marked.parse(text);

        // 3. Process Content
        distributeContent(tempDiv, introCard, mainContent, heroSection);

        // 3b. Inject Contact Buttons into Header
        injectContactButtons(mainContent, navActions);

        // 4. Generate Navigation
        generateNavigation(mainContent, navContainer);

    } catch (error) {
        console.error('Error:', error);
        introCard.innerHTML = `<p style="color:red">Ett fel uppstod: ${error.message}</p>`;
    }
});

/* ... distributeContent (unchanged) ... */
function distributeContent(sourceContainer, introTarget, mainTarget, heroTarget) {
    // Strategy: Everything before the first <hr> is INTRO.
    // Everything after is MAIN CONTENT.

    const children = Array.from(sourceContainer.children);
    let isIntro = true;

    // Clear targets
    introTarget.innerHTML = '';
    mainTarget.innerHTML = '';

    const introElements = [];
    const mainElements = [];

    children.forEach(child => {
        if (child.tagName === 'HR') {
            isIntro = false;
            return; // Skip the HR itself
        }

        if (isIntro) {
            introElements.push(child);
        } else {
            mainElements.push(child);
        }
    });

    // --- Process Intro ---
    // Extract first image for Hero Background
    const heroImgIndex = introElements.findIndex(el => el.tagName === 'P' && el.querySelector('img'));

    if (heroImgIndex !== -1) {
        const pTag = introElements[heroImgIndex];
        const img = pTag.querySelector('img');
        if (img) {
            // Set background
            heroTarget.style.backgroundImage = `url('${img.src}')`;
            // Remove this paragraph from intro content
            introElements.splice(heroImgIndex, 1);
        }
    }

    // Append remaining intro elements to card
    introElements.forEach(el => introTarget.appendChild(el));

    // --- Process Main Content ---
    // Group into sections based on H2
    let currentSection = null;

    mainElements.forEach(el => {
        if (el.tagName === 'H2') {
            // Start new section
            if (currentSection) mainTarget.appendChild(currentSection);

            currentSection = document.createElement('section');
            // Create ID for navigation
            const id = el.textContent.toLowerCase()
                .replace(/[åä]/g, 'a')
                .replace(/[ö]/g, 'o')
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-');
            currentSection.id = id;

            currentSection.appendChild(el);
        } else {
            if (!currentSection) {
                // Orphan content before first H2
                currentSection = document.createElement('section');
            }
            currentSection.appendChild(el);
        }
    });

    // Append last section
    if (currentSection) mainTarget.appendChild(currentSection);
}

function injectContactButtons(sourceContainer, actionTarget) {
    // Check if target exists
    if (!actionTarget) return;

    actionTarget.innerHTML = ''; // Clear existing

    // 1. Email (Primary Button) - Always show
    const btn = document.createElement('a');
    btn.href = "mailto:hallbarmathbg@gmail.com";
    btn.className = 'btn-primary-hero';
    btn.innerHTML = `<img src="assets/icon_email.svg" style="width: 20px; filter: brightness(0) invert(1);"> Kontakta Oss`;
    actionTarget.appendChild(btn);

    // Social Row
    const socialRow = document.createElement('div');
    socialRow.className = 'social-row';

    // 2. Facebook (Hardcoded)
    const fbBtn = document.createElement('a');
    fbBtn.href = "https://web.facebook.com/hallbarmathbg/";
    fbBtn.className = 'btn-icon-hero';
    fbBtn.innerHTML = `<img src="assets/icon_facebook.svg" alt="Facebook">`;
    socialRow.appendChild(fbBtn);

    // 3. Instagram (Hardcoded)
    const instaBtn = document.createElement('a');
    instaBtn.href = "https://www.instagram.com/hallbarmathbg/";
    instaBtn.className = 'btn-icon-hero';
    instaBtn.innerHTML = `<img src="assets/icon_instagram.svg" alt="Instagram">`;
    socialRow.appendChild(instaBtn);

    actionTarget.appendChild(socialRow);
}

function generateNavigation(contentContainer, navTarget) {
    const sections = contentContainer.querySelectorAll('section');
    navTarget.innerHTML = ''; // clear

    sections.forEach(section => {
        const header = section.querySelector('h2');
        if (header) {
            const link = document.createElement('a');
            link.href = `#${section.id}`;
            link.textContent = header.textContent;

            // Optional: Smooth scroll handling if verified needed, 
            // but standard anchor links work well with scroll-behavior: smooth

            navTarget.appendChild(link);
        }
    });

    // Add "Bli Medlem" button manually if desired, or let it be just another link
    // Checking if there is a 'Bli Medlem' section
    const memberSection = Array.from(sections).find(s => s.querySelector('h2')?.textContent.includes('Medlem'));

    // If we want to style the last link as a button:
    if (navTarget.lastElementChild) {
        navTarget.lastElementChild.classList.add('nav-cta');
        // We can add specific styling for .nav-cta in CSS if we want it to pop
    }
}
