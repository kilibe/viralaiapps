// Basic test script without modules to check if clicking works
console.log('Basic test script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing basic test...');
    
    // Initialize row click handlers with fake data
    initializeRowClickHandlers();
    
    // Initialize dropdown functionality
    initializeDropdowns();
    
    // Initialize navigation
    initializeNavigation();
    
    console.log('Basic test initialization complete');
});

function initializeRowClickHandlers() {
    const rows = document.querySelectorAll('.clickable-row');
    console.log('Found', rows.length, 'clickable rows');
    
    // Fix empty entity IDs and set up click handlers
    rows.forEach((row, index) => {
        let entityId = row.dataset.entityId;
        let entityName = row.dataset.entityName;
        
        console.log(`Row ${index + 1}: ID="${entityId}", Name="${entityName}"`);
        
        // If entity ID is empty, generate one
        if (!entityId || entityId.trim() === '') {
            entityId = `entity-${index + 1}`;
            row.dataset.entityId = entityId;
            console.log(`Generated ID for row ${index + 1}: ${entityId}`);
        }
        
        // If entity name is empty, try to get it from the row content
        if (!entityName || entityName.trim() === '') {
            const nameElement = row.querySelector('.app-info strong');
            if (nameElement) {
                entityName = nameElement.textContent.trim();
                row.dataset.entityName = entityName;
                console.log(`Generated name for row ${index + 1}: ${entityName}`);
            }
        }
        
        console.log(`Setting up click handler for row ${index + 1}: "${entityName}"`);
        
        row.addEventListener('click', function(e) {
            e.preventDefault();
            const currentEntityId = this.dataset.entityId;
            const currentEntityName = this.dataset.entityName;
            console.log('Row clicked! ID:', currentEntityId, 'Name:', currentEntityName);
            
            if (currentEntityName) {
                console.log('Navigating to detail page...');
                const url = `detail-test.html?id=${encodeURIComponent(currentEntityId || 'unknown')}&name=${encodeURIComponent(currentEntityName)}`;
                console.log('Navigation URL:', url);
                window.location.href = url;
            } else {
                console.log('Missing entity name');
                alert('Row clicked but missing entity name!');
            }
        });
        
        // Add visual feedback
        row.style.cursor = 'pointer';
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8fafc';
            console.log('Hovering over:', this.dataset.entityName);
        });
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    console.log('All row click handlers set up successfully!');
}

function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    console.log('Found', dropdowns.length, 'dropdowns');
    
    dropdowns.forEach((dropdown, index) => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (btn && content) {
            console.log(`Setting up dropdown ${index + 1}`);
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Dropdown clicked!');
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                console.log('Dropdown toggled, active:', dropdown.classList.contains('active'));
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
}

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    console.log('Found', navItems.length, 'navigation items');
    
    navItems.forEach((item, index) => {
        console.log(`Setting up navigation item ${index + 1}:`, item.textContent);
        item.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigation clicked:', this.textContent);
            
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show alert for now
            alert(`Navigation to ${this.textContent} clicked! (This is a test)`);
        });
    });
    
    // Initialize emoji buttons with proper modal functionality like the original
    initializeEmojiButtons();
}

function initializeEmojiButtons() {
    const emojiButtons = document.querySelectorAll('.nav-icon');
    console.log('Found emoji buttons:', emojiButtons.length);
    
    emojiButtons.forEach((button, index) => {
        console.log(`Setting up click listener for emoji button ${index}:`, button.title);
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Emoji button clicked:', this.title);
            
            // Load content in modal based on the button's href
            const section = this.getAttribute('href').substring(1); // Remove the #
            showEmojiModal(section, this.title);
        });
    });
}

function showEmojiModal(section, title) {
    console.log(`Showing emoji modal for: ${section}`);
    
    // Create a modal overlay
    const existingModal = document.getElementById('emoji-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'emoji-modal';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    // Get the content based on section
    let modalContent = getModalContent(section, title);
    
    modalOverlay.innerHTML = `
        <div style="
            background: white;
            padding: 32px;
            border-radius: 12px;
            max-width: 600px;
            max-height: 80vh;
            margin: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            overflow-y: auto;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="margin: 0; color: #1f2937; font-size: 24px;">${title}</h2>
                <button onclick="document.getElementById('emoji-modal').remove()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6b7280;
                    padding: 4px;
                    line-height: 1;
                ">&times;</button>
            </div>
            ${modalContent}
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    // Close on background click
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
}

function getModalContent(section, title) {
    const modalContent = {
        cookie: {
            title: 'Cookie Settings',
            content: `
                <div class="cookie-settings">
                    <p class="cookie-intro">We use cookies to enhance your experience on Viral AI Apps. You can manage your cookie preferences below.</p>
                    
                    <div class="cookie-category">
                        <div class="cookie-header">
                            <div class="cookie-info">
                                <h3>Essential Cookies</h3>
                                <p>These cookies are necessary for the website to function and cannot be switched off.</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" checked disabled>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-header">
                            <div class="cookie-info">
                                <h3>Analytics Cookies</h3>
                                <p>These cookies help us understand how visitors interact with our website.</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="analyticsCookies">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-header">
                            <div class="cookie-info">
                                <h3>Functional Cookies</h3>
                                <p>These cookies enable enhanced functionality and personalization.</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="functionalCookies">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-header">
                            <div class="cookie-info">
                                <h3>Advertising Cookies</h3>
                                <p>These cookies may be set by our advertising partners to build a profile of your interests.</p>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="advertisingCookies">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="cookie-actions">
                        <button class="btn btn-secondary" onclick="testRejectAllCookies()">Reject All</button>
                        <button class="btn btn-primary" onclick="testAcceptAllCookies()">Accept All</button>
                        <button class="btn btn-primary" onclick="testSaveCookiePreferences()">Save Preferences</button>
                    </div>
                    
                    <div class="cookie-policy-link">
                        <p>For more information, please read our full <a href="#" onclick="alert('Full cookie policy would open here')">Cookie Policy</a></p>
                    </div>
                </div>
            `
        },
        legal: {
            title: 'Legal Information',
            content: `
                <div class="legal-content">
                    <h3>Terms of Service</h3>
                    <p class="policy-date">Last updated: January 2025</p>
                    
                    <h4>1. Acceptance of Terms</h4>
                    <p>By accessing and using Viral AI Apps ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use this service.</p>
                    
                    <h4>2. Use License</h4>
                    <p>Permission is granted to temporarily access the materials on Viral AI Apps for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                    <ul>
                        <li>modify or copy the materials</li>
                        <li>use the materials for any commercial purpose or for any public display</li>
                        <li>attempt to decompile or reverse engineer any software contained on the website</li>
                        <li>remove any copyright or other proprietary notations from the materials</li>
                    </ul>
                    
                    <h4>3. Disclaimer</h4>
                    <p>The materials on Viral AI Apps are provided on an 'as is' basis. Viral AI Apps makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    
                    <h4>4. Contact Information</h4>
                    <p>If you have any questions about these Terms of Service, please contact us at:</p>
                    <p><strong>Email:</strong> kate@ihaveamy.ai<br>
                    <strong>Website:</strong> viralaiapps.com</p>
                </div>
            `
        },
        contact: {
            title: 'Contact Us',
            content: `
                <div class="contact-form">
                    <p class="contact-intro">We'd love to hear from you! Share your feedback, suggestions, or questions with us.</p>
                    
                    <form id="contactForm" class="contact-form-fields">
                        <div class="form-group">
                            <label for="feedback">Your Feedback</label>
                            <textarea 
                                id="feedback" 
                                name="feedback" 
                                placeholder="Tell us what you think about Viral AI Apps, suggest new features, report issues, or ask questions..."
                                rows="6"
                                required
                            ></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Your Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="your.email@example.com"
                                required
                            />
                            <small class="form-help">We'll use this to respond to your message</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="name">Your Name (Optional)</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                placeholder="Your name"
                            />
                        </div>
                        
                        <button type="button" onclick="alert('Message sent! Thank you for your feedback.')" class="btn btn-primary contact-submit">
                            Send Message
                        </button>
                    </form>
                    
                    <div class="contact-alternative">
                        <h4>Other Ways to Reach Us</h4>
                        <p><strong>Email:</strong> <a href="mailto:kate@ihaveamy.ai">kate@ihaveamy.ai</a></p>
                        <p><strong>Response Time:</strong> We typically respond within 24-48 hours</p>
                    </div>
                </div>
            `
        },
        settings: {
            title: 'Account & Settings',
            content: `
                <div class="settings-content">
                    <!-- Login Section -->
                    <div class="login-section" id="loginSection">
                        <div class="login-header">
                            <h3>Sign In to Your Account</h3>
                            <p>Sign in to save your preferences, track your favorite AI apps, and get personalized recommendations.</p>
                        </div>
                        
                        <div class="login-options">
                            <button class="google-login-btn" onclick="alert('Google login would connect here')">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continue with Google
                            </button>
                            
                            <div class="divider">
                                <span>or</span>
                            </div>
                            
                            <form class="email-login-form">
                                <div class="form-group">
                                    <label for="loginEmail">Email</label>
                                    <input type="email" id="loginEmail" name="email" placeholder="your.email@example.com" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="loginPassword">Password</label>
                                    <input type="password" id="loginPassword" name="password" placeholder="Enter your password" required>
                                </div>
                                
                                <button type="button" onclick="alert('Login functionality would work here')" class="btn btn-primary login-submit">
                                    Sign In
                                </button>
                            </form>
                            
                            <div class="login-footer">
                                <p>Don't have an account? <a href="#" onclick="alert('Signup form would show here')">Sign up here</a></p>
                                <p><a href="#" onclick="alert('Password reset would work here')">Forgot your password?</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    };
    
    if (modalContent[section.toLowerCase()]) {
        return modalContent[section.toLowerCase()].content;
    } else {
        return `<div style="color: #6b7280; line-height: 1.6;"><p>Content for ${section} is coming soon!</p></div>`;
    }
}

// Cookie preference functions for the test environment
window.testAcceptAllCookies = function() {
    document.getElementById('analyticsCookies').checked = true;
    document.getElementById('functionalCookies').checked = true;
    document.getElementById('advertisingCookies').checked = true;
    alert('All cookies accepted! Preferences saved.');
};

window.testRejectAllCookies = function() {
    document.getElementById('analyticsCookies').checked = false;
    document.getElementById('functionalCookies').checked = false;
    document.getElementById('advertisingCookies').checked = false;
    alert('Non-essential cookies rejected! Preferences saved.');
};

window.testSaveCookiePreferences = function() {
    alert('Cookie preferences saved!');
};