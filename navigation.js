// Standalone navigation script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Navigation script loaded');
    initializeNavigation();
    initializeEmojiButtons();
    initializeModalClose();
});

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    console.log('Found navigation items:', navItems.length);
    
    if (navItems.length === 0) {
        console.error('No navigation items found!');
        return;
    }
    
    navItems.forEach((item, index) => {
        console.log(`Setting up click listener for item ${index}:`, item.textContent);
        item.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigation clicked:', this.textContent);
            
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Load content based on selection
            loadContent(this.textContent);
        });
    });
}

function loadContent(section) {
    console.log(`Loading content for: ${section}`);
    
    // Update page header based on selected section
    const pageHeader = document.querySelector('.page-header h1');
    const pageDescription = document.querySelector('.page-header p');
    
    // Show/hide appropriate content
    const filtersSection = document.querySelector('.filters-section');
    const tableContainer = document.querySelector('.table-container');
    
    // Clear any custom content first
    clearCustomContent();
    
    switch(section.toLowerCase()) {
        case 'tracking':
            pageHeader.textContent = 'Tracking';
            if (pageDescription) {
                pageDescription.textContent = 'Track your favorite AI applications and their growth metrics';
            }
            filtersSection.style.display = 'none';
            tableContainer.style.display = 'none';
            showTrackingContent();
            break;
        case 'startups':
            pageHeader.textContent = 'Viral AI Apps & Startups';
            if (pageDescription) {
                pageDescription.textContent = 'Comprehensive list of AI startups and emerging companies';
            }
            filtersSection.style.display = 'block';
            tableContainer.style.display = 'block';
            // Reload data if needed
            if (window.allEntities && window.allEntities.length > 0) {
                window.applyFilters();
            }
            break;
        case 'unicorns':
            pageHeader.textContent = 'AI Unicorns';
            if (pageDescription) {
                pageDescription.textContent = 'Billion-dollar AI companies leading the industry';
            }
            filtersSection.style.display = 'block';
            tableContainer.style.display = 'block';
            // Apply unicorn filter
            if (window.currentFilters) {
                window.currentFilters.minFunding = 1000000000; // 1B+ funding
                if (window.applyFilters) {
                    window.applyFilters();
                }
            }
            break;
        case 'reports':
            pageHeader.textContent = 'Viral AI Apps Weekly Reports';
            if (pageDescription) {
                pageDescription.textContent = 'Weekly insights on viral AI trends.';
            }
            filtersSection.style.display = 'none';
            tableContainer.style.display = 'none';
            showReportsContent();
            break;
        case 'api':
            pageHeader.textContent = 'API Documentation';
            if (pageDescription) {
                pageDescription.textContent = 'Access our data programmatically with our REST API';
            }
            filtersSection.style.display = 'none';
            tableContainer.style.display = 'none';
            showApiContent();
            break;
    }
}

function clearCustomContent() {
    const customContent = document.querySelector('.custom-content');
    if (customContent) {
        customContent.remove();
    }
}

function showTrackingContent() {
    const mainContent = document.querySelector('.main-content');
    const customContent = document.createElement('div');
    customContent.className = 'custom-content';
    customContent.innerHTML = `
        <div class="coming-soon" style="text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 12px; margin-top: 20px;">
            <h2 style="color: #2d3748; margin-bottom: 16px;">🎯 Personal Tracking Dashboard</h2>
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">Track your favorite AI applications and get notified when they reach key milestones.</p>
            <p style="color: #718096; font-size: 14px;">Coming Soon - Stay Tuned!</p>
        </div>
    `;
    mainContent.appendChild(customContent);
}

function showReportsContent() {
    const mainContent = document.querySelector('.main-content');
    const customContent = document.createElement('div');
    customContent.className = 'custom-content';
    customContent.innerHTML = `
        <div class="coming-soon" style="text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 12px; margin-top: 20px;">
            <h2 style="color: #2d3748; margin-bottom: 16px;">📊 Viral AI Apps Weekly Reports</h2>
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">In-depth weekly analysis of viral AI trends, funding rounds, and industry insights.</p>
            <p style="color: #718096; font-size: 14px;">Coming Soon - Stay Tuned!</p>
        </div>
    `;
    mainContent.appendChild(customContent);
}

function showApiContent() {
    const mainContent = document.querySelector('.main-content');
    const customContent = document.createElement('div');
    customContent.className = 'custom-content';
    customContent.innerHTML = `
        <div class="coming-soon" style="text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 12px; margin-top: 20px;">
            <h2 style="color: #2d3748; margin-bottom: 16px;">🚀 API Documentation</h2>
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">Access our comprehensive AI startup database programmatically with our REST API.</p>
            <p style="color: #718096; font-size: 14px;">Coming Soon - Stay Tuned!</p>
        </div>
    `;
    mainContent.appendChild(customContent);
}

function initializeEmojiButtons() {
    const emojiButtons = document.querySelectorAll('.nav-icon');
    console.log('Found emoji buttons:', emojiButtons.length);
    
    if (emojiButtons.length === 0) {
        console.error('No emoji buttons found!');
        return;
    }
    
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
    
    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    
    // Get the content based on section
    let modalContent = '';
    
    switch(section.toLowerCase()) {
        case 'cookie':
            modalContent = getCookieModalContent();
            break;
        case 'legal':
            modalContent = getLegalModalContent();
            break;
        case 'contact':
            modalContent = getContactModalContent();
            break;
        case 'settings':
            modalContent = getSettingsModalContent();
            break;
    }
    
    // Set modal content
    modalBody.innerHTML = modalContent;
    
    // Show modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function getCookieModalContent() {
    return `
        <div class="modal-header" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #2d3748; margin: 0; display: flex; align-items: center; gap: 8px;">
                🍪 Cookie Settings
            </h2>
            <p style="color: #4a5568; font-size: 14px; margin: 8px 0 0 0;">We use cookies to improve your experience. Choose which cookies you'd like to allow.</p>
        </div>
        <div class="cookie-content">
            <div style="margin-bottom: 24px;">
                <div class="cookie-category" style="margin-bottom: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h3 style="color: #2d3748; margin: 0; font-size: 16px;">Essential Cookies</h3>
                        <div class="toggle-switch disabled" style="width: 50px; height: 26px; background: #4CAF50; border-radius: 13px; position: relative; cursor: not-allowed;">
                            <div style="position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.3s;"></div>
                        </div>
                    </div>
                    <p style="color: #4a5568; font-size: 14px; margin: 0;">Required for the website to function properly. Cannot be disabled.</p>
                </div>
                
                <div class="cookie-category" style="margin-bottom: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h3 style="color: #2d3748; margin: 0; font-size: 16px;">Analytics Cookies</h3>
                        <div class="toggle-switch" onclick="toggleCookie('analytics', this)" style="width: 50px; height: 26px; background: #4CAF50; border-radius: 13px; position: relative; cursor: pointer;">
                            <div style="position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.3s;"></div>
                        </div>
                    </div>
                    <p style="color: #4a5568; font-size: 14px; margin: 0;">Help us understand how visitors use our website.</p>
                </div>
                
                <div class="cookie-category" style="margin-bottom: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h3 style="color: #2d3748; margin: 0; font-size: 16px;">Marketing Cookies</h3>
                        <div class="toggle-switch" onclick="toggleCookie('marketing', this)" style="width: 50px; height: 26px; background: #ccc; border-radius: 13px; position: relative; cursor: pointer;">
                            <div style="position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.3s;"></div>
                        </div>
                    </div>
                    <p style="color: #4a5568; font-size: 14px; margin: 0;">Used to deliver personalized advertisements.</p>
                </div>
                
                <div class="cookie-category" style="margin-bottom: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h3 style="color: #2d3748; margin: 0; font-size: 16px;">Functional Cookies</h3>
                        <div class="toggle-switch" onclick="toggleCookie('functional', this)" style="width: 50px; height: 26px; background: #4CAF50; border-radius: 13px; position: relative; cursor: pointer;">
                            <div style="position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.3s;"></div>
                        </div>
                    </div>
                    <p style="color: #4a5568; font-size: 14px; margin: 0;">Enable enhanced functionality and personalization.</p>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <button onclick="rejectAllCookies()" style="padding: 10px 20px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; font-size: 14px; cursor: pointer;">Reject All</button>
                <button onclick="acceptSelectedCookies()" style="padding: 10px 20px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; font-size: 14px; cursor: pointer;">Save Preferences</button>
                <button onclick="acceptAllCookies()" style="padding: 10px 20px; background: #FF4500; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">Accept All</button>
            </div>
        </div>
    `;
}

function getLegalModalContent() {
    return `
        <div class="modal-header" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #2d3748; margin: 0; display: flex; align-items: center; gap: 8px;">
                ⚖️ Terms of Service & Privacy Policy
            </h2>
            <p style="color: #4a5568; font-size: 14px; margin: 8px 0 0 0;">Legal terms and conditions for using Viral AI Apps</p>
        </div>
        <div class="legal-content" style="max-height: 60vh; overflow-y: auto; padding-right: 8px;">
            <div style="margin-bottom: 24px;">
                <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">Last updated: January 29, 2025</p>
                <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">Welcome to Viral AI Apps ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website and services located at viralaiapps.com (the "Service") operated by Viral AI Apps.</p>
            </div>

            <h3 style="color: #2d3748; margin-bottom: 16px; border-bottom: 2px solid #FF4500; padding-bottom: 8px;">1. Acceptance of Terms</h3>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

            <h3 style="color: #2d3748; margin-bottom: 16px; border-bottom: 2px solid #FF4500; padding-bottom: 8px;">2. Description of Service</h3>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 12px;">Viral AI Apps provides:</p>
            <ul style="color: #4a5568; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
                <li>A comprehensive directory of AI startups and applications</li>
                <li>Growth metrics, funding data, and trend analysis</li>
                <li>Weekly reports on viral AI trends</li>
                <li>API access for developers (where available)</li>
                <li>Company profiles and detailed analytics</li>
            </ul>

            <h3 style="color: #2d3748; margin-bottom: 16px; border-bottom: 2px solid #FF4500; padding-bottom: 8px;">3. User Responsibilities</h3>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 12px;">You agree to:</p>
            <ul style="color: #4a5568; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
                <li>Use the service only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to any portion of the service</li>
                <li>Not use automated systems to scrape or harvest data</li>
                <li>Respect intellectual property rights</li>
                <li>Not interfere with or disrupt the service or servers</li>
            </ul>

            <h3 style="color: #2d3748; margin-bottom: 16px; border-bottom: 2px solid #FF4500; padding-bottom: 8px;">4. Data Accuracy and Liability</h3>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 12px;">While we strive to provide accurate and up-to-date information:</p>
            <ul style="color: #4a5568; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
                <li>All data is provided "as is" without warranties</li>
                <li>We do not guarantee the accuracy or completeness of information</li>
                <li>Users should verify critical information independently</li>
                <li>We are not liable for decisions made based on our data</li>
            </ul>

            <h3 style="color: #2d3748; margin-bottom: 16px; border-bottom: 2px solid #FF4500; padding-bottom: 8px;">5. Privacy Policy</h3>
            <h4 style="color: #2d3748; margin-bottom: 12px; margin-top: 16px;">Information We Collect</h4>
            <ul style="color: #4a5568; line-height: 1.6; margin-bottom: 16px; padding-left: 20px;">
                <li><strong>Analytics Data:</strong> Page views, time spent, user interactions</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                <li><strong>Cookies:</strong> Essential, functional, analytics, and marketing cookies</li>
                <li><strong>Contact Information:</strong> Email address if you contact us</li>
            </ul>

            <h4 style="color: #2d3748; margin-bottom: 12px; margin-top: 16px;">How We Use Information</h4>
            <ul style="color: #4a5568; line-height: 1.6; margin-bottom: 16px; padding-left: 20px;">
                <li>To provide and improve our services</li>
                <li>To analyze usage patterns and trends</li>
                <li>To send periodic newsletters (with consent)</li>
                <li>To respond to inquiries and support requests</li>
                <li>To comply with legal obligations</li>
            </ul>

            <h4 style="color: #2d3748; margin-bottom: 12px; margin-top: 16px;">Data Sharing</h4>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">We do not sell, trade, or transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>

            <h3 style="color: #2d3748; margin-bottom: 16px; border-bottom: 2px solid #FF4500; padding-bottom: 8px;">6. Intellectual Property</h3>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and other proprietary laws. Copying, redistribution, or publication of any part of this site is strictly prohibited without written permission.</p>

            <h3 style="color: #2d3748; margin-bottom: 16px; border-bottom: 2px solid #FF4500; padding-bottom: 8px;">7. API Terms</h3>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 12px;">When our API becomes available:</p>
            <ul style="color: #4a5568; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
                <li>Rate limits will apply to all API requests</li>
                <li>Commercial use may require a paid subscription</li>
                <li>API keys must be kept secure and not shared</li>
                <li>We reserve the right to suspend access for violations</li>
            </ul>

            <h3 style="color: #2d3748; margin-bottom: 16px; border-bottom: 2px solid #FF4500; padding-bottom: 8px;">8. Limitation of Liability</h3>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">In no event shall Viral AI Apps be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.</p>

            <h3 style="color: #2d3748; margin-bottom: 16px; border-bottom: 2px solid #FF4500; padding-bottom: 8px;">9. Modifications to Terms</h3>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Your continued use of the service after changes constitutes acceptance of the new terms.</p>

            <h3 style="color: #2d3748; margin-bottom: 16px; border-bottom: 2px solid #FF4500; padding-bottom: 8px;">10. Contact Information</h3>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 12px;">For questions about these Terms or our Privacy Policy, contact us at:</p>
            <ul style="color: #4a5568; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
                <li><strong>Email:</strong> Jack@IHaveMy.ai</li>
                <li><strong>Website:</strong> viralaiapps.com</li>
            </ul>

            <div style="margin-top: 24px; padding: 16px; background: #fff5f5; border-radius: 8px; border-left: 4px solid #FF4500;">
                <p style="color: #4a5568; margin: 0; font-size: 14px;"><strong>Effective Date:</strong> January 29, 2025<br><strong>Version:</strong> 1.0</p>
            </div>
        </div>
    `;
}

function getContactModalContent() {
    return `
        <div class="modal-header" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #2d3748; margin: 0; display: flex; align-items: center; gap: 8px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #374151;">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
                Contact Us
            </h2>
            <p style="color: #4a5568; font-size: 14px; margin: 8px 0 0 0;">Send us your feedback, questions, or feature requests</p>
        </div>
        <div class="contact-content">
            <form id="contactForm" style="display: flex; flex-direction: column; gap: 8px;">
                <div class="form-group">
                    <label style="display: block; color: #2d3748; font-weight: 500; margin-bottom: 8px;">Your Message *</label>
                    <textarea 
                        id="feedbackMessage" 
                        placeholder="Tell us about your feedback, questions, feature requests, or any issues you've encountered..."
                        style="width: 100%; min-height: 120px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-family: inherit; font-size: 14px; line-height: 1.5; resize: vertical; box-sizing: border-box;"
                        required
                    ></textarea>
                </div>
                
                <div class="form-group">
                    <label style="display: block; color: #2d3748; font-weight: 500; margin-bottom: 8px;">Your Email *</label>
                    <input 
                        type="email" 
                        id="replyEmail" 
                        placeholder="your.email@example.com"
                        style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-family: inherit; font-size: 14px; box-sizing: border-box;"
                        required
                    />
                    <p style="color: #4a5568; font-size: 12px; margin: 4px 0 0 0;">We'll use this email to respond to your message</p>
                </div>
                
                <div class="form-group">
                    <label style="display: block; color: #2d3748; font-weight: 500; margin-bottom: 8px;">Message Type</label>
                    <select 
                        id="messageType"
                        style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-family: inherit; font-size: 14px; background: white; box-sizing: border-box;"
                    >
                        <option value="feedback">General Feedback</option>
                        <option value="feature">Feature Request</option>
                        <option value="bug">Report a Bug</option>
                        <option value="data">Data Issue/Correction</option>
                        <option value="business">Business Inquiry</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #4a5568; font-size: 12px; margin: 0;">Messages are sent to Jack@IHaveMy.ai</p>
                    <button 
                        type="button" 
                        onclick="sendContactMessage()"
                        style="padding: 12px 24px; background: #FF4500; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;"
                        onmouseover="this.style.background='#E63E00'" 
                        onmouseout="this.style.background='#FF4500'"
                    >
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    `;
}

function getSettingsModalContent() {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        return getUserDashboardContent(currentUser);
    } else {
        return getAuthFormContent();
    }
}

function getAuthFormContent() {
    return `
        <div class="auth-container" style="max-width: 400px; margin: 0 auto;">
            <div class="auth-header" style="text-align: center; margin-bottom: 32px;">
                <div style="width: 60px; height: 60px; background: #FF4500; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 24px;">⚙️</span>
                </div>
                <h2 style="color: #1f2937; margin: 0 0 8px 0; font-size: 24px;">Welcome to Viral AI Apps</h2>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">Sign in to your account or create a new one</p>
            </div>
            
            <div class="auth-tabs" style="display: flex; margin-bottom: 24px; background: #f8f9fa; border-radius: 8px; padding: 4px;">
                <button onclick="switchAuthTab('signin')" id="signinTab" class="auth-tab active-tab" style="flex: 1; padding: 10px; background: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; color: #1f2937; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">Sign In</button>
                <button onclick="switchAuthTab('signup')" id="signupTab" class="auth-tab" style="flex: 1; padding: 10px; background: transparent; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; color: #6b7280;">Sign Up</button>
            </div>
            
            <!-- Sign In Form -->
            <form id="signinForm" class="auth-form" style="display: block;">
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; color: #374151; font-weight: 500; margin-bottom: 6px; font-size: 14px;">Email</label>
                    <input type="email" id="signinEmail" placeholder="Enter your email" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" required>
                </div>
                <div class="form-group" style="margin-bottom: 24px;">
                    <label style="display: block; color: #374151; font-weight: 500; margin-bottom: 6px; font-size: 14px;">Password</label>
                    <input type="password" id="signinPassword" placeholder="Enter your password" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" required>
                </div>
                <button type="submit" onclick="handleSignIn(event)" style="width: 100%; padding: 12px; background: #FF4500; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; margin-bottom: 16px;">Sign In</button>
                <div style="text-align: center;">
                    <a href="#" onclick="showForgotPassword()" style="color: #FF4500; text-decoration: none; font-size: 14px;">Forgot your password?</a>
                </div>
            </form>
            
            <!-- Sign Up Form -->
            <form id="signupForm" class="auth-form" style="display: none;">
                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; color: #374151; font-weight: 500; margin-bottom: 6px; font-size: 14px;">Full Name</label>
                    <input type="text" id="signupName" placeholder="Enter your full name" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; color: #374151; font-weight: 500; margin-bottom: 6px; font-size: 14px;">Email</label>
                    <input type="email" id="signupEmail" placeholder="Enter your email" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" required>
                </div>
                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; color: #374151; font-weight: 500; margin-bottom: 6px; font-size: 14px;">Password</label>
                    <input type="password" id="signupPassword" placeholder="Create a password" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" required>
                </div>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; color: #374151; font-weight: 500; margin-bottom: 6px; font-size: 14px;">Confirm Password</label>
                    <input type="password" id="signupConfirmPassword" placeholder="Confirm your password" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" required>
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; gap: 8px; color: #374151; font-size: 14px; cursor: pointer;">
                        <input type="checkbox" id="agreeTerms" required>
                        <span>I agree to the <a href="#" onclick="showLegalModal()" style="color: #FF4500; text-decoration: none;">Terms of Service</a> and <a href="#" onclick="showLegalModal()" style="color: #FF4500; text-decoration: none;">Privacy Policy</a></span>
                    </label>
                </div>
                <button type="submit" onclick="handleSignUp(event)" style="width: 100%; padding: 12px; background: #FF4500; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer;">Create Account</button>
            </form>
            
            <div class="auth-divider" style="margin: 24px 0; text-align: center; position: relative;">
                <span style="background: white; padding: 0 16px; color: #6b7280; font-size: 14px;">or</span>
                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e5e7eb; z-index: -1;"></div>
            </div>
            
            <button onclick="handleGoogleSignIn()" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; background: white; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </button>
        </div>
    `;
}

function getUserDashboardContent(user) {
    return `
        <div class="user-dashboard" style="max-width: 500px; margin: 0 auto;">
            <div class="dashboard-header" style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #FF4500, #FF6B35); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold;">
                    ${user.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <h2 style="color: #1f2937; margin: 0 0 4px 0; font-size: 24px;">Welcome back!</h2>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">${user.user_metadata?.full_name || user.email}</p>
                <p style="color: #9ca3af; margin: 4px 0 0 0; font-size: 12px;">${user.email}</p>
            </div>
            
            <div class="user-preferences" style="margin-bottom: 32px;">
                <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Your Preferences</h3>
                
                <div class="setting-group" style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                    <h4 style="color: #374151; margin: 0 0 16px 0; font-size: 16px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                        🌙 Display Settings
                    </h4>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <label style="color: #4b5563; font-size: 14px;">Theme:</label>
                        <select id="userTheme" onchange="saveUserPreference('theme', this.value)" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: white; font-size: 14px;">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>
                </div>
                
                <div class="setting-group" style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                    <h4 style="color: #374151; margin: 0 0 16px 0; font-size: 16px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                        📊 Data Preferences
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <label style="display: flex; align-items: center; gap: 12px; color: #4b5563; font-size: 14px; cursor: pointer;">
                            <input type="checkbox" id="showGrowth" onchange="saveUserPreference('showGrowth', this.checked)" checked style="width: 16px; height: 16px;">
                            <span>Show growth percentages</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 12px; color: #4b5563; font-size: 14px; cursor: pointer;">
                            <input type="checkbox" id="showFunding" onchange="saveUserPreference('showFunding', this.checked)" checked style="width: 16px; height: 16px;">
                            <span>Display funding information</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 12px; color: #4b5563; font-size: 14px; cursor: pointer;">
                            <input type="checkbox" id="autoRefresh" onchange="saveUserPreference('autoRefresh', this.checked)" style="width: 16px; height: 16px;">
                            <span>Enable auto-refresh</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 12px; color: #4b5563; font-size: 14px; cursor: pointer;">
                            <input type="checkbox" id="emailNotifications" onchange="saveUserPreference('emailNotifications', this.checked)" style="width: 16px; height: 16px;">
                            <span>Receive email notifications</span>
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="user-actions" style="display: flex; gap: 12px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <button onclick="handleSignOut()" style="flex: 1; padding: 12px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer;">Sign Out</button>
                <button onclick="showAccountSettings()" style="flex: 1; padding: 12px; background: #FF4500; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer;">Account Settings</button>
            </div>
        </div>
    `;
}

function initializeModalClose() {
    console.log('Initializing modal close functionality');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    
    if (!modalOverlay || !modalClose) {
        console.error('Modal elements not found!', { modalOverlay, modalClose });
        return;
    }
    
    // Close modal on close button click
    modalClose.addEventListener('click', function(e) {
        console.log('Modal close button clicked');
        closeModal();
    });
    
    // Close modal on overlay click
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            console.log('Modal overlay clicked');
            closeModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            console.log('ESC key pressed, closing modal');
            closeModal();
        }
    });
}

function closeModal() {
    console.log('Closing modal');
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    modalOverlay.classList.remove('chart-modal');
    document.body.style.overflow = '';
}

// Cookie management functions
let cookiePreferences = {
    essential: true, // Always true, cannot be disabled
    analytics: true,
    marketing: false,
    functional: true
};

function toggleCookie(type, element) {
    console.log('Toggling cookie:', type);
    
    if (type === 'essential') return; // Cannot toggle essential cookies
    
    cookiePreferences[type] = !cookiePreferences[type];
    
    // Update toggle switch appearance
    const toggle = element.querySelector('div');
    if (cookiePreferences[type]) {
        element.style.background = '#4CAF50';
        toggle.style.right = '2px';
        toggle.style.left = 'auto';
    } else {
        element.style.background = '#ccc';
        toggle.style.left = '2px';
        toggle.style.right = 'auto';
    }
    
    console.log('Cookie preferences updated:', cookiePreferences);
}

function acceptAllCookies() {
    console.log('Accepting all cookies');
    cookiePreferences = {
        essential: true,
        analytics: true,
        marketing: true,
        functional: true
    };
    saveCookiePreferences();
    closeModal();
    showCookieConfirmation('All cookies accepted');
}

function rejectAllCookies() {
    console.log('Rejecting optional cookies');
    cookiePreferences = {
        essential: true, // Always required
        analytics: false,
        marketing: false,
        functional: false
    };
    saveCookiePreferences();
    closeModal();
    showCookieConfirmation('Optional cookies rejected');
}

function acceptSelectedCookies() {
    console.log('Accepting selected cookies');
    saveCookiePreferences();
    closeModal();
    showCookieConfirmation('Cookie preferences saved');
}

function saveCookiePreferences() {
    // Save to localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    localStorage.setItem('cookieConsentGiven', 'true');
    console.log('Cookie preferences saved:', cookiePreferences);
}

function showCookieConfirmation(message) {
    // Show a brief confirmation message
    const confirmation = document.createElement('div');
    confirmation.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    confirmation.textContent = message;
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.remove();
    }, 3000);
}

// Contact form functionality
function sendContactMessage() {
    const messageInput = document.getElementById('feedbackMessage');
    const emailInput = document.getElementById('replyEmail');
    const typeSelect = document.getElementById('messageType');
    
    if (!messageInput || !emailInput || !typeSelect) {
        console.error('Contact form elements not found');
        return;
    }
    
    const message = messageInput.value.trim();
    const email = emailInput.value.trim();
    const messageType = typeSelect.value;
    
    // Validate required fields
    if (!message) {
        showContactError('Please enter your message');
        messageInput.focus();
        return;
    }
    
    if (!email) {
        showContactError('Please enter your email address');
        emailInput.focus();
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showContactError('Please enter a valid email address');
        emailInput.focus();
        return;
    }
    
    // Create mailto link with the message
    const subject = `[Viral AI Apps] ${getMessageTypeLabel(messageType)}`;
    const body = `Message Type: ${getMessageTypeLabel(messageType)}\nFrom: ${email}\n\n${message}\n\n---\nSent from Viral AI Apps Contact Form`;
    
    const mailtoLink = `mailto:Jack@IHaveMy.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    // Show success message and clear form
    showContactConfirmation('Your email client has been opened. Please send the message to complete your request.');
    
    // Clear the form
    messageInput.value = '';
    emailInput.value = '';
    typeSelect.selectedIndex = 0;
    
    // Close modal after a short delay
    setTimeout(() => {
        closeModal();
    }, 2000);
}

function getMessageTypeLabel(value) {
    const types = {
        'feedback': 'General Feedback',
        'feature': 'Feature Request',
        'bug': 'Bug Report',
        'data': 'Data Issue/Correction',
        'business': 'Business Inquiry',
        'other': 'Other'
    };
    return types[value] || 'General Feedback';
}

function showContactError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10001;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 4000);
}

function showContactConfirmation(message) {
    const confirmation = document.createElement('div');
    confirmation.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #16a34a;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10001;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        max-width: 300px;
    `;
    confirmation.textContent = message;
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.remove();
    }, 5000);
}

// Authentication and user management functions
let currentUser = null;
let supabaseClient = null;

// Initialize Supabase client
function initializeSupabase() {
    try {
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(
                'https://rygermxpngibrkvmpqqf.supabase.co', // Replace with your Supabase URL
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z2VybXhwbmdpYnJrdm1wcXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTYxNTIsImV4cCI6MjA2OTczMjE1Mn0.Stvxenw41DlbxmmW2plGWKePmMs6VHGu6KOVcBCMaJ8' // Replace with your Supabase anon key
            );
            console.log('Supabase client initialized');
            checkUserSession();
        } else {
            console.warn('Supabase not available');
        }
    } catch (error) {
        console.error('Error initializing Supabase:', error);
    }
}

function getCurrentUser() {
    return currentUser;
}

async function checkUserSession() {
    if (!supabaseClient) return null;
    
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
            currentUser = session.user;
            console.log('User session found:', currentUser.email);
            await loadUserPreferences();
        }
        return currentUser;
    } catch (error) {
        console.error('Error checking user session:', error);
        return null;
    }
}

// Authentication form functions
function switchAuthTab(tab) {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const signinTab = document.getElementById('signinTab');
    const signupTab = document.getElementById('signupTab');
    
    if (tab === 'signin') {
        signinForm.style.display = 'block';
        signupForm.style.display = 'none';
        signinTab.className = 'auth-tab active-tab';
        signinTab.style.background = 'white';
        signinTab.style.color = '#1f2937';
        signinTab.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        signupTab.className = 'auth-tab';
        signupTab.style.background = 'transparent';
        signupTab.style.color = '#6b7280';
        signupTab.style.boxShadow = 'none';
    } else {
        signinForm.style.display = 'none';
        signupForm.style.display = 'block';
        signupTab.className = 'auth-tab active-tab';
        signupTab.style.background = 'white';
        signupTab.style.color = '#1f2937';
        signupTab.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        signinTab.className = 'auth-tab';
        signinTab.style.background = 'transparent';
        signinTab.style.color = '#6b7280';
        signinTab.style.boxShadow = 'none';
    }
}

async function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;
    
    if (!email || !password) {
        showAuthError('Please fill in all fields');
        return;
    }
    
    if (!supabaseClient) {
        showAuthError('Authentication service not available');
        return;
    }
    
    try {
        showAuthLoading('Signing in...');
        
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            showAuthError(error.message);
            return;
        }
        
        currentUser = data.user;
        showAuthSuccess('Welcome back!');
        await loadUserPreferences();
        
        // Refresh the modal content to show dashboard
        setTimeout(() => {
            const modalBody = document.getElementById('modalBody');
            modalBody.innerHTML = getUserDashboardContent(currentUser);
            hideAuthLoading();
        }, 1000);
        
    } catch (error) {
        console.error('Sign in error:', error);
        showAuthError('An unexpected error occurred');
        hideAuthLoading();
    }
}

async function handleSignUp(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showAuthError('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthError('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters');
        return;
    }
    
    if (!agreeTerms) {
        showAuthError('Please agree to the Terms of Service');
        return;
    }
    
    if (!supabaseClient) {
        showAuthError('Authentication service not available');
        return;
    }
    
    try {
        showAuthLoading('Creating your account...');
        
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        });
        
        if (error) {
            showAuthError(error.message);
            return;
        }
        
        if (data.user && !data.session) {
            showAuthSuccess('Please check your email to confirm your account');
        } else {
            currentUser = data.user;
            showAuthSuccess('Account created successfully!');
            await createUserProfile(data.user, name);
            
            // Refresh the modal content to show dashboard
            setTimeout(() => {
                const modalBody = document.getElementById('modalBody');
                modalBody.innerHTML = getUserDashboardContent(currentUser);
                hideAuthLoading();
            }, 1000);
        }
        
    } catch (error) {
        console.error('Sign up error:', error);
        showAuthError('An unexpected error occurred');
        hideAuthLoading();
    }
}

async function handleGoogleSignIn() {
    if (!supabaseClient) {
        showAuthError('Authentication service not available');
        return;
    }
    
    try {
        showAuthLoading('Redirecting to Google...');
        
        // Get the current URL without any hash or search params
        const redirectUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        });
        
        if (error) {
            showAuthError(error.message);
            hideAuthLoading();
        }
        
    } catch (error) {
        console.error('Google sign in error:', error);
        showAuthError('An unexpected error occurred');
        hideAuthLoading();
    }
}

async function handleSignOut() {
    if (!supabaseClient) return;
    
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Sign out error:', error);
            return;
        }
        
        currentUser = null;
        showAuthSuccess('Signed out successfully');
        
        // Refresh the modal content to show login form
        setTimeout(() => {
            const modalBody = document.getElementById('modalBody');
            modalBody.innerHTML = getAuthFormContent();
        }, 1000);
        
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

async function createUserProfile(user, fullName) {
    if (!supabaseClient) return;
    
    try {
        const { error } = await supabaseClient
            .from('user_profiles')
            .insert([
                {
                    id: user.id,
                    email: user.email,
                    full_name: fullName,
                    preferences: {
                        theme: 'light',
                        showGrowth: true,
                        showFunding: true,
                        autoRefresh: false,
                        emailNotifications: false
                    },
                    created_at: new Date().toISOString()
                }
            ]);
        
        if (error) {
            console.error('Error creating user profile:', error);
        } else {
            console.log('User profile created successfully');
        }
    } catch (error) {
        console.error('Error creating user profile:', error);
    }
}

async function loadUserPreferences() {
    if (!supabaseClient || !currentUser) return;
    
    try {
        const { data, error } = await supabaseClient
            .from('user_profiles')
            .select('preferences')
            .eq('id', currentUser.id)
            .single();
        
        if (error) {
            console.error('Error loading user preferences:', error);
            return;
        }
        
        if (data?.preferences) {
            // Apply preferences to the UI
            applyUserPreferences(data.preferences);
        }
    } catch (error) {
        console.error('Error loading user preferences:', error);
    }
}

async function saveUserPreference(key, value) {
    if (!supabaseClient || !currentUser) return;
    
    try {
        const { error } = await supabaseClient
            .from('user_profiles')
            .update({
                [`preferences->${key}`]: value
            })
            .eq('id', currentUser.id);
        
        if (error) {
            console.error('Error saving user preference:', error);
        } else {
            console.log(`Preference ${key} saved:`, value);
            showAuthSuccess('Preference saved');
        }
    } catch (error) {
        console.error('Error saving user preference:', error);
    }
}

function applyUserPreferences(preferences) {
    // Apply theme
    if (preferences.theme) {
        const themeSelect = document.getElementById('userTheme');
        if (themeSelect) themeSelect.value = preferences.theme;
    }
    
    // Apply checkboxes
    const checkboxes = ['showGrowth', 'showFunding', 'autoRefresh', 'emailNotifications'];
    checkboxes.forEach(key => {
        const checkbox = document.getElementById(key);
        if (checkbox && preferences.hasOwnProperty(key)) {
            checkbox.checked = preferences[key];
        }
    });
}

// UI helper functions
function showAuthError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10002;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 4000);
}

function showAuthSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #16a34a;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10002;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showAuthLoading(message) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'authLoading';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3b82f6;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10002;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    loadingDiv.textContent = message;
    document.body.appendChild(loadingDiv);
}

function hideAuthLoading() {
    const loadingDiv = document.getElementById('authLoading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function showForgotPassword() {
    // Placeholder for forgot password functionality
    showAuthError('Forgot password feature coming soon. Please contact Jack@IHaveMy.ai for assistance.');
}

function showLegalModal() {
    closeModal();
    setTimeout(() => {
        showEmojiModal('legal', 'Legal Information');
    }, 300);
}

function showAccountSettings() {
    showAuthError('Account settings coming soon');
}

// Handle OAuth callback on page load
function handleOAuthCallback() {
    if (window.location.hash && window.location.hash.includes('access_token')) {
        console.log('OAuth callback detected');
        // Supabase will automatically handle the callback
        setTimeout(() => {
            checkUserSession();
        }, 1000);
    }
}

// Initialize authentication when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeSupabase();
        handleOAuthCallback();
    }, 1000);
});

// Make functions available globally for onclick handlers
window.toggleCookie = toggleCookie;
window.acceptAllCookies = acceptAllCookies;
window.rejectAllCookies = rejectAllCookies;
window.acceptSelectedCookies = acceptSelectedCookies;
window.sendContactMessage = sendContactMessage;
window.switchAuthTab = switchAuthTab;
window.handleSignIn = handleSignIn;
window.handleSignUp = handleSignUp;
window.handleGoogleSignIn = handleGoogleSignIn;
window.handleSignOut = handleSignOut;
window.saveUserPreference = saveUserPreference;
window.showForgotPassword = showForgotPassword;
window.showLegalModal = showLegalModal;
window.showAccountSettings = showAccountSettings;