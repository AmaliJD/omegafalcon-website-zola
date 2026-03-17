async function testArtFetch() {
    const slug = window.location.hash.replace('#', '');
    
    if (!slug) {
        console.log("No hash detected. Click an image link to start the test.");
        return;
    }

    console.log(`--- Starting Test for: ${slug} ---`);

    try {
        // Fetch the index.html from the subfolder
        const response = await fetch(`/art/${slug}/`);
        
        if (!response.ok) {
            throw new Error(`Could not find data at /art/${slug}/. Check if the folder exists in 'public'.`);
        }

        const rawHtml = await response.text();

        // Use a temporary DOM to parse the string
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        // 1. Get the Markdown Content (rendered as HTML)
        const contentContainer = doc.getElementById('data-container');
        const markdownHtml = contentContainer ? contentContainer.innerHTML : "Content not found!";

        // 2. Get all Asset paths
        const assetSpans = doc.querySelectorAll('#image-paths span');
        const assetUrls = Array.from(assetSpans).map(span => span.dataset.path);

        // --- THE LOGS ---
        console.group(`Results for ${slug}`);
        console.log("Converted Markdown HTML:", markdownHtml.trim());
        console.log("Found Assets:", assetUrls);
        console.groupEnd();

    } catch (err) {
        console.error("Test Failed:", err.message);
    }
}

// Run the test whenever the URL hash changes
window.addEventListener('hashchange', testArtFetch);

// Run once on load in case you refresh with a hash already there
window.addEventListener('DOMContentLoaded', testArtFetch);