const tagButtons = document.querySelectorAll('.tag-btn');
const modeButton = document.getElementById('union-btn');
const onCardTagButtons = document.querySelectorAll('.tag-btn-card');
const onCardModeButtons = document.querySelectorAll('.union-btn-card');
const cards = document.querySelectorAll('.photo-card, .title-card');

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

    onCardModeButtons.forEach(btn => {
        btn.textContent = modeSymbols[matchMode];
    });
});

// Click Tag Button
tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        if (selectedTags.has(tag))
        {
            removeTag(btn, tag);

            onCardTagButtons.forEach(btn => {
                if (btn.getAttribute('data-tag') === tag)
                    btn.classList.remove('selected');
            });
        }
        else
        {
            if (matchMode === 0)
            {
                clearTags();
                onCardTagButtons.forEach(btn => btn.classList.remove('selected'));
            }
            
            addTag(btn, tag);

            onCardTagButtons.forEach(btn => {
                if (btn.getAttribute('data-tag') === tag)
                    btn.classList.add('selected');
            });
        }
        applyFilters();
    });
});

onCardTagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');

        const tag_btn = [...tagButtons].find(
            tag_btn => tag_btn.getAttribute('data-tag') === tag
        );
        tag_btn.click();
    });
});

onCardModeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButton.click();
    });
});

function applyFilters()
{
    cards.forEach(card => {
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