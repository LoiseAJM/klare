document.addEventListener("DOMContentLoaded", () => {
    // 1. Défilement fluide pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. Animation d'apparition au défilement (Intersection Observer)
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
});
// =========================================
// GESTION DU CARROUSEL D'ARTISANAT
// =========================================

function moveCarousel(direction) {
    // 1. On cible la "piste" qui contient toutes les images
    const track = document.getElementById('creationsCarousel');
    
    // Sécurité : si on ne trouve pas le carrousel, on arrête tout
    if (!track) return; 

    // 2. On cible la première image pour mesurer sa largeur exacte
    const slide = track.querySelector('.carousel-slide');
    if (!slide) return;

    // 3. On calcule le déplacement : Largeur de l'image + l'espace entre deux images (20px)
    const slideWidth = slide.clientWidth + 20; 
    
    // 4. On lance l'animation de défilement vers la gauche (-1) ou la droite (1)
    track.scrollBy({ 
        left: direction * slideWidth, 
        behavior: 'smooth' 
    });
}