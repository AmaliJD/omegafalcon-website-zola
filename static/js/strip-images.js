document.querySelectorAll('.strip-icon').forEach(img => {
        img.addEventListener('click', () => {
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