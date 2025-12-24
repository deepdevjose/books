/**
 * PDF Book Reader Module
 * Handles PDF rendering, pagination, progress saving, and download
 */

// PDF.js worker configuration
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// Book configuration
const BOOK_CONFIG = {
    id: 'loQueViEnTusOjos',
    pdfPath: 'src/books/iseeyoureyes/iseeonyoureyes.pdf',
    title: 'Lo Que Vi En Tus Ojos'
};

// Reader state
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let isRendering = false;
let scale = 1.5;

/**
 * Initialize the PDF reader
 */
function initPDFReader() {
    const readerOverlay = document.getElementById('readerOverlay');
    const closeReader = document.getElementById('closeReader');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const downloadBtn = document.getElementById('downloadBook');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const pdfContainer = document.getElementById('pdfContainer');

    if (!readerOverlay) return;

    // Close reader
    closeReader?.addEventListener('click', closeReaderOverlay);

    // Navigation
    prevPageBtn?.addEventListener('click', goToPrevPage);
    nextPageBtn?.addEventListener('click', goToNextPage);

    // Download
    downloadBtn?.addEventListener('click', downloadBook);

    // Fullscreen
    fullscreenBtn?.addEventListener('click', toggleFullscreen);

    // Zoom controls
    zoomInBtn?.addEventListener('click', zoomIn);
    zoomOutBtn?.addEventListener('click', zoomOut);

    // Zoom lens on hover
    if (pdfContainer) {
        pdfContainer.addEventListener('mousemove', handleZoomLens);
        pdfContainer.addEventListener('mouseenter', showZoomLens);
        pdfContainer.addEventListener('mouseleave', hideZoomLens);
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);

    // Close on overlay click (but not on content)
    readerOverlay.addEventListener('click', (e) => {
        if (e.target === readerOverlay) {
            closeReaderOverlay();
        }
    });
}

/**
 * Open the PDF reader and load the book
 */
async function openReader() {
    const readerOverlay = document.getElementById('readerOverlay');

    // Show overlay
    readerOverlay.style.display = 'flex';
    setTimeout(() => {
        readerOverlay.classList.add('active');
    }, 10);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Load saved progress
    const savedProgress = loadProgress(BOOK_CONFIG.id);
    if (savedProgress) {
        currentPage = savedProgress.currentPage;
    } else {
        currentPage = 1;
    }

    // Load PDF
    await loadPDF();
}

/**
 * Close the PDF reader
 */
function closeReaderOverlay() {
    const readerOverlay = document.getElementById('readerOverlay');

    // Save progress before closing
    saveProgress(BOOK_CONFIG.id, currentPage, totalPages);

    // Update all UI progress indicators
    updateAllProgressUI();

    // Hide overlay with animation
    readerOverlay.classList.remove('active');
    setTimeout(() => {
        readerOverlay.style.display = 'none';
    }, 400);

    // Restore body scroll
    document.body.style.overflow = '';
}

/**
 * Load PDF document
 */
async function loadPDF() {
    try {
        const loadingTask = pdfjsLib.getDocument(BOOK_CONFIG.pdfPath);
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;

        // Update total pages display
        document.getElementById('totalPages').textContent = totalPages;

        // Validate current page is within bounds
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        // Render current page
        await renderPage(currentPage);

        // Update navigation buttons
        updateNavButtons();

    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error al cargar el libro. Por favor, recarga la página.');
    }
}

/**
 * Render a specific page
 */
async function renderPage(pageNum) {
    if (isRendering || !pdfDoc) return;
    isRendering = true;

    try {
        const page = await pdfDoc.getPage(pageNum);

        // Calculate scale to fit container - single page mode for maximum size
        const container = document.querySelector('.book-3d-container');
        const containerWidth = container?.offsetWidth || 800;
        const containerHeight = container?.offsetHeight || 600;

        const viewport = page.getViewport({ scale: 1 });

        // Calculate scale to fit the full available space (single page)
        const widthScale = (containerWidth - 40) / viewport.width;
        const heightScale = (containerHeight - 40) / viewport.height;
        scale = Math.min(widthScale, heightScale);

        const scaledViewport = page.getViewport({ scale });

        // Render to a single canvas with high DPI support
        const canvasLeft = document.getElementById('pdfCanvasLeft');
        const ctxLeft = canvasLeft.getContext('2d');

        // Use devicePixelRatio for sharp rendering on mobile/retina displays
        const pixelRatio = window.devicePixelRatio || 1;
        const outputScale = pixelRatio > 1 ? pixelRatio : 1.5; // Minimum 1.5x for quality

        // Set canvas size at higher resolution
        canvasLeft.width = Math.floor(scaledViewport.width * outputScale);
        canvasLeft.height = Math.floor(scaledViewport.height * outputScale);

        // Scale canvas display size via CSS
        canvasLeft.style.width = `${scaledViewport.width}px`;
        canvasLeft.style.height = `${scaledViewport.height}px`;

        // Scale context to match
        ctxLeft.scale(outputScale, outputScale);

        await page.render({
            canvasContext: ctxLeft,
            viewport: scaledViewport
        }).promise;

        // Hide the right page in single page mode
        document.getElementById('pageRight').style.display = 'none';

        // Update page number display
        document.getElementById('currentPageNum').textContent = pageNum;

        // Update progress
        updateReaderProgress();

        // Save progress
        saveProgress(BOOK_CONFIG.id, pageNum, totalPages);

    } catch (error) {
        console.error('Error rendering page:', error);
    }

    isRendering = false;
}

/**
 * Go to previous page
 */
async function goToPrevPage() {
    if (currentPage <= 1) return;

    // Page flip animation
    const pageLeft = document.getElementById('pageLeft');
    pageLeft.classList.add('flipping-right');

    setTimeout(async () => {
        pageLeft.classList.remove('flipping-right');
        currentPage -= 1; // Go back 1 page
        await renderPage(currentPage);
        updateNavButtons();
    }, 300);
}

/**
 * Go to next page
 */
async function goToNextPage() {
    if (currentPage >= totalPages) return;

    // Page flip animation
    const pageLeft = document.getElementById('pageLeft');
    pageLeft.classList.add('flipping-left');

    setTimeout(async () => {
        pageLeft.classList.remove('flipping-left');
        currentPage += 1; // Go forward 1 page
        await renderPage(currentPage);
        updateNavButtons();
    }, 300);
}

/**
 * Handle keyboard navigation
 */
function handleKeyNavigation(e) {
    const readerOverlay = document.getElementById('readerOverlay');
    if (!readerOverlay.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
        goToPrevPage();
    } else if (e.key === 'ArrowRight') {
        goToNextPage();
    } else if (e.key === 'Escape') {
        closeReaderOverlay();
    }
}

/**
 * Update navigation buttons state
 */
function updateNavButtons() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}

/**
 * Update reader progress bar (vertical in sidebar)
 */
function updateReaderProgress() {
    const progressFill = document.getElementById('progressFillReader');
    const progressPercent = document.getElementById('progressPercent');
    const currentPageNum2 = document.getElementById('currentPageNum2');
    const totalPages2 = document.getElementById('totalPages2');
    const zoomLevel = document.getElementById('zoomLevel');

    const percent = Math.round((currentPage / totalPages) * 100);

    // Update vertical progress bar (height instead of width)
    if (progressFill) progressFill.style.height = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${percent}%`;

    // Update sidebar page indicators
    if (currentPageNum2) currentPageNum2.textContent = currentPage;
    if (totalPages2) totalPages2.textContent = totalPages;

    // Update zoom level display
    if (zoomLevel) zoomLevel.textContent = `${Math.round(scale * 100)}%`;
}

/**
 * Save reading progress to localStorage
 */
function saveProgress(bookId, page, total) {
    const progress = {
        currentPage: page,
        totalPages: total,
        lastRead: new Date().toISOString(),
        percentComplete: Math.round((page / total) * 100)
    };

    localStorage.setItem(`bookProgress_${bookId}`, JSON.stringify(progress));
}

/**
 * Load reading progress from localStorage
 */
function loadProgress(bookId) {
    const saved = localStorage.getItem(`bookProgress_${bookId}`);
    return saved ? JSON.parse(saved) : null;
}

/**
 * Update all progress UI elements across the app
 */
function updateAllProgressUI() {
    const progress = loadProgress(BOOK_CONFIG.id);
    if (!progress) return;

    const percent = progress.percentComplete;
    const currentPageStr = progress.currentPage.toString();
    const totalPagesStr = progress.totalPages.toString();

    // Update library page progress bar
    const libraryProgressFill = document.querySelector('.library-book-card .progress-fill');
    const libraryProgressText = document.querySelector('.library-book-card .book-progress span');
    if (libraryProgressFill) {
        libraryProgressFill.style.width = `${percent}%`;
    }
    if (libraryProgressText) {
        libraryProgressText.textContent = `${percent}% completado`;
    }

    // Update page 2 (book details) progress
    const pagesRead = document.querySelector('.pages-read');
    const progressInfo = document.querySelector('.progress-info');
    if (pagesRead) {
        pagesRead.textContent = currentPageStr;
    }
    if (progressInfo) {
        const totalSpan = progressInfo.querySelector(':not(.pages-read)');
        if (progressInfo.innerHTML.includes('/ 300')) {
            progressInfo.innerHTML = `<span class="pages-read">${currentPageStr}</span> / ${totalPagesStr} páginas`;
        }
    }
}

/**
 * Download the PDF book
 */
function downloadBook() {
    const downloadBtn = document.getElementById('downloadBook');
    const downloadToast = document.getElementById('downloadToast');

    // Add downloading state
    downloadBtn.classList.add('downloading');

    // Create download link
    const link = document.createElement('a');
    link.href = BOOK_CONFIG.pdfPath;
    link.download = `${BOOK_CONFIG.title}.pdf`;

    // Simulate download delay for animation
    setTimeout(() => {
        link.click();

        // Remove downloading state
        downloadBtn.classList.remove('downloading');

        // Show success toast
        downloadToast.classList.add('show');

        setTimeout(() => {
            downloadToast.classList.remove('show');
        }, 3000);
    }, 1000);
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    const readerOverlay = document.getElementById('readerOverlay');

    if (!document.fullscreenElement) {
        readerOverlay.requestFullscreen().catch(err => {
            console.log('Fullscreen not supported:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

/**
 * Zoom in the PDF
 */
function zoomIn() {
    if (scale < 3) {
        scale += 0.25;
        renderPage(currentPage);
    }
}

/**
 * Zoom out the PDF
 */
function zoomOut() {
    if (scale > 0.5) {
        scale -= 0.25;
        renderPage(currentPage);
    }
}

/**
 * Show zoom lens
 */
function showZoomLens() {
    const zoomLens = document.getElementById('zoomLens');
    if (zoomLens) zoomLens.classList.add('active');
}

/**
 * Hide zoom lens
 */
function hideZoomLens() {
    const zoomLens = document.getElementById('zoomLens');
    if (zoomLens) zoomLens.classList.remove('active');
}

/**
 * Handle zoom lens movement
 */
function handleZoomLens(e) {
    const zoomLens = document.getElementById('zoomLens');
    const canvas = document.getElementById('pdfCanvasLeft');

    if (!zoomLens || !canvas) return;

    const container = document.getElementById('pdfContainer');
    const rect = container.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    // Position the lens
    const lensSize = 150;
    const x = e.clientX - rect.left - lensSize / 2;
    const y = e.clientY - rect.top - lensSize / 2;

    zoomLens.style.left = `${x}px`;
    zoomLens.style.top = `${y}px`;

    // Calculate zoom background
    const zoomFactor = 2;
    const bgX = (e.clientX - canvasRect.left) * zoomFactor;
    const bgY = (e.clientY - canvasRect.top) * zoomFactor;

    zoomLens.style.backgroundImage = `url(${canvas.toDataURL()})`;
    zoomLens.style.backgroundSize = `${canvas.width * zoomFactor}px ${canvas.height * zoomFactor}px`;
    zoomLens.style.backgroundPosition = `-${bgX - lensSize / 2}px -${bgY - lensSize / 2}px`;
}

/**
 * Initialize reader on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    initPDFReader();

    // Load saved progress on page load to update UI
    setTimeout(() => {
        updateAllProgressUI();
    }, 500);
});

// Export functions for use in main script
window.openReader = openReader;
window.closeReaderOverlay = closeReaderOverlay;
