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
            <p class="tagline" style="font-style: italic;">${tagline}</p>
        </div>

        <div class="text-footer">
            <p>Created: ${date}</p>
        </div>
        
        <div class="text-body">
            ${markdownHtml} 
        </div>
    `;
    markdownContent.innerHTML = mdHTML;

    lightboxCarousel.innerHTML = "";
    images.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = decodeURIComponent(url);
        img.className = 'lightbox-carousel-img';
        img.loading = 'lazy';
        
        lightboxCarousel.appendChild(img);
    });
}