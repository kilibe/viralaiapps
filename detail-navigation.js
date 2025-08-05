// Detail page navigation handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('Detail page navigation initialized');
    
    // Handle navigation clicks on detail pages
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.textContent.toLowerCase();
            const baseUrl = '../index.html';
            
            // Navigate to the main page with the appropriate section
            switch(section) {
                case 'startups':
                    window.location.href = baseUrl;
                    break;
                case 'unicorns':
                    window.location.href = baseUrl + '#unicorns';
                    break;
                case 'tracking':
                    window.location.href = baseUrl + '#tracking';
                    break;
                case 'reports':
                    window.location.href = baseUrl + '#reports';
                    break;
                case 'api':
                    window.location.href = baseUrl + '#api';
                    break;
                default:
                    window.location.href = baseUrl;
            }
        });
    });
    
    // Handle bottom navigation icons
    const navIcons = document.querySelectorAll('.nav-icon');
    navIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.getAttribute('href').substring(1);
            
            // Use the parent modal functions if available
            if (window.parent && window.parent.showEmojiModal) {
                window.parent.showEmojiModal(section, this.title);
            } else {
                // Show modal directly
                showDetailPageModal(section, this.title);
            }
        });
    });
});

// Modal functionality for detail pages
function showDetailPageModal(section, title) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    
    if (!modalOverlay || !modalBody) {
        // Create modal if it doesn't exist
        createModalStructure();
        return showDetailPageModal(section, title);
    }
    
    // Get content based on section
    let modalContent = '';
    
    switch(section.toLowerCase()) {
        case 'cookie':
            modalContent = getCookieContent();
            break;
        case 'legal':
            modalContent = getLegalContent();
            break;
        case 'contact':
            modalContent = getContactContent();
            break;
        case 'settings':
            modalContent = getSettingsContent();
            break;
    }
    
    // Set modal content
    modalBody.innerHTML = modalContent;
    
    // Show modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function createModalStructure() {
    const modalHTML = `
        <div id="modalOverlay" class="modal-overlay">
            <div class="modal-content">
                <button id="modalClose" class="modal-close">&times;</button>
                <div id="modalBody" class="modal-body">
                    <!-- Modal content will be loaded here dynamically -->
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize close functionality
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    
    modalClose.addEventListener('click', closeDetailModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeDetailModal();
        }
    });
}

function closeDetailModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Basic modal content functions
function getCookieContent() {
    return `
        <h2>Cookie Preferences</h2>
        <p>We use cookies to enhance your browsing experience. For more information, please visit our main page to manage your cookie preferences.</p>
    `;
}

function getLegalContent() {
    return `
        <h2>Legal Information</h2>
        <p>For complete Terms of Service and Privacy Policy, please visit our main page.</p>
    `;
}

function getContactContent() {
    return `
        <h2>Contact Us</h2>
        <p>Email: Jack@IHaveMy.ai</p>
        <p>For detailed contact form, please visit our main page.</p>
    `;
}

function getSettingsContent() {
    return `
        <h2>Settings</h2>
        <p>Please visit our main page to access account settings and preferences.</p>
    `;
}
