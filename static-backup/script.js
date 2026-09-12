// Centralized Registration Link
const REGISTRATION_LINK = "YOUR_GOOGLE_FORM_LINK";

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Setup Registration Links
    const registerBtns = document.querySelectorAll('.register-btn');
    registerBtns.forEach(btn => {
        btn.href = REGISTRATION_LINK;
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
    });

    // 2. Hero Hand Animation Logic
    const hero = document.getElementById('hero');
    const robotHand = document.querySelector('.robot-hand');
    const humanHand = document.querySelector('.human-hand');
    const sparkle = document.querySelector('.sparkle');
    
    // Smooth scroll for nav anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', () => {
        if (!hero) return;
        
        const heroRect = hero.getBoundingClientRect();
        
        // Calculate progress (0 to 1) based on scrolling through the hero section
        // heroRect.top is 0 when hero is at top of screen.
        // It becomes negative as we scroll down.
        // We want animation to complete when the bottom of hero reaches bottom of viewport.
        const scrollableDistance = heroRect.height - window.innerHeight;
        
        // Avoid division by zero if hero isn't taller than viewport
        if (scrollableDistance <= 0) return;
        
        let progress = -heroRect.top / scrollableDistance;
        
        // Clamp progress between 0 and 1
        progress = Math.max(0, Math.min(1, progress));

        // Update hands position
        // When progress is 0, they are offscreen (e.g. left/right offset)
        // When progress is 1, they meet at center.
        // The container is display: flex, justify-content: center.
        // We use translateX relative to their initial absolute positions.
        
        // Let's assume viewport width is 100vw.
        // Start: Robot at left: -50vw, Human at right: -50vw
        // End: Move them inwards by ~45vw to meet in center.
        
        const moveDistance = 45; // vw
        
        robotHand.style.transform = `translateY(-50%) translateX(${progress * moveDistance}vw)`;
        humanHand.style.transform = `translateY(-50%) translateX(-${progress * moveDistance}vw)`;

        // Handle Sparkle Reveal
        if (progress > 0.9) {
            // progress from 0.9 to 1.0 -> map to 0.0 to 1.0 scale/opacity
            const sparkleProgress = (progress - 0.9) * 10;
            sparkle.style.opacity = Math.min(1, sparkleProgress);
            sparkle.style.transform = `translate(-50%, -50%) scale(${sparkleProgress})`;
        } else {
            sparkle.style.opacity = 0;
            sparkle.style.transform = `translate(-50%, -50%) scale(0)`;
        }
    });

    // 3. Rounds Progress Animation on Scroll
    const progressFills = document.querySelectorAll('.progress-bar .fill');
    
    // Set up Intersection Observer to trigger progress bars when visible
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of the bar is visible
    };

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const targetWidth = fill.getAttribute('data-width');
                // Apply the width to trigger CSS transition
                fill.style.width = targetWidth;
                // Unobserve after animating once
                observer.unobserve(fill);
            }
        });
    }, observerOptions);

    // Initialize progress bars to 0 and observe them
    progressFills.forEach(fill => {
        fill.style.width = '0%';
        progressObserver.observe(fill);
    });
});
