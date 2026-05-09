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
            
            const updateButtonStates = () => {
                const isAtStart = track.scrollLeft <= 1;
                const isAtEnd = Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 1;

                prevBtn.disabled = isAtStart;
                nextBtn.disabled = isAtEnd;
            };

            updateButtonStates();

            track.addEventListener('scroll', updateButtonStates);

            const moveCarousel = (direction) => {
                const slide = track.querySelector('.carousel-slide');
                if (!slide) return;

                const slideWidth = slide.clientWidth + 20;
                
                track.scrollBy({ 
                    left: direction * slideWidth, 
                    behavior: 'smooth' 
                });
            };

            prevBtn.addEventListener('click', () => moveCarousel(-1));
            nextBtn.addEventListener('click', () => moveCarousel(1));
        }
    });

    // =========================================
    // 3. LIGHTBOX
    // =========================================

    // Création de l'overlay dans le DOM
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Fermer">&times;</button>
        <button class="lightbox-prev" aria-label="Image précédente">&#8249;</button>
        <img class="lightbox-img" src="" alt="">
        <button class="lightbox-next" aria-label="Image suivante">&#8250;</button>
        <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg     = lightbox.querySelector('.lightbox-img');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const closeBtn        = lightbox.querySelector('.lightbox-close');
    const prevBtn         = lightbox.querySelector('.lightbox-prev');
    const nextBtn         = lightbox.querySelector('.lightbox-next');

    let currentSlides = [];
    let currentIndex  = 0;

    const openLightbox = (slides, index) => {
        currentSlides = slides;
        currentIndex  = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const updateLightbox = () => {
        const slide = currentSlides[currentIndex];
        lightboxImg.src = slide.src;
        lightboxImg.alt = slide.alt;
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentSlides.length}`;
        prevBtn.style.visibility = currentIndex > 0 ? 'visible' : 'hidden';
        nextBtn.style.visibility = currentIndex < currentSlides.length - 1 ? 'visible' : 'hidden';
    };

    const showPrev = () => { if (currentIndex > 0) { currentIndex--; updateLightbox(); } };
    const showNext = () => { if (currentIndex < currentSlides.length - 1) { currentIndex++; updateLightbox(); } };

    // Rendre chaque slide cliquable
    document.querySelectorAll('.carousel-slide').forEach(slide => {
        slide.style.cursor = 'zoom-in';
        slide.addEventListener('click', () => {
            // Récupère toutes les slides du même carrousel
            const track  = slide.closest('.carousel-track');
            const slides = Array.from(track.querySelectorAll('.carousel-slide'));
            const index  = slides.indexOf(slide);
            openLightbox(slides, index);
        });
    });

    // Fermeture
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    // Navigation
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Clavier
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   showPrev();
        if (e.key === 'ArrowRight')  showNext();
    });

    // Swipe tactile sur la lightbox
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend',   e => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 50) { delta < 0 ? showNext() : showPrev(); }
    });
});
