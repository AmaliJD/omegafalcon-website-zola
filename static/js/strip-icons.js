document.querySelectorAll('.strip-icon').forEach(img => {
        img.addEventListener('pointerdown', () => {
            img.classList.remove('is-fading');
            // Prevent restarting mid-spin if you want, or just re-add
            var rand = Math.random() * 4;
            if (rand <= 1)
            {
                img.classList.add('is-spinning');
            }
            else if (rand <= 2)
            {
                img.classList.add('is-pulsing');
            }
            else if (rand <= 3)
            {
                img.classList.add('is-hopping');
            }
            else if (rand <= 4)
            {
                img.classList.add('is-squishing');
            }
        });

        // Remove the class once the 360 rotation is done
        img.addEventListener('animationend', () => {
            img.classList.remove('is-spinning');
            img.classList.remove('is-pulsing');
            img.classList.remove('is-hopping');
            img.classList.remove('is-squishing');
        });
    });

window.addEventListener('DOMContentLoaded', () => {
    // const iconList = [
    //             "{{ icon1.url | safe }}",
    //             "{{ icon2.url | safe }}",
    //             "{{ icon3.url | safe }}",
    //             "{{ icon4.url | safe }}",
    //             "{{ icon5.url | safe }}",
    //             "{{ icon6.url | safe }}",
    //         ];
    const iconListShuffled = iconList.sort(() => 0.5 - Math.random());
    
    // 2. Find all the sticker slots in the HTML
    const iconSlots = Array.from(document.querySelectorAll('.strip-icon')).slice(1);
    
    // 3. Fill each slot with a unique image from the shuffled pool
    iconSlots.forEach((slot, index) => {
        if (iconListShuffled[index]) {
            slot.src = iconListShuffled[index];
        }
    });
});