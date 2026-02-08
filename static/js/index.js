window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Tab switching for benchmark tables
function switchTab(tabName) {
    // Hide all tables
    document.getElementById('hop-success-table').style.display = 'none';
    document.getElementById('task-success-table').style.display = 'none';
    
    // Remove active class from all tabs
    document.querySelectorAll('.tabs li').forEach(li => li.classList.remove('is-active'));
    
    // Show selected table and activate corresponding tab
    if (tabName === 'hop-success') {
        document.getElementById('hop-success-table').style.display = 'block';
        document.querySelectorAll('.tabs li')[0].classList.add('is-active');
    } else if (tabName === 'task-success') {
        document.getElementById('task-success-table').style.display = 'block';
        document.querySelectorAll('.tabs li')[1].classList.add('is-active');
    }
}

// Simple table sorting function
function sortTable(columnIndex) {
    const table = document.querySelector('#hop-success-table table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Toggle sort direction
    const isAscending = !table.dataset.sortAscending || table.dataset.sortColumn != columnIndex;
    table.dataset.sortAscending = isAscending;
    table.dataset.sortColumn = columnIndex;
    
    // Sort rows based on column content
    rows.sort((a, b) => {
        let aText = a.cells[columnIndex].textContent.trim();
        let bText = b.cells[columnIndex].textContent.trim();
        
        // Handle numeric values
        if (columnIndex === 3) { // Average Perf. column
            aText = parseFloat(aText) || 0;
            bText = parseFloat(bText) || 0;
        } else {
            aText = aText.toLowerCase();
            bText = bText.toLowerCase();
        }
        
        if (aText < bText) return isAscending ? -1 : 1;
        if (aText > bText) return isAscending ? 1 : -1;
        return 0;
    });
    
    // Reorder rows in DOM
    rows.forEach(row => tbody.appendChild(row));
}

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

    // Setup performance table color bars
    setupPerformanceColorBars();
    
    // Initialize trajectory tabs visibility
    initializeTrajectoryTabs();
})

// Initialize trajectory tabs visibility
function initializeTrajectoryTabs() {
    console.log('Initializing trajectory tabs...');
    
    // 1. First, hide all trajectory containers
    const allTrajectories = document.querySelectorAll('.trajectory-container');
    allTrajectories.forEach(function(container) {
        container.style.display = 'none';
        console.log('Hiding:', container.id);
    });
    
    // 2. Show only the service trajectory (first tab) by default
    const serviceTrajectory = document.getElementById('service-trajectory');
    if (serviceTrajectory) {
        serviceTrajectory.style.display = 'block';
        console.log('Showing:', serviceTrajectory.id);
    }
    
    // 3. Ensure the first tab is marked as active
    const firstTab = document.querySelector('.tabs li:first-child');
    if (firstTab) {
        firstTab.classList.add('is-active');
        console.log('Activated first tab');
    }
}

// Function to set up performance color bars
function setupPerformanceColorBars() {
    const performanceCells = document.querySelectorAll('.performance-cell');
    
    performanceCells.forEach((cell, index) => {
        const value = parseFloat(cell.dataset.value);
        
        // Find which column this cell belongs to by looking at the table structure
        const table = cell.closest('table');
        const row = cell.closest('tr');
        const cellIndex = Array.from(row.cells).indexOf(cell.closest('td'));
        
        // Determine column type based on position
        let baseColor;
        if (cellIndex === 1 || cellIndex === 2) {
            // MMInA columns (Wiki, Shop)
            baseColor = '#cdb4db'; // Light purple
        } else if (cellIndex >= 3 && cellIndex <= 6) {
            // Mind2Web columns (Shop, Travel, Info, Service)
            baseColor = '#ffe5d9'; // Light pink
        } else if (cellIndex === 7) {
            // WebVoyager column (Overall)
            baseColor = '#fffed5'; // Light yellow
        } else if (cellIndex === 8) {
            // Average column
            baseColor = '#d8e2dc'; // Light green
        } else {
            baseColor = '#9e9e9e'; // Default gray
        }
        
        // Set the bar width based on value (scaled to 0-100%)
        const maxValue = 60;
        const barWidth = Math.min((value / maxValue) * 100, 100);
        
        // Set the background gradient directly
        cell.style.background = `linear-gradient(to right, ${baseColor} 0%, ${baseColor} ${barWidth}%, #f5f5f5 ${barWidth}%, #f5f5f5 100%)`;
    });
}

// Function to switch between trajectory tabs
function switchTrajectory(trajectoryType) {
    
    // Hide all trajectory containers
    const trajectoryIds = [
        'service-trajectory',
        'shopping-trajectory', 
        'travel-trajectory',
        'health-trajectory',
        'education-trajectory',
        'entertainment-trajectory',
        'government-trajectory',
        'academic-trajectory',
        'information-trajectory',
        'transportation-trajectory'
    ];
    
    trajectoryIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Remove active class from all trajectory tabs
    document.querySelectorAll('.tabs li').forEach(li => li.classList.remove('is-active'));
    
    // Show selected trajectory and activate corresponding tab
    const trajectoryMap = {
        'Service': { id: 'service-trajectory', tabIndex: 0 },
        'Shopping': { id: 'shopping-trajectory', tabIndex: 1 },
        'Travel': { id: 'travel-trajectory', tabIndex: 2 },
        'Health': { id: 'health-trajectory', tabIndex: 3 },
        'Education': { id: 'education-trajectory', tabIndex: 4 },
        'Entertainment': { id: 'entertainment-trajectory', tabIndex: 5 },
        'Government': { id: 'government-trajectory', tabIndex: 6 },
        'Academic': { id: 'academic-trajectory', tabIndex: 7 },
        'Information': { id: 'information-trajectory', tabIndex: 8 },
        'Transportation': { id: 'transportation-trajectory', tabIndex: 9 }
    };
    
    const selectedTrajectory = trajectoryMap[trajectoryType];
    if (selectedTrajectory) {
        const element = document.getElementById(selectedTrajectory.id);
        if (element) {
            element.style.display = 'block';
        }
        
        // Activate corresponding tab
        const tabElement = document.querySelectorAll('.tabs li')[selectedTrajectory.tabIndex];
        if (tabElement) {
            tabElement.classList.add('is-active');
        }
    }
}
