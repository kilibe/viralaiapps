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
            pageDescription.textContent = 'Track your favorite AI applications and their growth metrics';
            filtersSection.style.display = 'none';
            tableContainer.style.display = 'none';
            showTrackingContent();
            break;
        case 'startups':
            pageHeader.textContent = 'AI Startups Directory';
            pageDescription.textContent = 'Comprehensive list of AI startups and emerging companies';
            filtersSection.style.display = 'block';
            tableContainer.style.display = 'block';
            break;
        case 'unicorns':
            pageHeader.textContent = 'AI Unicorns';
            pageDescription.textContent = 'Billion-dollar AI companies leading the industry';
            filtersSection.style.display = 'block';
            tableContainer.style.display = 'block';
            break;
        case 'reports':
            pageHeader.textContent = 'Viral AI Apps Weekly Reports';
            pageDescription.textContent = 'Weekly insights on viral AI trends.';
            filtersSection.style.display = 'none';
            tableContainer.style.display = 'none';
            showReportsContent();
            break;
        case 'api':
            pageHeader.textContent = 'API Documentation';
            pageDescription.textContent = 'Access our data programmatically with our REST API';
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
        <div class="newsletter-grid" style="margin-top: 20px;">
            <div class="newsletter-card" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <div class="newsletter-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="color: #2d3748; margin: 0;">📊 Weekly Report #24</h3>
                    <span class="date" style="color: #718096; font-size: 14px;">January 29, 2025</span>
                </div>
                <div class="newsletter-preview" style="margin-bottom: 16px;">
                    <p style="color: #4a5568; line-height: 1.6; margin: 0;">This week: ChatGPT reaches 200M users, new AI coding assistants emerge, and breakthrough in multimodal AI technology reshapes the industry landscape...</p>
                </div>
                <a href="#" class="read-more" style="color: #FF4500; text-decoration: none; font-weight: 500;">Read Full Report →</a>
            </div>
            <div class="newsletter-card" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <div class="newsletter-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="color: #2d3748; margin: 0;">📈 Weekly Report #23</h3>
                    <span class="date" style="color: #718096; font-size: 14px;">January 22, 2025</span>
                </div>
                <div class="newsletter-preview" style="margin-bottom: 16px;">
                    <p style="color: #4a5568; line-height: 1.6; margin: 0;">Major AI funding rounds this week, including $50M Series B for leading AI video platform, plus analysis of emerging trends in AI-powered productivity tools...</p>
                </div>
                <a href="#" class="read-more" style="color: #FF4500; text-decoration: none; font-weight: 500;">Read Full Report →</a>
            </div>
        </div>
    `;
    mainContent.appendChild(customContent);
}

function showApiContent() {
    const mainContent = document.querySelector('.main-content');
    const customContent = document.createElement('div');
    customContent.className = 'custom-content';
    customContent.innerHTML = `
        <div class="api-docs" style="margin-top: 20px;">
            <div class="api-section" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <h3 style="color: #2d3748; margin-bottom: 16px;">🚀 Get Started</h3>
                <p style="color: #4a5568; line-height: 1.6; margin-bottom: 16px;">Access our comprehensive AI startup database through our REST API.</p>
                <div class="code-block" style="background: #f7fafc; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                    <code style="color: #2d3748; font-family: 'Monaco', 'Consolas', monospace;">
                        GET https://api.viralaiapps.com/v1/startups<br>
                        Authorization: Bearer YOUR_API_KEY
                    </code>
                </div>
                <p style="color: #718096; font-size: 14px; margin: 0;">API documentation and endpoints are currently under development. Sign up to be notified when they're ready!</p>
            </div>
            <div class="api-section" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="color: #2d3748; margin-bottom: 16px;">📋 Available Endpoints</h3>
                <ul style="color: #4a5568; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li>/startups - Get AI startup data</li>
                    <li>/unicorns - Get billion-dollar AI companies</li>
                    <li>/metrics - Get growth and usage metrics</li>
                    <li>/forecasts - Get AI-powered growth predictions</li>
                </ul>
            </div>
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
                🍪 Cookie Preferences
            </h2>
            <p style="color: #4a5568; font-size: 14px; margin: 8px 0 0 0;">Customize your cookie settings and privacy preferences</p>
        </div>
        <div class="cookie-content">
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 24px;">We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. You can customize which cookies to accept below.</p>
            
            <div class="cookie-categories" style="margin-bottom: 24px;">
                <div class="cookie-category" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h4 style="color: #2d3748; margin: 0;">🔧 Essential Cookies</h4>
                        <div class="toggle-switch" style="position: relative; width: 44px; height: 24px; background: #4CAF50; border-radius: 12px; cursor: not-allowed; opacity: 0.7;">
                            <div style="position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.3s;"></div>
                        </div>
                    </div>
                    <p style="color: #4a5568; font-size: 14px; margin: 0;">Required for basic website functionality. Cannot be disabled.</p>
                </div>
                
                <div class="cookie-category" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h4 style="color: #2d3748; margin: 0;">📊 Analytics Cookies</h4>
                        <div class="toggle-switch analytics-toggle" style="position: relative; width: 44px; height: 24px; background: #4CAF50; border-radius: 12px; cursor: pointer;" onclick="toggleCookie('analytics', this)">
                            <div style="position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.3s;"></div>
                        </div>
                    </div>
                    <p style="color: #4a5568; font-size: 14px; margin: 0;">Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                </div>
                
                <div class="cookie-category" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h4 style="color: #2d3748; margin: 0;">🎯 Marketing Cookies</h4>
                        <div class="toggle-switch marketing-toggle" style="position: relative; width: 44px; height: 24px; background: #ccc; border-radius: 12px; cursor: pointer;" onclick="toggleCookie('marketing', this)">
                            <div style="position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.3s;"></div>
                        </div>
                    </div>
                    <p style="color: #4a5568; font-size: 14px; margin: 0;">Used to track visitors across websites for personalized advertising and content recommendations.</p>
                </div>
                
                <div class="cookie-category" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h4 style="color: #2d3748; margin: 0;">⚙️ Functional Cookies</h4>
                        <div class="toggle-switch functional-toggle" style="position: relative; width: 44px; height: 24px; background: #4CAF50; border-radius: 12px; cursor: pointer;" onclick="toggleCookie('functional', this)">
                            <div style="position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.3s;"></div>
                        </div>
                    </div>
                    <p style="color: #4a5568; font-size: 14px; margin: 0;">Enable enhanced functionality like remembering your preferences and settings.</p>
                </div>
            </div>
            
            <div class="cookie-actions" style="display: flex; gap: 12px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                <button onclick="rejectAllCookies()" style="padding: 10px 20px; border: 1px solid #ccc; background: white; color: #4a5568; border-radius: 6px; cursor: pointer; font-size: 14px;">Reject All</button>
                <button onclick="acceptSelectedCookies()" style="padding: 10px 20px; border: none; background: #FF4500; color: white; border-radius: 6px; cursor: pointer; font-size: 14px;">Accept Selected</button>
                <button onclick="acceptAllCookies()" style="padding: 10px 20px; border: none; background: #4CAF50; color: white; border-radius: 6px; cursor: pointer; font-size: 14px;">Accept All</button>
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
                👤 Contact Us
            </h2>
            <p style="color: #4a5568; font-size: 14px; margin: 8px 0 0 0;">Send us your feedback, questions, or feature requests</p>
        </div>
        <div class="contact-content">
            <form id="contactForm" style="display: flex; flex-direction: column; gap: 20px;">
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
    return `
        <div class="modal-header" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #2d3748; margin: 0; display: flex; align-items: center; gap: 8px;">
                ⚙️ Settings
            </h2>
        </div>
        <div class="settings-content">
            <div class="setting-group" style="margin-bottom: 24px;">
                <h4 style="color: #2d3748; margin-bottom: 12px;">🌙 Display</h4>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <label style="color: #4a5568; font-size: 14px;">Theme:</label>
                    <select style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; background: white;">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>Auto</option>
                    </select>
                </div>
            </div>
            
            <div class="setting-group" style="margin-bottom: 24px;">
                <h4 style="color: #2d3748; margin-bottom: 12px;">📊 Data</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="display: flex; align-items: center; gap: 8px; color: #4a5568; font-size: 14px;">
                        <input type="checkbox" checked> Show growth percentages
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; color: #4a5568; font-size: 14px;">
                        <input type="checkbox" checked> Display funding information
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; color: #4a5568; font-size: 14px;">
                        <input type="checkbox"> Enable auto-refresh
                    </label>
                </div>
            </div>
            
            <div style="padding: 16px; background: #f8f9fa; border-radius: 8px;">
                <p style="color: #718096; margin: 0; font-size: 14px;">Settings are saved automatically and synced across your devices.</p>
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

// Make functions available globally for onclick handlers
window.toggleCookie = toggleCookie;
window.acceptAllCookies = acceptAllCookies;
window.rejectAllCookies = rejectAllCookies;
window.acceptSelectedCookies = acceptSelectedCookies;
window.sendContactMessage = sendContactMessage;