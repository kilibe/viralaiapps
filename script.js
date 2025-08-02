document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase
    initializeSupabase();
    
    // Initialize EmailJS
    initializeEmailJS();
    
    // Initialize modal functionality
    initializeModal();
    // Handle dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');
        const options = dropdown.querySelectorAll('.dropdown-content a');
        
        // Toggle dropdown on button click
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
        
        // Handle option selection
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update button text (keep the arrow)
                const arrow = btn.querySelector('.arrow');
                btn.innerHTML = this.textContent + ' <span class="arrow">▼</span>';
                
                // Close dropdown
                dropdown.classList.remove('active');
                
                // Here you can add functionality to filter the table based on selection
                filterTable(dropdown, this.textContent);
            });
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
    
    // Handle navigation active states
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Here you can add functionality to load different content
            loadContent(this.textContent);
        });
    });
});

// Function to filter table based on dropdown selection
function filterTable(dropdown, selectedValue) {
    const filterType = dropdown.querySelector('.dropdown-btn').textContent.trim().split(' ')[0];
    
    console.log(`Filtering by ${filterType}: ${selectedValue}`);
    
    // Add your filtering logic here
    // For now, this is just a placeholder that logs the filter action
    
    // Example: You could filter the table rows based on the selected criteria
    // const tableRows = document.querySelectorAll('.content-table tbody tr');
    // Apply filtering logic based on filterType and selectedValue
}

// Function to show tracking content
function showTrackingContent() {
    // Create tracking container if it doesn't exist
    let trackingContainer = document.querySelector('.tracking-container');
    if (!trackingContainer) {
        trackingContainer = document.createElement('div');
        trackingContainer.className = 'tracking-container';
        trackingContainer.innerHTML = `
            <div class="coming-soon">
                <h2>Coming Soon</h2>
                <p>Track your favorite AI applications and get notified when they reach key milestones.</p>
            </div>
        `;
        
        const mainContent = document.querySelector('.main-content');
        mainContent.appendChild(trackingContainer);
    }
}

// Function to show API content
function showApiContent() {
    // Create API container if it doesn't exist
    let apiContainer = document.querySelector('.api-container');
    if (!apiContainer) {
        apiContainer = document.createElement('div');
        apiContainer.className = 'api-container';
        apiContainer.innerHTML = `
            <div class="coming-soon">
                <h2>Coming Soon</h2>
                <p>Our API documentation and endpoints are currently under development.</p>
            </div>
        `;
        
        const mainContent = document.querySelector('.main-content');
        mainContent.appendChild(apiContainer);
    }
}

// Function to show reports content
function showReportsContent() {
    // Create reports container if it doesn't exist
    let reportsContainer = document.querySelector('.reports-container');
    if (!reportsContainer) {
        reportsContainer = document.createElement('div');
        reportsContainer.className = 'reports-container';
        reportsContainer.innerHTML = `
            <div class="newsletter-grid">
                <div class="newsletter-card">
                    <div class="newsletter-header">
                        <h3>Weekly Report #24</h3>
                        <span class="date">January 29, 2025</span>
                    </div>
                    <div class="newsletter-preview">
                        <p>This week: ChatGPT reaches 200M users, new AI coding assistants emerge, and breakthrough in multimodal AI...</p>
                    </div>
                    <a href="#" class="read-more">Read Full Report →</a>
                </div>
                
                <div class="newsletter-card">
                    <div class="newsletter-header">
                        <h3>Weekly Report #23</h3>
                        <span class="date">January 22, 2025</span>
                    </div>
                    <div class="newsletter-preview">
                        <p>AI image generation hits mainstream, Anthropic announces Claude 4, and startup funding trends analysis...</p>
                    </div>
                    <a href="#" class="read-more">Read Full Report →</a>
                </div>
                
                <div class="newsletter-card">
                    <div class="newsletter-header">
                        <h3>Weekly Report #22</h3>
                        <span class="date">January 15, 2025</span>
                    </div>
                    <div class="newsletter-preview">
                        <p>Voice AI revolution continues, new productivity tools launch, and AI safety discussions intensify...</p>
                    </div>
                    <a href="#" class="read-more">Read Full Report →</a>
                </div>
                
                <div class="newsletter-card">
                    <div class="newsletter-header">
                        <h3>Weekly Report #21</h3>
                        <span class="date">January 8, 2025</span>
                    </div>
                    <div class="newsletter-preview">
                        <p>2025 AI predictions, emerging startups to watch, and analysis of year-end funding rounds...</p>
                    </div>
                    <a href="#" class="read-more">Read Full Report →</a>
                </div>
                
                <div class="newsletter-card">
                    <div class="newsletter-header">
                        <h3>Weekly Report #20</h3>
                        <span class="date">January 1, 2025</span>
                    </div>
                    <div class="newsletter-preview">
                        <p>Year in review: Top 50 viral AI apps of 2024, biggest breakthroughs, and market analysis...</p>
                    </div>
                    <a href="#" class="read-more">Read Full Report →</a>
                </div>
                
                <div class="newsletter-card">
                    <div class="newsletter-header">
                        <h3>Weekly Report #19</h3>
                        <span class="date">December 25, 2024</span>
                    </div>
                    <div class="newsletter-preview">
                        <p>Holiday AI trends, consumer adoption patterns, and enterprise AI implementation insights...</p>
                    </div>
                    <a href="#" class="read-more">Read Full Report →</a>
                </div>
            </div>
        `;
        
        const mainContent = document.querySelector('.main-content');
        mainContent.appendChild(reportsContainer);
    }
}

// Function to initialize modal functionality
function initializeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const navIcons = document.querySelectorAll('.nav-icon');
    
    // Modal content for each icon
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
                        <button class="btn btn-secondary" onclick="rejectAllCookies()">Reject All</button>
                        <button class="btn btn-primary" onclick="acceptAllCookies()">Accept All</button>
                        <button class="btn btn-primary" onclick="saveCookiePreferences()">Save Preferences</button>
                    </div>
                    
                    <div class="cookie-policy-link">
                        <p>For more information, please read our full <a href="#" onclick="showCookiePolicy(event)">Cookie Policy</a></p>
                    </div>
                </div>
                
                <div class="cookie-policy-full" style="display: none;">
                    <h3>Cookie Policy</h3>
                    <p class="policy-date">Last updated: January 2025</p>
                    
                    <h4>1. What Are Cookies</h4>
                    <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.</p>
                    
                    <h4>2. How We Use Cookies</h4>
                    <p>We use cookies for the following purposes:</p>
                    <ul>
                        <li><strong>Essential:</strong> To provide core functionality of our website</li>
                        <li><strong>Analytics:</strong> To understand how visitors use our site and improve our services</li>
                        <li><strong>Functional:</strong> To remember your preferences and settings</li>
                        <li><strong>Advertising:</strong> To deliver relevant advertisements and measure their effectiveness</li>
                    </ul>
                    
                    <h4>3. Your Cookie Choices</h4>
                    <p>You have the right to choose whether to accept or reject cookies. You can exercise your cookie preferences by using the settings above or by configuring your browser settings.</p>
                    
                    <h4>4. Third-Party Cookies</h4>
                    <p>Some cookies are placed by third-party services that appear on our pages. We do not control these third-party cookies and encourage you to check the third-party websites for more information about their cookies.</p>
                    
                    <h4>5. Contact Us</h4>
                    <p>If you have any questions about our use of cookies, please contact us at kate@ihaveamy.ai</p>
                    
                    <button class="btn btn-secondary" onclick="showCookieSettings(event)">← Back to Settings</button>
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
                    
                    <h4>4. Limitations</h4>
                    <p>In no event shall Viral AI Apps or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Viral AI Apps, even if Viral AI Apps or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
                    
                    <h4>5. Privacy Policy</h4>
                    <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.</p>
                    
                    <h4>6. Data Collection and Use</h4>
                    <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. We may also collect certain information automatically when you use our service, including usage data and device information.</p>
                    
                    <h4>7. User Content</h4>
                    <p>Our service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the service, including its legality, reliability, and appropriateness.</p>
                    
                    <h4>8. Prohibited Uses</h4>
                    <p>You may not use our service:</p>
                    <ul>
                        <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                        <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                        <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                        <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                        <li>To submit false or misleading information</li>
                    </ul>
                    
                    <h4>9. Intellectual Property Rights</h4>
                    <p>The service and its original content, features, and functionality are and will remain the exclusive property of Viral AI Apps and its licensors. The service is protected by copyright, trademark, and other laws.</p>
                    
                    <h4>10. Termination</h4>
                    <p>We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                    
                    <h4>11. Governing Law</h4>
                    <p>These Terms shall be interpreted and governed by the laws of the jurisdiction in which Viral AI Apps operates, without regard to its conflict of law provisions.</p>
                    
                    <h4>12. Changes to Terms</h4>
                    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
                    
                    <h4>13. Contact Information</h4>
                    <p>If you have any questions about these Terms of Service, please contact us at:</p>
                    <p><strong>Email:</strong> kate@ihaveamy.ai<br>
                    <strong>Website:</strong> viralaiapps.com</p>
                    
                    <div class="legal-section">
                        <h3>Privacy Policy</h3>
                        <p class="policy-date">Last updated: January 2025</p>
                        
                        <h4>Information We Collect</h4>
                        <p>We collect information to provide better services to our users. We collect information in the following ways:</p>
                        <ul>
                            <li><strong>Information you give us:</strong> Account information, profile data, and communications</li>
                            <li><strong>Information we get from your use:</strong> Usage data, device information, and location data</li>
                            <li><strong>Information from third parties:</strong> Social media platforms and analytics providers</li>
                        </ul>
                        
                        <h4>How We Use Information</h4>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our services</li>
                            <li>Develop new features and services</li>
                            <li>Communicate with you about our services</li>
                            <li>Protect against fraud and abuse</li>
                        </ul>
                        
                        <h4>Information Sharing</h4>
                        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                        
                        <h4>Data Retention</h4>
                        <p>We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy.</p>
                        
                        <h4>Your Rights</h4>
                        <p>You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.</p>
                    </div>
                    
                    <div class="legal-section">
                        <h3>Disclaimer</h3>
                        <p>The information provided on Viral AI Apps is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website.</p>
                        
                        <p>Any reliance you place on such information is therefore strictly at your own risk. In no event will we be liable for any loss or damage arising from the use of this website.</p>
                    </div>
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
                        
                        <button type="submit" class="btn btn-primary contact-submit">
                            <span class="btn-text">Send Message</span>
                            <span class="btn-loading" style="display: none;">Sending...</span>
                        </button>
                    </form>
                    
                    <div class="contact-success" id="contactSuccess" style="display: none;">
                        <div class="success-icon">✓</div>
                        <h3>Message Sent!</h3>
                        <p>Thank you for your feedback. We'll get back to you soon at the email address you provided.</p>
                    </div>
                    
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
                            <button class="google-login-btn" id="googleLoginBtn">
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
                            
                            <form class="email-login-form" id="emailLoginForm">
                                <div class="form-group">
                                    <label for="loginEmail">Email</label>
                                    <input type="email" id="loginEmail" name="email" placeholder="your.email@example.com" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="loginPassword">Password</label>
                                    <input type="password" id="loginPassword" name="password" placeholder="Enter your password" required>
                                </div>
                                
                                <button type="submit" class="btn btn-primary login-submit">
                                    <span class="btn-text">Sign In</span>
                                    <span class="btn-loading" style="display: none;">Signing In...</span>
                                </button>
                            </form>
                            
                            <div class="login-footer">
                                <p>Don't have an account? <a href="#" id="showSignupBtn">Sign up here</a></p>
                                <p><a href="#" id="forgotPasswordBtn">Forgot your password?</a></p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Signup Section -->
                    <div class="signup-section" id="signupSection" style="display: none;">
                        <div class="login-header">
                            <h3>Create Your Account</h3>
                            <p>Join Viral AI Apps to track your favorite applications and get personalized insights.</p>
                        </div>
                        
                        <form class="email-signup-form" id="emailSignupForm">
                            <div class="form-group">
                                <label for="signupName">Full Name</label>
                                <input type="text" id="signupName" name="name" placeholder="Your full name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="signupEmail">Email</label>
                                <input type="email" id="signupEmail" name="email" placeholder="your.email@example.com" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="signupPassword">Password</label>
                                <input type="password" id="signupPassword" name="password" placeholder="Choose a strong password" required>
                                <small class="form-help">At least 8 characters with letters and numbers</small>
                            </div>
                            
                            <button type="submit" class="btn btn-primary signup-submit">
                                <span class="btn-text">Create Account</span>
                                <span class="btn-loading" style="display: none;">Creating Account...</span>
                            </button>
                        </form>
                        
                        <div class="login-footer">
                            <p>Already have an account? <a href="#" id="showLoginBtn">Sign in here</a></p>
                        </div>
                    </div>
                    
                    <!-- User Dashboard Section -->
                    <div class="user-dashboard" id="userDashboard" style="display: none;">
                        <div class="user-profile">
                            <div class="profile-info">
                                <div class="profile-avatar" id="userAvatar"></div>
                                <div class="profile-details">
                                    <h3 id="userName">Welcome back!</h3>
                                    <p id="userEmail"></p>
                                    <span class="user-status" id="userStatus">Free Account</span>
                                </div>
                            </div>
                            <button class="btn btn-secondary logout-btn" id="logoutBtn">Sign Out</button>
                        </div>
                        
                        <div class="settings-sections">
                            <div class="settings-section">
                                <h4>Account Preferences</h4>
                                <div class="setting-item">
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="emailNotifications">
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <div class="setting-info">
                                        <h5>Email Notifications</h5>
                                        <p>Receive updates about new AI apps and trends</p>
                                    </div>
                                </div>
                                
                                <div class="setting-item">
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="weeklyReport">
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <div class="setting-info">
                                        <h5>Weekly Reports</h5>
                                        <p>Get our weekly AI trends report in your inbox</p>
                                    </div>
                                </div>
                                
                                <div class="setting-item">
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="darkMode">
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <div class="setting-info">
                                        <h5>Dark Mode</h5>
                                        <p>Switch to dark theme for better viewing</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="settings-section">
                                <h4>Data & Privacy</h4>
                                <div class="setting-buttons">
                                    <button class="btn btn-secondary" id="exportDataBtn">Export My Data</button>
                                    <button class="btn btn-danger" id="deleteAccountBtn">Delete Account</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    };
    
    // Add click event to each nav icon
    navIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const type = href.replace('#', '');
            
            if (modalContent[type]) {
                // Update modal content
                modalBody.innerHTML = `
                    <h2>${modalContent[type].title}</h2>
                    ${modalContent[type].content}
                `;
                
                // Show modal
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Initialize contact form if this is the contact modal
                if (type === 'contact') {
                    initializeContactForm();
                }
                
                // Initialize auth forms if this is the settings modal
                if (type === 'settings') {
                    initializeAuthForms();
                }
            }
        });
    });
    
    // Close modal on close button click
    modalClose.addEventListener('click', closeModal);
    
    // Close modal on overlay click
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Cookie preference functions
window.acceptAllCookies = function() {
    document.getElementById('analyticsCookies').checked = true;
    document.getElementById('functionalCookies').checked = true;
    document.getElementById('advertisingCookies').checked = true;
    saveCookiePreferences();
};

window.rejectAllCookies = function() {
    document.getElementById('analyticsCookies').checked = false;
    document.getElementById('functionalCookies').checked = false;
    document.getElementById('advertisingCookies').checked = false;
    saveCookiePreferences();
};

window.saveCookiePreferences = function() {
    const preferences = {
        essential: true,
        analytics: document.getElementById('analyticsCookies').checked,
        functional: document.getElementById('functionalCookies').checked,
        advertising: document.getElementById('advertisingCookies').checked
    };
    
    // Save to localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    
    // Show confirmation
    alert('Your cookie preferences have been saved.');
    
    // Close modal
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
};

window.showCookiePolicy = function(event) {
    event.preventDefault();
    document.querySelector('.cookie-settings').style.display = 'none';
    document.querySelector('.cookie-policy-full').style.display = 'block';
    document.querySelector('.modal-body h2').textContent = 'Cookie Policy';
};

window.showCookieSettings = function(event) {
    event.preventDefault();
    document.querySelector('.cookie-settings').style.display = 'block';
    document.querySelector('.cookie-policy-full').style.display = 'none';
    document.querySelector('.modal-body h2').textContent = 'Cookie Settings';
};

// Contact form initialization and handling
function initializeContactForm() {
    // Pre-fill email if user is logged in (placeholder for now)
    const userEmail = localStorage.getItem('userEmail') || '';
    const emailInput = document.getElementById('email');
    if (emailInput && userEmail) {
        emailInput.value = userEmail;
    }
    
    // Add form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
}

function handleContactSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.contact-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Get form data
    const formData = {
        feedback: form.feedback.value,
        email: form.email.value,
        name: form.name.value || 'Anonymous'
    };
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    // Here's where you would send the email
    // For now, we'll simulate the process
    sendContactEmail(formData)
        .then(() => {
            // Show success message
            document.querySelector('.contact-form-fields').style.display = 'none';
            document.getElementById('contactSuccess').style.display = 'block';
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            alert('Sorry, there was an error sending your message. Please try again or email us directly at kate@ihaveamy.ai');
            
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        });
}

// EmailJS Configuration
function initializeEmailJS() {
    // Initialize EmailJS with your user ID
    // You'll need to replace 'YOUR_USER_ID' with your actual EmailJS user ID
    if (typeof emailjs !== 'undefined') {
        emailjs.init('YOUR_USER_ID'); // Replace with your EmailJS user ID
    }
}

// Email sending function using EmailJS
async function sendContactEmail(formData) {
    try {
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS not loaded');
        }

        // EmailJS template parameters
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            to_email: 'kate@ihaveamy.ai',
            subject: 'New Feedback from Viral AI Apps',
            message: formData.feedback,
            reply_to: formData.email
        };

        // Send email using EmailJS
        // You'll need to replace these with your actual service ID and template ID
        const response = await emailjs.send(
            'YOUR_SERVICE_ID',     // Replace with your EmailJS service ID
            'YOUR_TEMPLATE_ID',    // Replace with your EmailJS template ID
            templateParams
        );

        if (response.status === 200) {
            console.log('Email sent successfully!');
            return Promise.resolve();
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('EmailJS error:', error);
        
        // Fallback: Open default email client
        const subject = encodeURIComponent('Feedback from Viral AI Apps');
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nFeedback:\n${formData.feedback}`);
        const mailtoLink = `mailto:kate@ihaveamy.ai?subject=${subject}&body=${body}`;
        
        window.open(mailtoLink, '_blank');
        
        throw error;
    }
}

// Supabase Configuration and Authentication
let supabaseClient = null;

function initializeSupabase() {
    // Replace these with your actual Supabase credentials
    const supabaseUrl = 'YOUR_SUPABASE_URL';
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
    
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
        
        // Check if user is already logged in
        checkAuthState();
    }
}

async function checkAuthState() {
    if (!supabaseClient) return;
    
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            // User is logged in
            updateUIForLoggedInUser(session.user);
        }
    } catch (error) {
        console.error('Auth state check error:', error);
    }
}

function initializeAuthForms() {
    // Check current auth state and show appropriate section
    checkAuthState().then(() => {
        // Add event listeners for auth forms
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        const emailLoginForm = document.getElementById('emailLoginForm');
        const emailSignupForm = document.getElementById('emailSignupForm');
        const showSignupBtn = document.getElementById('showSignupBtn');
        const showLoginBtn = document.getElementById('showLoginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
        
        // Google login
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', handleGoogleLogin);
        }
        
        // Email login
        if (emailLoginForm) {
            emailLoginForm.addEventListener('submit', handleEmailLogin);
        }
        
        // Email signup
        if (emailSignupForm) {
            emailSignupForm.addEventListener('submit', handleEmailSignup);
        }
        
        // Show signup form
        if (showSignupBtn) {
            showSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showSignupForm();
            });
        }
        
        // Show login form
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showLoginForm();
            });
        }
        
        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        
        // Forgot password
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', handleForgotPassword);
        }
        
        // Settings toggles
        initializeSettingsToggles();
    });
}

async function handleGoogleLogin() {
    if (!supabaseClient) {
        alert('Authentication service not initialized');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) {
            console.error('Google login error:', error);
            alert('Failed to sign in with Google');
        }
    } catch (error) {
        console.error('Google login error:', error);
        alert('Failed to sign in with Google');
    }
}

async function handleEmailLogin(event) {
    event.preventDefault();
    
    if (!supabaseClient) {
        alert('Authentication service not initialized');
        return;
    }
    
    const form = event.target;
    const submitBtn = form.querySelector('.login-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    const email = form.email.value;
    const password = form.password.value;
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            alert('Login failed: ' + error.message);
        } else {
            updateUIForLoggedInUser(data.user);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

async function handleEmailSignup(event) {
    event.preventDefault();
    
    if (!supabaseClient) {
        alert('Authentication service not initialized');
        return;
    }
    
    const form = event.target;
    const submitBtn = form.querySelector('.signup-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    
    // Basic password validation
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                }
            }
        });
        
        if (error) {
            alert('Signup failed: ' + error.message);
        } else {
            alert('Account created! Please check your email for verification.');
            showLoginForm();
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

async function handleLogout() {
    if (!supabaseClient) return;
    
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
        } else {
            updateUIForLoggedOutUser();
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = prompt('Enter your email address:');
    if (!email) return;
    
    if (!supabaseClient) {
        alert('Authentication service not initialized');
        return;
    }
    
    try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
        if (error) {
            alert('Password reset failed: ' + error.message);
        } else {
            alert('Password reset email sent! Check your inbox.');
        }
    } catch (error) {
        console.error('Password reset error:', error);
        alert('Password reset failed');
    }
}

function updateUIForLoggedInUser(user) {
    // Hide login/signup sections
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');
    const userDashboard = document.getElementById('userDashboard');
    
    if (loginSection) loginSection.style.display = 'none';
    if (signupSection) signupSection.style.display = 'none';
    if (userDashboard) userDashboard.style.display = 'block';
    
    // Update user info
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userName) userName.textContent = user.user_metadata?.full_name || 'Welcome back!';
    if (userEmail) userEmail.textContent = user.email;
    if (userAvatar) {
        if (user.user_metadata?.avatar_url) {
            userAvatar.innerHTML = `<img src="${user.user_metadata.avatar_url}" alt="Avatar">`;
        } else {
            userAvatar.innerHTML = user.user_metadata?.full_name?.charAt(0) || user.email.charAt(0);
        }
    }
    
    // Store user email for contact form
    localStorage.setItem('userEmail', user.email);
}

function updateUIForLoggedOutUser() {
    // Show login section
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');
    const userDashboard = document.getElementById('userDashboard');
    
    if (loginSection) loginSection.style.display = 'block';
    if (signupSection) signupSection.style.display = 'none';
    if (userDashboard) userDashboard.style.display = 'none';
    
    // Clear stored user email
    localStorage.removeItem('userEmail');
}

function showSignupForm() {
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');
    
    if (loginSection) loginSection.style.display = 'none';
    if (signupSection) signupSection.style.display = 'block';
}

function showLoginForm() {
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');
    
    if (loginSection) loginSection.style.display = 'block';
    if (signupSection) signupSection.style.display = 'none';
}

function initializeSettingsToggles() {
    // Load saved preferences
    const savedPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    // Set toggle states
    const toggles = ['emailNotifications', 'weeklyReport', 'darkMode'];
    toggles.forEach(toggleId => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.checked = savedPreferences[toggleId] || false;
            toggle.addEventListener('change', () => saveUserPreferences());
        }
    });
    
    // Setting buttons
    const exportDataBtn = document.getElementById('exportDataBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', handleExportData);
    }
    
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', handleDeleteAccount);
    }
}

function saveUserPreferences() {
    const preferences = {
        emailNotifications: document.getElementById('emailNotifications')?.checked || false,
        weeklyReport: document.getElementById('weeklyReport')?.checked || false,
        darkMode: document.getElementById('darkMode')?.checked || false
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Apply dark mode if enabled
    if (preferences.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function handleExportData() {
    // Create a simple data export
    const userData = {
        preferences: JSON.parse(localStorage.getItem('userPreferences') || '{}'),
        cookiePreferences: JSON.parse(localStorage.getItem('cookiePreferences') || '{}'),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'viral-ai-apps-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return;
    }
    
    if (!supabaseClient) {
        alert('Authentication service not initialized');
        return;
    }
    
    try {
        // In a real app, you'd call a backend function to delete user data
        // For now, we'll just sign out the user
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Error during account deletion:', error);
        } else {
            localStorage.clear();
            alert('Account deletion initiated. You have been signed out.');
            updateUIForLoggedOutUser();
        }
    } catch (error) {
        console.error('Account deletion error:', error);
        alert('Account deletion failed');
    }
}

// Function to load different content based on navigation
function loadContent(section) {
    console.log(`Loading content for: ${section}`);
    
    // Update page header based on selected section
    const pageHeader = document.querySelector('.page-header h1');
    const pageDescription = document.querySelector('.page-header p');
    
    switch(section.toLowerCase()) {
        case 'tracking':
            pageHeader.textContent = 'Tracking';
            pageDescription.textContent = 'Track your favorite AI applications and their growth metrics';
            showTrackingContent();
            break;
        case 'startups':
            pageHeader.textContent = 'AI Startups Directory';
            pageDescription.textContent = 'Comprehensive list of AI startups and emerging companies';
            break;
        case 'unicorns':
            pageHeader.textContent = 'AI Unicorns';
            pageDescription.textContent = 'Billion-dollar AI companies leading the industry';
            break;
        case 'reports':
            pageHeader.textContent = 'Viral AI Apps Weekly Reports';
            pageDescription.textContent = 'Weekly insights on viral AI trends.';
            showReportsContent();
            break;
        case 'api':
            pageHeader.textContent = 'API Documentation';
            pageDescription.textContent = 'Access our data programmatically with our REST API';
            showApiContent();
            break;
    }
    
    // Show/hide filters and table based on section
    const filtersSection = document.querySelector('.filters-section');
    const tableContainer = document.querySelector('.table-container');
    const reportsContainer = document.querySelector('.reports-container');
    const apiContainer = document.querySelector('.api-container');
    const trackingContainer = document.querySelector('.tracking-container');
    
    if (section.toLowerCase() === 'tracking') {
        filtersSection.style.display = 'none';
        tableContainer.style.display = 'none';
        if (reportsContainer) reportsContainer.style.display = 'none';
        if (apiContainer) apiContainer.style.display = 'none';
        if (trackingContainer) trackingContainer.style.display = 'block';
    } else if (section.toLowerCase() === 'reports') {
        filtersSection.style.display = 'none';
        tableContainer.style.display = 'none';
        if (reportsContainer) reportsContainer.style.display = 'block';
        if (apiContainer) apiContainer.style.display = 'none';
        if (trackingContainer) trackingContainer.style.display = 'none';
    } else if (section.toLowerCase() === 'api') {
        filtersSection.style.display = 'none';
        tableContainer.style.display = 'none';
        if (reportsContainer) reportsContainer.style.display = 'none';
        if (apiContainer) apiContainer.style.display = 'block';
        if (trackingContainer) trackingContainer.style.display = 'none';
    } else {
        filtersSection.style.display = 'block';
        tableContainer.style.display = 'block';
        if (reportsContainer) reportsContainer.style.display = 'none';
        if (apiContainer) apiContainer.style.display = 'none';
        if (trackingContainer) trackingContainer.style.display = 'none';
    }
}