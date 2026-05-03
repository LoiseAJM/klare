document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // 1. ANIMATION D'APPARITION (FADE IN)
    // =========================================
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15, // L'élément apparait quand 15% est visible à l'écran
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // L'animation ne se joue qu'une fois
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // =========================================
    // 2. GESTION DU CARROUSEL D'ARTISANAT
    // =========================================
    const track = document.getElementById('creationsCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Sécurité : on s'assure que les éléments existent sur la page
    if (track && prevBtn && nextBtn) {
        
        // Fonction pour vérifier et mettre à jour l'état (grisé ou non) des boutons
        const updateButtonStates = () => {
            // Marge de 1px pour éviter les bugs d'arrondis des navigateurs
            const isAtStart = track.scrollLeft <= 1;
            const isAtEnd = Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 1;

            prevBtn.disabled = isAtStart;
            nextBtn.disabled = isAtEnd;
        };

        // On vérifie l'état des boutons au chargement de la page
        updateButtonStates();

        // On vérifie l'état des boutons à chaque fois qu'on fait défiler le carrousel (clic ou tactile)
        track.addEventListener('scroll', updateButtonStates);

        // Fonction pour faire défiler via les boutons
        window.moveCarousel = function(direction) {
            const slide = track.querySelector('.carousel-slide');
            if (!slide) return;

            // On calcule le déplacement : Largeur de l'image + l'espace entre deux images (20px)
            const slideWidth = slide.clientWidth + 20; 
            
            track.scrollBy({ 
                left: direction * slideWidth, 
                behavior: 'smooth' 
            });
        };
    }
});