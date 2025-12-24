/**
 * BookShelf - Interactive Book Reading Application
 * JavaScript functionality for navigation, animations, and interactivity
 */

// Login credentials
const VALID_USERNAME = 'Ojitos Bonitos';
const VALID_PASSWORD = '041024';

document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initNavigation();
    initSidebar();
    initBookClick();
    initReadButtons();
    initCarousel();
    initCalendar();
    initAnimations();
    registerServiceWorker();
});

/**
 * Register Service Worker for offline functionality
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker registrado:', registration.scope);
            })
            .catch((error) => {
                console.log('❌ Error al registrar Service Worker:', error);
            });
    }
}

/**
 * Login Functionality
 */
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');
    const loginError = document.getElementById('loginError');
    const loginBtn = document.querySelector('.login-btn');

    if (!loginForm) return;

    // Check if already logged in (session storage)
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        showApp();
        return;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Add loading state
        loginBtn.classList.add('loading');
        loginError.classList.remove('show');

        // Simulate verification delay
        setTimeout(() => {
            if (username === VALID_USERNAME && password === VALID_PASSWORD) {
                // Success - save to session and show app
                sessionStorage.setItem('isLoggedIn', 'true');
                loginScreen.classList.add('hidden');

                setTimeout(() => {
                    showApp();
                }, 500);
            } else {
                // Failed - show error
                loginBtn.classList.remove('loading');
                loginError.classList.add('show');

                // Shake the form
                loginForm.style.animation = 'none';
                setTimeout(() => {
                    loginForm.style.animation = '';
                }, 10);
            }
        }, 800);
    });

    function showApp() {
        loginScreen.style.display = 'none';
        appContainer.style.display = 'flex';
    }
}

/**
 * Sidebar Toggle Functionality
 */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const mainContent = document.querySelector('.main-content');
    const menuIcon = menuToggle?.querySelector('.menu-icon');
    const closeIcon = menuToggle?.querySelector('.close-icon');

    if (!sidebar || !menuToggle) return;

    // Don't initialize on mobile
    const isMobile = () => window.innerWidth <= 480;

    menuToggle.addEventListener('click', () => {
        if (isMobile()) return; // Don't toggle on mobile

        sidebar.classList.toggle('expanded');

        // Toggle icons
        if (sidebar.classList.contains('expanded')) {
            if (menuIcon) menuIcon.style.display = 'none';
            if (closeIcon) closeIcon.style.display = 'block';
            if (mainContent) mainContent.style.marginLeft = '200px';
        } else {
            if (menuIcon) menuIcon.style.display = 'block';
            if (closeIcon) closeIcon.style.display = 'none';
            if (mainContent) mainContent.style.marginLeft = '70px';
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (isMobile()) {
            sidebar.classList.remove('expanded');
            if (menuIcon) menuIcon.style.display = 'block';
            if (closeIcon) closeIcon.style.display = 'none';
            if (mainContent) mainContent.style.marginLeft = '0';
        } else if (!sidebar.classList.contains('expanded')) {
            if (mainContent) mainContent.style.marginLeft = '70px';
        }
    });
}

/**
 * Navigation Functionality
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const allPages = document.querySelectorAll('.page');

    // Page mapping for sidebar navigation
    const pageMap = {
        'home': ['page1', 'page2'],
        'library': 'libraryPage',
        'bookmarks': 'bookmarksPage',
        'settings': 'settingsPage'
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            const pageName = item.dataset.page;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Hide all pages
            allPages.forEach(page => page.classList.remove('active'));

            // Show the correct page(s)
            if (pageName === 'home') {
                // Show home dashboard (page1)
                const page1 = document.getElementById('page1');
                if (page1) page1.classList.add('active');
            } else {
                const targetPage = document.getElementById(pageMap[pageName]);
                if (targetPage) targetPage.classList.add('active');
            }

            // Add click animation
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    });
}

/**
 * Page Dots Navigation
 */
function initPageDots() {
    const dots = document.querySelectorAll('.dot');

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const pageNum = dot.dataset.page;
            switchPage(pageNum);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const activeDot = document.querySelector('.dot.active');
        const currentPage = parseInt(activeDot.dataset.page);

        if (e.key === 'ArrowRight' && currentPage < dots.length) {
            switchPage(currentPage + 1);
        } else if (e.key === 'ArrowLeft' && currentPage > 1) {
            switchPage(currentPage - 1);
        }
    });
}

/**
 * Switch between pages
 */
function switchPage(pageNum) {
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');

    if (pageNum === 1 || pageNum === '1') {
        if (page1) page1.classList.add('active');
        if (page2) page2.classList.remove('active');
    } else if (pageNum === 2 || pageNum === '2') {
        if (page1) page1.classList.remove('active');
        if (page2) page2.classList.add('active');
    }
}

/**
 * Initialize book click to open details
 */
function initBookClick() {
    const mainBookCard = document.getElementById('mainBookCard');

    if (mainBookCard) {
        mainBookCard.addEventListener('click', () => {
            // Add click animation
            mainBookCard.style.transform = 'scale(0.95)';
            setTimeout(() => {
                mainBookCard.style.transform = '';
                // Switch to page 2 (book details)
                switchPage(2);
            }, 150);
        });
    }

    // Christmas gift card click handler
    const christmasGiftCard = document.getElementById('christmasGiftCard');
    if (christmasGiftCard) {
        christmasGiftCard.addEventListener('click', () => {
            // Add click animation
            christmasGiftCard.style.transform = 'scale(0.95)';
            setTimeout(() => {
                christmasGiftCard.style.transform = '';
                // Hide all pages and show gift details
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('giftDetailsPage').classList.add('active');
            }, 150);
        });
    }

    // Also make books in library and bookmarks sections clickable
    const libraryBooks = document.querySelectorAll('.library-book-card');
    const bookmarkBooks = document.querySelectorAll('.bookmark-card');

    libraryBooks.forEach(book => {
        book.style.cursor = 'pointer';
        book.addEventListener('click', () => {
            // Navigate to home and show page 2
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-page="home"]')?.classList.add('active');

            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            switchPage(2);
        });
    });

    bookmarkBooks.forEach(book => {
        book.style.cursor = 'pointer';
        book.addEventListener('click', () => {
            // Navigate to home and show page 2
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-page="home"]')?.classList.add('active');

            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            switchPage(2);
        });
    });
}

/**
 * Book Carousel Functionality
 */
function initCarousel() {
    const carousel = document.querySelector('.books-carousel');
    if (!carousel) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStart = 0;
    let touchScrollLeft = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStart = e.touches[0].pageX;
        touchScrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('touchmove', (e) => {
        const touch = e.touches[0].pageX;
        const walk = (touchStart - touch) * 1.5;
        carousel.scrollLeft = touchScrollLeft + walk;
    });

    // Auto scroll indicator
    updateBookCounter();
    carousel.addEventListener('scroll', updateBookCounter);
}

/**
 * Update book counter based on scroll position
 */
function updateBookCounter() {
    const carousel = document.querySelector('.books-carousel');
    const counter = document.querySelector('.book-counter .current');
    if (!carousel || !counter) return;

    const scrollPercent = carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth);
    const totalBooks = 60;
    const currentBook = Math.ceil(scrollPercent * totalBooks) || 1;

    counter.textContent = currentBook.toString().padStart(2, '0');
}

/**
 * Calendar Functionality
 */
function initCalendar() {
    const days = document.querySelectorAll('.day');

    days.forEach(day => {
        day.addEventListener('click', () => {
            days.forEach(d => d.classList.remove('active'));
            day.classList.add('active');

            // Add selection feedback
            day.style.transform = 'scale(1.1)';
            setTimeout(() => {
                day.style.transform = '';
            }, 200);
        });
    });

    // Calendar navigation
    const navArrows = document.querySelectorAll('.calendar-nav .nav-arrow');
    navArrows.forEach((arrow, index) => {
        arrow.addEventListener('click', () => {
            animateCalendarNav(index === 0 ? 'prev' : 'next');
        });
    });
}

/**
 * Animate calendar navigation
 */
function animateCalendarNav(direction) {
    const calendarWeek = document.querySelector('.calendar-week');
    if (!calendarWeek) return;

    const offset = direction === 'prev' ? -10 : 10;
    calendarWeek.style.transform = `translateX(${offset}px)`;
    calendarWeek.style.opacity = '0.5';

    setTimeout(() => {
        calendarWeek.style.transform = '';
        calendarWeek.style.opacity = '';
    }, 200);
}

/**
 * Initialize Animations
 */
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.book-card, .author-card, .current-book-card, .friend-comment').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        animateOnScroll.observe(el);
    });

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideUp 0.6s ease forwards;
        }
        
        @keyframes slideUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Button hover effects
    initButtonEffects();

    // Book cover hover effects
    initBookHoverEffects();
}

/**
 * Button ripple and hover effects
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary');

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                left: ${x}px;
                top: ${y}px;
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Book cover 3D hover effects
 */
function initBookHoverEffects() {
    const bookCovers = document.querySelectorAll('.book-cover');

    bookCovers.forEach(cover => {
        cover.addEventListener('mousemove', (e) => {
            const rect = cover.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            cover.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        cover.addEventListener('mouseleave', () => {
            cover.style.transform = '';
        });
    });
}

/**
 * Search functionality
 */
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        filterBooks(query);
    }, 300));
}

/**
 * Filter books based on search query
 */
function filterBooks(query) {
    const bookCards = document.querySelectorAll('.book-card');

    bookCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || '';

        if (title.includes(query) || query === '') {
            card.style.display = '';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (!title.includes(document.querySelector('.search-bar input').value.toLowerCase())) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
}

/**
 * Debounce utility function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Arrow buttons navigation for author card
 */
const arrowBtns = document.querySelectorAll('.arrow-btn');
let currentAuthorIndex = 0;

const authors = [
    {
        name: 'George RR Martin',
        role: 'author',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
        bio: '"Fire and Blood" tells the story of the Targaryen dynasty in Westeros, chronicling the conquest of the Seven Kingdoms by House Targaryen. It also covers the Targaryen civil war known as the Dance of the Dragons.'
    },
    {
        name: 'J.K. Rowling',
        role: 'author',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
        bio: 'The Harry Potter series has captured the hearts of millions worldwide, taking readers on a magical journey through the wizarding world filled with adventure, friendship, and the eternal battle between good and evil.'
    },
    {
        name: 'C.S. Lewis',
        role: 'author',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        bio: 'The Chronicles of Narnia is a series of seven fantasy novels that transport readers to a magical world where animals talk, magic is real, and good always triumphs over evil in the end.'
    }
];

arrowBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('prev')) {
            currentAuthorIndex = (currentAuthorIndex - 1 + authors.length) % authors.length;
        } else {
            currentAuthorIndex = (currentAuthorIndex + 1) % authors.length;
        }
        updateAuthorCard(authors[currentAuthorIndex]);
    });
});

function updateAuthorCard(author) {
    const authorCard = document.querySelector('.author-card');
    if (!authorCard) return;

    const avatar = authorCard.querySelector('.author-avatar');
    const name = authorCard.querySelector('.author-info h3');
    const role = authorCard.querySelector('.author-info span');
    const bio = authorCard.querySelector('.author-bio');

    // Animate out
    authorCard.style.opacity = '0';
    authorCard.style.transform = 'translateX(20px)';

    setTimeout(() => {
        avatar.src = author.image;
        name.textContent = author.name;
        role.textContent = author.role;
        bio.textContent = author.bio;

        // Animate in
        authorCard.style.opacity = '1';
        authorCard.style.transform = 'translateX(0)';
    }, 200);
}

// Add transition styles for author card
const authorCard = document.querySelector('.author-card');
if (authorCard) {
    authorCard.style.transition = 'all 0.3s ease';
}

/**
 * Start reading button functionality
 */
const startReadingBtns = document.querySelectorAll('.btn-primary');
startReadingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Simulate starting to read
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="0">
                    <animate attributeName="stroke-dashoffset" dur="1s" values="0;120" repeatCount="indefinite"/>
                </circle>
            </svg>
            Loading...
        `;

        setTimeout(() => {
            btn.innerHTML = `
                Reading now...
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12l5 5L20 7"/>
                </svg>
            `;
            btn.style.backgroundColor = '#4CAF50';
        }, 1500);
    });
});

/**
 * Initialize read buttons to open PDF reader
 */
function initReadButtons() {
    // All "Start reading" and "Continue reading" buttons
    const readButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

    readButtons.forEach(btn => {
        const buttonText = btn.textContent.toLowerCase();
        if (buttonText.includes('leer') || buttonText.includes('reading')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Open the PDF reader (function from pdf-reader.js)
                if (typeof openReader === 'function') {
                    openReader();
                }
            });
        }
    });
}

console.log('📚 BookShelf App initialized successfully!');
