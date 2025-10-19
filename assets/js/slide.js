let slideIndex = 1;
// showSlides(slideIndex); // Commented out to prevent error

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    // Check if elements exist before accessing them
    if (slides.length === 0 || dots.length === 0) {
        console.log('No slides or dots found, skipping showSlides');
        return;
    }

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

// Scroll to specific panel function
function scrollToPanel(panelIndex) {
    console.log('scrollToPanel called with panelIndex:', panelIndex);

    const panels = document.querySelectorAll('.showcase-content-item');
    const dots = document.querySelectorAll('.panel-nav-dots .dot');

    console.log('Found panels:', panels.length, 'dots:', dots.length);

    if (panels.length === 0 || panelIndex >= panels.length) {
        console.error('Panel not found:', panelIndex);
        return;
    }

    const targetPanel = panels[panelIndex];
    const showcaseContent = document.querySelector('.showcase-content');

    if (!targetPanel || !showcaseContent) {
        console.error('Elements not found');
        return;
    }

    // Smooth scroll to the target panel
    targetPanel.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
    });

    // Update active dot
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === panelIndex);
        // Remove paused class when switching to new active dot
        if (index === panelIndex) {
            dot.classList.remove('paused');
        }
    });

    // Add translateX effect for panels 1 and 2 (desktop only)
    const showcaseGrid = document.querySelector('.showcase-grid');
    const isMobile = window.innerWidth <= 768;

    if (showcaseContent && !isMobile) {
        if (panelIndex === 1) {
            showcaseContent.style.transform = 'translateX(150px)';
            if (showcaseGrid) {
                showcaseGrid.style.marginLeft = '0';
            }
        } else if (panelIndex === 2) {
            showcaseContent.style.transform = 'translateX(300px)';
            if (showcaseGrid) {
                showcaseGrid.style.marginLeft = '0';
            }
        } else if (panelIndex === 3) {
            showcaseContent.style.transform = 'translateX(-50px)';
            if (showcaseGrid) {
                showcaseGrid.style.marginLeft = '0';
            }
        } else {
            showcaseContent.style.transform = 'translateX(0)';
            if (showcaseGrid) {
                showcaseGrid.style.marginLeft = '';
            }
        }
    } else if (showcaseContent && isMobile) {
        // Reset all transforms on mobile
        showcaseContent.style.transform = 'translateX(0)';
        if (showcaseGrid) {
            showcaseGrid.style.marginLeft = '';
        }
    }

    // Update current panel index for auto slide
    if (typeof currentPanelIndex !== 'undefined') {
        currentPanelIndex = panelIndex;
        console.log('Manual click - updated currentPanelIndex to:', currentPanelIndex);

        // Pause progress animation on manual click
        const activeDot = document.querySelector('.panel-nav-dots .dot.active');
        if (activeDot) {
            activeDot.classList.add('paused');
        }

        // Only stop auto slide if user clicks on the last panel (panel 3)
        if (panelIndex === 3) {
            userHasInteracted = true; // Mark that user has interacted
            console.log('User clicked last panel, stopping auto slide');

            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
                console.log('Auto slide stopped due to manual click on last panel');
            } else {
                console.log('No auto slide interval to stop');
            }
        } else {
            // If user clicks on panels 0-2, restart auto slide if it was stopped
            if (userHasInteracted && !autoSlideInterval) {
                console.log('User clicked panel', panelIndex, '- restarting auto slide');
                userHasInteracted = false; // Reset the flag
                setTimeout(() => {
                    startAutoSlide();
                }, 100);
            } else {
                console.log('User clicked panel', panelIndex, '- auto slide will continue');
            }
        }
    } else {
        console.log('currentPanelIndex is undefined - this is an auto slide call');
    }
}

// Global variables for auto slide
let currentPanelIndex = 0;
let autoSlideInterval;
let userHasInteracted = false;

// Global functions for auto slide
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        // Check if user has interacted before proceeding
        if (userHasInteracted) {
            console.log('User has interacted, stopping auto slide');
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
            return;
        }

        const panels = document.querySelectorAll('.showcase-content-item');
        if (panels.length === 0) return;

        // Move to next panel, loop back to 0 when reaching the end
        currentPanelIndex = (currentPanelIndex + 1) % panels.length;
        scrollToPanel(currentPanelIndex);

        console.log('Auto slide to panel:', currentPanelIndex, 'of', panels.length);
    }, 5000); // Auto slide every 5 seconds
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Simple scroll-based visibility for panel nav dots
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, setting up scroll listener');

    const showcaseSection = document.querySelector('.showcase');
    const panelNavDots = document.querySelector('.panel-nav-dots');

    if (!showcaseSection || !panelNavDots) {
        console.error('Showcase section or nav dots not found');
        return;
    }

    // Force show dots initially
    panelNavDots.style.display = 'flex';
    panelNavDots.style.opacity = '1';
    panelNavDots.style.visibility = 'visible';
    panelNavDots.style.position = 'fixed';
    panelNavDots.style.bottom = '20px';
    panelNavDots.style.left = '50%';
    panelNavDots.style.transform = 'translateX(-50%)';
    panelNavDots.style.zIndex = '99999';
    panelNavDots.style.width = '200px';
    panelNavDots.style.height = '50px';

    // Simple scroll listener
    function handleScroll() {
        const rect = showcaseSection.getBoundingClientRect();
        // More precise visibility check - dots should hide when showcase is completely out of view
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;


        // More specific condition: hide when showcase is mostly out of view
        const showcaseCenter = rect.top + (rect.height / 2);
        const shouldShow = showcaseCenter > 0 && showcaseCenter < window.innerHeight;


        if (shouldShow) {
            panelNavDots.style.opacity = '1';
            panelNavDots.style.display = 'flex';
            panelNavDots.style.visibility = 'visible';
        } else {
            panelNavDots.style.opacity = '0';
            panelNavDots.style.display = 'flex';
            panelNavDots.style.visibility = 'visible';
        }


    }

    // Initial check - removed, will be handled by handleScrollWithAutoSlide

    // Add scroll listener with throttling
    let scrollTimeout;
    function throttledScroll() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    }

    window.addEventListener('scroll', throttledScroll);

    // Auto slide functionality (functions already defined globally)

    // Start auto slide when showcase is visible
    function handleScrollWithAutoSlide() {
        handleScroll();

        const rect = showcaseSection.getBoundingClientRect();
        const showcaseCenter = rect.top + (rect.height / 2);
        const shouldShow = showcaseCenter > 0 && showcaseCenter < window.innerHeight;

        console.log('Scroll check - shouldShow:', shouldShow, 'autoSlideInterval:', !!autoSlideInterval, 'userHasInteracted:', userHasInteracted);

        if (shouldShow) {
            // Only start auto slide if user hasn't interacted yet
            if (!autoSlideInterval && !userHasInteracted) {
                console.log('Starting auto slide');
                startAutoSlide();
            }
        } else {
            if (autoSlideInterval) {
                console.log('Stopping auto slide');
                stopAutoSlide();
            }
        }
    }

    // Replace the scroll listener
    window.removeEventListener('scroll', throttledScroll);
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScrollWithAutoSlide, 10);
    });

    // Initialize auto slide on page load
    handleScrollWithAutoSlide();

});