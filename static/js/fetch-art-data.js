const markdownElement = document.getElementById('markdown-content');

async function fetchArtData()
{
    const slug = window.location.hash.replace('#', '');
    
    if (!slug) {
        console.log("home page art/");
        return;
    }

    try
    {
        const response = await fetch(`/art/${slug}/`);
        
        if (!response.ok)
        {
            throw new Error(`data at /art/${slug}/ does not exist.`);
        }

        const rawHtml = await response.text();

        // Use a temporary DOM to parse the string
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        // 1. Get the Markdown Content (rendered as HTML)
        const markdownHtml = doc.getElementById('marktown-text').innerHTML;

        // 2. Get all Asset paths
        const assetSpans = doc.querySelectorAll('#image-paths span');
        const assetUrls = Array.from(assetSpans).map(span => span.dataset.path);

        const title = doc.getElementById('frontmatter-title').innerHTML;
        const date = doc.getElementById('frontmatter-date').innerHTML;
        const tagline = doc.getElementById('frontmatter-tagline').innerHTML;

        // --- CONSOLE LOG ---
        console.group(`Results for ${slug}`);
        console.log("Converted Markdown HTML:", markdownHtml.trim());
        console.log("Found Assets:", assetUrls);
        console.groupEnd();

        injectArtData(title, date, tagline,markdownHtml.trim(), assetUrls);

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

function injectArtData(title, date, tagline, markdownHtml, assetUrls)
{
    if (markdownElement)
    {
        // markdownElement.innerHTML = "";
        // markdownElement.innerHTML += title;
        // markdownElement.innerHTML += date;
        // markdownElement.innerHTML += tagline;

        const fullContent = `
            <div class="text-header">
                <h2>${title}</h2>
                <p class="tagline">${tagline}</p>
            </div>
            
            <div class="text-body">
                ${markdownHtml} 
            </div>
            
            <div class="text-footer">
                <p>Created: ${date}</p>
            </div>
        `;
        markdownElement.innerHTML = fullContent;
    }
    else
    {
        console.error("Markdown content element not found!");
    }
}