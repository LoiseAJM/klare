document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // 1. ANIMATION D'APPARITION (FADE IN)
    // =========================================
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // =========================================
    // 2. GESTION DES CARROUSELS MULTIPLES
    // =========================================
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');

        if (track && prevBtn && nextBtn) {
            
            // Fonction pour vérifier et mettre à jour l'état des boutons
            const updateButtonStates = () => {
                const isAtStart = track.scrollLeft <= 1;
                const isAtEnd = Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 1;

                prevBtn.disabled = isAtStart;
                nextBtn.disabled = isAtEnd;
            };

            // Initialisation au chargement
            updateButtonStates();

            // Vérification pendant le défilement
            track.addEventListener('scroll', updateButtonStates);

            // Fonction de défilement générique
            const moveCarousel = (direction) => {
                const slide = track.querySelector('.carousel-slide');
                if (!slide) return;

                const slideWidth = slide.clientWidth + 20; // Largeur + gap
                
                track.scrollBy({ 
                    left: direction * slideWidth, 
                    behavior: 'smooth' 
                });
            };

            // Écouteurs d'événements sur les boutons
            prevBtn.addEventListener('click', () => moveCarousel(-1));
            nextBtn.addEventListener('click', () => moveCarousel(1));
        }
    });
});