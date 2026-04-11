const tagButtons = document.querySelectorAll('.tag-btn');
const modeButton = document.getElementById('union-btn');
const photoCards = document.querySelectorAll('.photo-card');

let selectedTags = new Set();
let matchMode = 0; // 0 = SINGLE (-), 1 = ANY (+), 2 = ALL (×)

// Toggle Mode
modeButton.addEventListener('click', () => {
    matchMode = (matchMode + 1) % 3;
    const modeSymbols = ['⋅', '+', '×'];
    modeButton.textContent = modeSymbols[matchMode];

    if (matchMode === 0 && selectedTags.size > 0) {
        const lastTag = [...selectedTags].pop();

        clearTags();

        const btn = document.querySelector(`.tag-btn[data-tag="${lastTag}"]`);
        addTag(btn, lastTag);
    }

    const modeNames = ['SINGLE', 'ANY', 'ALL'];
    modeButton.dataset.mode = modeNames[matchMode];

    // modeButton.classList.toggle('selected', strictMatchMode);
    applyFilters();
});

// Click Tag Button
tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        if (selectedTags.has(tag))
        {
            removeTag(btn, tag);
        }
        else
        {
            if (matchMode === 0)
                clearTags();
            
            addTag(btn, tag);
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
            card.style.display = 'flex'; // Show all if nothing is selected
            return;
        }

        const selectedArray = [...selectedTags];
        let isVisible = false;

        if (matchMode === 1)
        {
            isVisible = selectedArray.some(t => photoCardTags.includes(t));
        }
        else // 0 or 2
        {
            isVisible = selectedArray.every(t => photoCardTags.includes(t));
        }

        card.style.display = isVisible ? 'flex' : 'none';
    });
}

function clearTags() {
    selectedTags.clear();
    tagButtons.forEach(b => b.classList.remove('selected'));
}

function addTag(btn, tag) {
    selectedTags.add(tag);
    btn.classList.add('selected');
}

function removeTag(btn, tag) {
    selectedTags.delete(tag);
    btn.classList.remove('selected');
}