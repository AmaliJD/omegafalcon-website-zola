const tagButtons = document.querySelectorAll('.tag-btn');
const modeButton = document.getElementById('union-btn');
const photoCards = document.querySelectorAll('.photo-card');

let selectedTags = new Set();
let strictMatchMode = false; // "AND" mode

// Toggle Mode (AND vs OR)
modeButton.addEventListener('click', () => {
    strictMatchMode = !strictMatchMode;
    modeButton.textContent = strictMatchMode ? "×" : "+";
    modeButton.classList.toggle('selected', strictMatchMode);
    applyFilters();
});

// Toggle Individual Tags
tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        if (selectedTags.has(tag))
        {
            selectedTags.delete(tag);
            btn.classList.remove('selected');
        }
        else
        {
            selectedTags.add(tag);
            btn.classList.add('selected');
        }
        applyFilters();
    });
});

function applyFilters()
{
    photoCards.forEach(card => {
        // Get tags from the card and turn into an array
        const tagsDataString = card.getAttribute('data-tags');
        const photoCardTags = tagsDataString ? tagsDataString.split(',') : [];

        if (selectedTags.size === 0)
        {
            card.style.display = 'block'; // Show all if nothing is selected
            return;
        }

        const selectedArray = [...selectedTags];
        let isVisible = false;

        if (strictMatchMode)
        {
            isVisible = selectedArray.every(t => photoCardTags.includes(t));
        }
        else
        {
            isVisible = selectedArray.some(t => photoCardTags.includes(t));
        }

        card.style.display = isVisible ? 'block' : 'none';
    });
}