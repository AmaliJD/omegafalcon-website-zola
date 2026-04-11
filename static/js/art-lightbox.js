const markdownContent = document.getElementById('markdown-content');
const lightboxCarousel = document.getElementById('lightbox-carousel');
const lightboxContainer = document.querySelector('.lightbox-container');

async function fetchArtData()
{
    const slug = window.location.hash.replace('#', '');
    
    if (!slug) {
        console.log("home page art/");

        lightboxContainer.classList.remove('active');
        unlockScroll();
        return;
    }

    try
    {
        const response = await fetch(`/art/${slug}/`);
        
        if (!response.ok)
        {
            throw new Error(`data at /art/${slug}/ does not exist.`);
        }

        lightboxContainer.classList.add('active');
        lockScroll();

        const rawHtml = await response.text();

        // Use a temporary DOM to parse the string
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        // 1. Get the Markdown Content (rendered as HTML)
        const markdownHtml = doc.getElementById('markdown-text').innerHTML;

        // 2. Get all Asset paths
        const assetSpans = doc.querySelectorAll('#image-paths span');
        const assetUrls = Array.from(assetSpans).map(span => span.dataset.path);
        const mainImages = assetUrls.filter(url => !url.includes(`extras`)); 
        const extraImages = assetUrls.filter(url => url.includes(`extras`));
        const sortedImages = [...mainImages, ...extraImages];

        const title = doc.getElementById('frontmatter-title').innerHTML;
        const date = doc.getElementById('frontmatter-date').innerHTML;
        const tagline = doc.getElementById('frontmatter-tagline').innerHTML;

        // --- CONSOLE LOG ---
        console.group(`Results for ${slug}`);
        console.log("Converted Markdown HTML:", markdownHtml.trim());
        console.log("Found Assets:", sortedImages);
        console.groupEnd();

        injectArtData(title, date, tagline,markdownHtml.trim(), sortedImages);

    }
    catch (err)
    {
        console.error("Error Fetching Art Data:", err.message);
        return;
    }
}

// Run the test whenever the URL hash changes
window.addEventListener('hashchange', fetchArtData);

// Run once on load in case you refresh with a hash already there
window.addEventListener('DOMContentLoaded', fetchArtData);

function injectArtData(title, date, tagline, markdownHtml, images)
{
    const mdHTML = `
        <div class="text-header">
            <h3>${title}</h3>
            <p class="text-tagline" style="font-style: italic;">${tagline}</p>
        </div>

        <div class="text-date">
            <p>${date}</p>
        </div>
        
        <div class="text-body">
            ${markdownHtml} 
        </div>
    `;
    markdownContent.innerHTML = mdHTML;

    lightboxCarousel.innerHTML = "";
    images.forEach((url, index) => {
        const isVideo = url.toLowerCase().endsWith('.mp4');
        let element;

        if (isVideo) {
            element = document.createElement('video');
            element.src = url;
            element.autoplay = true;
            element.loop = true;
            element.muted = true;
            element.playsInline = true;
            element.setAttribute('preload', 'auto'); 
        } else {
            element = document.createElement('img');
            element.src = url;
            element.loading = 'lazy';
        }

        element.className = 'lightbox-carousel-img';
        
        lightboxCarousel.appendChild(element);
    });

    currentImgIndex = 0;
    lightboxCarousel.style.setProperty('--offset', 0);
    updateButtonVisibility();
}

let currentImgIndex = 0;
let wrap = false;

function moveCarousel(direction) {
    const totalImages = lightboxCarousel.children.length;

    if (wrap)
    {
        currentImgIndex += direction;
        if (currentImgIndex < 0)
            currentImgIndex += totalImages;

        currentImgIndex = currentImgIndex % totalImages;
    }
    else
    {
        currentImgIndex = Math.max(0, Math.min(currentImgIndex + direction, totalImages - 1));
    }
    
    // currentImgIndex = Math.max(0, Math.min(currentImgIndex + direction, totalImages - 1));

    // We set the variable on the CAROUSEL, but the IMAGES use it to move
    lightboxCarousel.style.setProperty('--offset', currentImgIndex);

    updateButtonVisibility();
}

function updateButtonVisibility() {
    const totalImages = lightboxCarousel.children.length;
    
    const prevBtn = document.querySelector('.carousel-button.prev');
    const nextBtn = document.querySelector('.carousel-button.next');

    if (totalImages <= 1) {
        prevBtn.classList.add('is-hidden');
        nextBtn.classList.add('is-hidden');
        return;
    }

    prevBtn.classList.remove('is-hidden');
    nextBtn.classList.remove('is-hidden');

    if (wrap)
        return;

    if (currentImgIndex === 0)
    {
        prevBtn.classList.add('is-hidden');
    }
    else if (currentImgIndex === totalImages - 1)
    {
        nextBtn.classList.add('is-hidden');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        returnToArt();
        // window.location.hash = '';
        // history.back();
    }
});

function returnToArt() {
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
}

// lightboxContainer.addEventListener('click', (e) => {
//     const isInsideContent = e.target.closest('.lightbox-carousel') || 
//                             e.target.closest('.markdown-content');

//     console.log("Clicked element:", e.target);

//     if (!isInsideContent) {
//         window.location.hash = '';
//     }
// });