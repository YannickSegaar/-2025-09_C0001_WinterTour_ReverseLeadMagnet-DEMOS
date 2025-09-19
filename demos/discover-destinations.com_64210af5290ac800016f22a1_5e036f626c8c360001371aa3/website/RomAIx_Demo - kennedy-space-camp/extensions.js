// YRS: DiscoverDestinationsLeadForm - VERSION 1(18 SEP 2025, 11:01 CEST)
// Updated for mobile compatibility - using global scope instead of ES6 modules

window.DiscoverDestinationsLeadForm1 = {
  name: 'DiscoverDestinationsLeadForm1',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_discoverLeadForm1' || trace.payload?.name === 'ext_discoverLeadForm1',
  render: ({ trace, element }) => {
    // --- Configuration from Voiceflow Payload ---
    const {
      formTitle = 'Let\'s Plan Your Dream Trip!',
      formSubtitle = 'Get a personalized itinerary crafted just for you!',
      height = '620',
      backgroundColor = '#FFFFFF',
      maxWidth = '460px',
      // --- Updated branding with red theme and selective pink accents ---
      primaryColor = '#ED4341', // Main red
      secondaryColor = '#FF6B69', // Lighter red
      accentColor = '#FFFFFF',
      textColor = '#2C3E50',
      lightGray = '#F8F9FA',
      borderColor = '#E5E8EB',
      glassColor = 'rgba(237, 67, 65, 0.1)',
      pinkAccent = '#fde8e8', // Soft pink for header and button backgrounds
      // --- Border & Shadow ---
      borderWidth = '1px',
      borderStyle = 'solid',
      borderRadius = '16px',
      shadowColor = 'rgba(237, 67, 65, 0.25)',
      shadowSize = '12px',
      animateIn = true,
      // --- Logo Configuration ---
      logoUrl = 'https://yannicksegaar.github.io/2025-09_C0001_WinterTour_ReverseLeadMagnet_DEMOS/DiscoverDestinations_Voiceflow_Avatar.png',
      showLogo = true,
      // --- Conversation History from Voiceflow ---
      conversationHistory = null, // This will contain the vf_memory data
      conversationId = null,
      userId = null,
    } = trace.payload || {};

    // --- N8N Webhook URL ---
    const N8N_WEBHOOK_URL = 'https://n8n.romaix-n8n.xyz/webhook/fe5af68f-3743-4885-9987-acddc6bc1235';

    // --- State Variables ---
    let currentStep = 'form';
    let isSubmitting = false;

    // --- Initial Setup ---
    element.innerHTML = '';
    const container = document.createElement('div');
    container.style.cssText = 'width: 100%; display: flex; justify-content: center; align-items: flex-start; background-color: transparent; margin: 0; padding: 8px 0;';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'discover-lead-form-wrapper';
    wrapper.style.cssText = `
      width: ${maxWidth}; min-width: ${maxWidth}; max-width: ${maxWidth};
      border: ${borderWidth} ${borderStyle} ${borderColor}; border-radius: ${borderRadius};
      overflow: hidden; background: ${backgroundColor};
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 8px ${shadowSize} ${shadowColor}, 0 0 0 1px rgba(255,255,255,0.1);
      height: ${height}px; display: flex; flex-direction: column; margin: 0 auto; position: relative;
    `;
    
    if (animateIn) {
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(15px) scale(0.98)';
      wrapper.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // --- HTML & CSS for the lead form ---
    wrapper.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .discover-lead-form-wrapper * { box-sizing: border-box; }
        
        /* --- Header Styles with Glassmorphism --- */
        .form-header { 
          background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); 
          color: white; 
          padding: 22px 28px; 
          text-align: center; 
          position: relative;
          overflow: hidden;
        }
        .form-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
          pointer-events: none;
        }
        .form-header::after {
          content: '';
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          background: linear-gradient(45deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.1));
          z-index: -1;
          border-radius: inherit;
        }
        .logo-container { 
          margin-bottom: 10px; 
          position: relative;
          z-index: 1;
        }
        .logo-container img { 
          max-height: 36px; 
          max-width: 160px; 
          object-fit: contain;
        }
        .form-header h2 { 
          margin: 0 0 6px 0; 
          font-family: 'Inter', sans-serif; 
          font-size: 20px; 
          font-weight: 700; 
          letter-spacing: -0.3px;
          position: relative;
          z-index: 1;
        }
        .form-header p { 
          margin: 0; 
          font-family: 'Inter', sans-serif; 
          font-size: 13px; 
          opacity: 0.95; 
          line-height: 1.4;
          position: relative;
          z-index: 1;
        }
        
        /* --- Content Area --- */
        .form-content { 
          flex: 1; 
          padding: 32px 28px 20px 28px; 
          font-family: 'Inter', sans-serif; 
          background: ${backgroundColor};
          overflow-y: auto;
        }
        
        /* --- Form Steps --- */
        .form-step { 
          display: none; 
          animation: fadeInUp 0.3s ease-out;
        }
        .form-step.active { 
          display: block; 
        }
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(12px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        
        /* --- Compact Form Elements --- */
        .form-group { 
          margin-bottom: 22px; 
          position: relative; 
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-group label { 
          display: block; 
          margin-bottom: 8px; 
          font-weight: 600; 
          color: ${textColor}; 
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .form-group input, .form-group select { 
          width: 100%; 
          padding: 14px 16px; 
          border-radius: 10px; 
          border: 1.5px solid ${borderColor}; 
          font-size: 15px; 
          font-family: 'Inter', sans-serif; 
          transition: all 0.2s ease;
          background: ${accentColor};
        }
        .form-group input::placeholder { 
          color: #94A3B8; 
          font-size: 14px;
        }
        .form-group input:focus, .form-group select:focus { 
          outline: none; 
          border-color: ${primaryColor}; 
          box-shadow: 0 0 0 3px rgba(237, 67, 65, 0.15);
          background: ${accentColor};
          transform: translateY(-1px);
        }
        
        /* --- Compact Checkbox --- */
        .checkbox-group { 
          display: flex; 
          align-items: flex-start; 
          margin: 16px 0 0 0; 
          gap: 10px;
        }
        .checkbox-wrapper {
          position: relative;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .checkbox-wrapper input[type="checkbox"] {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid ${borderColor};
          border-radius: 4px;
          background: ${accentColor};
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .checkbox-wrapper input[type="checkbox"]:checked {
          background: ${primaryColor};
          border-color: ${primaryColor};
          transform: scale(1.05);
        }
        .checkbox-wrapper input[type="checkbox"]:checked::before {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
        .checkbox-group label { 
          margin-bottom: 0; 
          font-size: 11px; 
          line-height: 1.4;
          font-weight: 400;
          text-transform: none;
          letter-spacing: normal;
          color: #64748B;
        }
        .checkbox-group a { 
          color: ${primaryColor}; 
          text-decoration: underline; 
        }
        
        /* --- Loading State --- */
        .loading-container { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          text-align: center; 
          padding: 40px 20px;
          height: 100%;
        }
        .spinner { 
          width: 40px; 
          height: 40px; 
          border: 3px solid rgba(237, 67, 65, 0.2); 
          border-top-color: ${primaryColor}; 
          border-radius: 50%; 
          animation: spin 0.8s linear infinite; 
          margin-bottom: 16px;
        }
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        .loading-text {
          color: ${textColor};
          font-size: 16px;
          font-weight: 600;
        }
        
        /* --- Success State --- */
        .success-container { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          text-align: center; 
          padding: 30px 20px;
          height: 100%;
        }
        .success-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #10B981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          animation: successPulse 0.5s ease-out;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        }
        @keyframes successPulse {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .success-icon svg {
          width: 30px;
          height: 30px;
          color: white;
        }
        .success-title {
          color: ${textColor};
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .success-message {
          color: #64748B;
          font-size: 14px;
          line-height: 1.5;
        }
        
        /* --- Button Styling --- */
        .btn-container { 
          padding: 18px 28px; 
          border-top: 1px solid ${borderColor}; 
          background: ${pinkAccent};
        }
        .btn { 
          width: 100%;
          padding: 16px 24px; 
          border-radius: 12px; 
          font-family: 'Inter', sans-serif; 
          font-weight: 600; 
          font-size: 15px;
          cursor: pointer; 
          border: none; 
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
          text-transform: uppercase;
          letter-spacing: 0.8px;
          position: relative;
          overflow: hidden;
        }
        .btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
          transition: opacity 0.2s ease;
          opacity: 0;
        }
        .btn:hover::before {
          opacity: 1;
        }
        .btn-primary { 
          background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); 
          color: white; 
          box-shadow: 0 4px 20px rgba(237, 67, 65, 0.3);
        }
        .btn-primary:hover:not(:disabled) { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 25px rgba(237, 67, 65, 0.4);
        }
        .btn-primary:disabled { 
          background: #CBD5E1; 
          cursor: not-allowed; 
          transform: none;
          box-shadow: none;
        }
        
        /* --- Error Styling --- */
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #DC2626;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 12px;
          margin-top: 12px;
          backdrop-filter: blur(10px);
        }
        
        /* --- Responsive Design --- */
        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .form-content {
            padding: 20px 20px 12px 20px;
          }
          .form-header {
            padding: 16px 20px;
          }
          .form-header h2 {
            font-size: 18px;
          }
          .btn-container {
            padding: 14px 20px;
          }
        }
      </style>

      <div class="form-header">
        ${showLogo ? `
          <div class="logo-container">
            <img src="${logoUrl}" alt="Discover Destinations Logo" onerror="this.style.display='none'">
          </div>
        ` : ''}
        <h2>${formTitle}</h2>
        <p>${formSubtitle}</p>
      </div>

      <div class="form-content">
        <!-- Form Step -->
        <div id="form-step" class="form-step active">
          <form id="lead-form" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label for="first-name">First Name</label>
                <input type="text" id="first-name" name="firstName" placeholder="John" required>
              </div>
              <div class="form-group">
                <label for="last-name">Last Name</label>
                <input type="text" id="last-name" name="lastName" placeholder="Smith" required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="john.smith@email.com" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone" placeholder="+1 (555) 123-4567" required>
              </div>
              <div class="form-group">
                <label for="destination">Destination</label>
                <select id="destination" name="destination" required>
                  <option value="">Choose...</option>
                  <option value="Canada">Canada</option>
                  <option value="USA">USA</option>
                  <option value="Latin America">Latin America</option>
                  <option value="Caribbean">Caribbean</option>
                  <option value="Europe">Europe</option>
                  <option value="Middle East">Middle East</option>
                  <option value="Asia">Asia</option>
                  <option value="Australia & NZ">Australia & NZ</option>
                  <option value="Africa">Africa</option>
                </select>
              </div>
            </div>
            
            <div class="checkbox-group">
              <div class="checkbox-wrapper">
                <input type="checkbox" id="privacy-consent" name="privacyConsent" required>
              </div>
              <label for="privacy-consent">
                I want a personalized itinerary and agree to the <a href="#" target="_blank">Privacy Policy</a>.
              </label>
            </div>
            
            <div id="error-container"></div>
          </form>
        </div>
        
        <!-- Loading Step -->
        <div id="loading-step" class="form-step">
          <div class="loading-container">
            <div class="spinner"></div>
            <div class="loading-text">Creating your adventure...</div>
          </div>
        </div>
        
        <!-- Success Step -->
        <div id="success-step" class="form-step">
          <div class="success-container">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="success-title">Your Adventure Awaits!</h3>
            <p class="success-message">
              We'll contact you within 24 hours with an amazing personalized quote. Get ready to discover your dream destination!
            </p>
          </div>
        </div>
      </div>

      <div class="btn-container">
        <button id="submit-btn" class="btn btn-primary">Get My Custom Itinerary</button>
      </div>
    `;

    // --- Append to DOM ---
    container.appendChild(wrapper);
    element.appendChild(container);

    if (animateIn) {
      setTimeout(() => {
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translateY(0) scale(1)';
      }, 50);
    }

    // --- Helper Functions ---
    function showStep(stepId) {
      const steps = wrapper.querySelectorAll('.form-step');
      steps.forEach(step => step.classList.remove('active'));
      
      const targetStep = wrapper.querySelector(`#${stepId}-step`);
      if (targetStep) {
        targetStep.classList.add('active');
        currentStep = stepId;
        
        // Hide/show button container based on step
        const btnContainer = wrapper.querySelector('.btn-container');
        btnContainer.style.display = (stepId === 'form') ? 'block' : 'none';
      }
    }

    function showError(message) {
      const errorContainer = wrapper.querySelector('#error-container');
      errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    }

    function clearError() {
      const errorContainer = wrapper.querySelector('#error-container');
      errorContainer.innerHTML = '';
    }

    function validateForm() {
      const form = wrapper.querySelector('#lead-form');
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#EF4444';
        } else {
          field.style.borderColor = borderColor;
        }
      });
      
      // Validate email format
      const emailField = wrapper.querySelector('#email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailField.value && !emailRegex.test(emailField.value)) {
        isValid = false;
        emailField.style.borderColor = '#EF4444';
      }
      
      return isValid;
    }

    async function sendToWebhook(formData) {
      try {
        // Clean and escape conversation history if it exists
        let cleanConversationHistory = conversationHistory;
        if (conversationHistory && typeof conversationHistory === 'string') {
          // Remove or replace problematic characters
          cleanConversationHistory = conversationHistory
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
            .replace(/"/g, '\\"');
        }

        // Enhanced payload with conversation history and metadata
        const payload = {
          lead: formData,
          conversationData: {
            history: cleanConversationHistory,
            conversationId: conversationId,
            userId: userId,
            timestamp: new Date().toISOString()
          },
          source: 'Voiceflow Lead Form',
          formType: 'Discover Destinations Lead Capture',
          timestamp: new Date().toISOString()
        };

        // Log the payload for debugging (remove in production)
        console.log('Sending payload to webhook:', JSON.stringify(payload, null, 2));

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Successfully sent lead to webhook');
        return true;
      } catch (error) {
        console.error('Error sending data to webhook:', error);
        return true; // For demo purposes, still show success
      }
    }

    // --- Event Listeners ---
    const submitBtn = wrapper.querySelector('#submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        clearError();
        
        if (!validateForm()) {
          showError('Please fill out all required fields correctly.');
          return;
        }
        
        isSubmitting = true;
        showStep('loading');
        
        // Collect form data
        const formData = {
          firstName: wrapper.querySelector('#first-name').value.trim(),
          lastName: wrapper.querySelector('#last-name').value.trim(),
          email: wrapper.querySelector('#email').value.trim(),
          phone: wrapper.querySelector('#phone').value.trim(),
          destination: wrapper.querySelector('#destination').value
        };
        
        const success = await sendToWebhook(formData);
        
        if (success) {
          showStep('success');
        } else {
          showStep('form');
          showError('Oops! Something went wrong. Please try again.');
        }
        
        isSubmitting = false;
      });
    }

    // --- Real-time validation feedback ---
    const inputs = wrapper.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.style.borderColor = '#EF4444';
        } else {
          input.style.borderColor = borderColor;
        }
      });
      
      input.addEventListener('input', () => {
        if (input.style.borderColor === 'rgb(239, 68, 68)') {
          input.style.borderColor = borderColor;
        }
      });
    });

    // --- Cleanup function ---
    return function cleanup() {
      // Any cleanup code if needed
    };
  }
};

// YRS: DiscoverDestinationsLeadForm - VERSION 2 (MOBILE RESPONSIVENESS?)(19 SEP 2025, 14:20 CEST)
// Updated for mobile compatibility - using global scope instead of ES6 modules

window.DiscoverDestinationsLeadForm2 = {
  name: 'DiscoverDestinationsLeadForm2',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_discoverLeadForm2' || trace.payload?.name === 'ext_discoverLeadForm2',
  render: ({ trace, element }) => {
    // --- Configuration from Voiceflow Payload ---
    const {
      formTitle = 'Let\'s Plan Your Dream Trip!',
      formSubtitle = 'Get a personalized itinerary crafted just for you!',
      height = '620',
      backgroundColor = '#FFFFFF',
      maxWidth = '460px',
      // --- Updated branding with red theme and selective pink accents ---
      primaryColor = '#ED4341', // Main red
      secondaryColor = '#FF6B69', // Lighter red
      accentColor = '#FFFFFF',
      textColor = '#2C3E50',
      lightGray = '#F8F9FA',
      borderColor = '#E5E8EB',
      glassColor = 'rgba(237, 67, 65, 0.1)',
      pinkAccent = '#fde8e8', // Soft pink for header and button backgrounds
      // --- Border & Shadow ---
      borderWidth = '1px',
      borderStyle = 'solid',
      borderRadius = '16px',
      shadowColor = 'rgba(237, 67, 65, 0.25)',
      shadowSize = '12px',
      animateIn = true,
      // --- Logo Configuration ---
      logoUrl = 'https://yannicksegaar.github.io/2025-09_C0001_WinterTour_ReverseLeadMagnet_DEMOS/DiscoverDestinations_Voiceflow_Avatar.png',
      showLogo = true,
      // --- Conversation History from Voiceflow ---
      conversationHistory = null, // This will contain the vf_memory data
      conversationId = null,
      userId = null,
    } = trace.payload || {};

    // --- N8N Webhook URL ---
    const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/your-webhook-id';

    // --- State Variables ---
    let currentStep = 'form';
    let isSubmitting = false;

    // --- Initial Setup ---
    element.innerHTML = '';
    const container = document.createElement('div');
    container.style.cssText = 'width: 100%; display: flex; justify-content: center; align-items: flex-start; background-color: transparent; margin: 0; padding: 8px 0;';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'discover-lead-form-wrapper';
    
    // Responsive width based on screen size
    const isMobile = window.innerWidth <= 768;
    const responsiveWidth = isMobile ? '95vw' : maxWidth;
    const responsiveMaxWidth = isMobile ? '400px' : maxWidth;
    
    wrapper.style.cssText = `
      width: ${responsiveWidth}; min-width: 300px; max-width: ${responsiveMaxWidth};
      border: ${borderWidth} ${borderStyle} ${borderColor}; border-radius: ${borderRadius};
      overflow: hidden; background: ${backgroundColor};
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 8px ${shadowSize} ${shadowColor}, 0 0 0 1px rgba(255,255,255,0.1);
      height: ${height}px; display: flex; flex-direction: column; margin: 0 auto; position: relative;
    `;
    
    if (animateIn) {
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(15px) scale(0.98)';
      wrapper.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // --- HTML & CSS for the lead form ---
    wrapper.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .discover-lead-form-wrapper * { box-sizing: border-box; }
        
        /* --- Header Styles with Glassmorphism --- */
        .form-header { 
          background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); 
          color: white; 
          padding: 22px 28px; 
          text-align: center; 
          position: relative;
          overflow: hidden;
        }
        .form-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
          pointer-events: none;
        }
        .form-header::after {
          content: '';
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          background: linear-gradient(45deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.1));
          z-index: -1;
          border-radius: inherit;
        }
        .logo-container { 
          margin-bottom: 10px; 
          position: relative;
          z-index: 1;
        }
        .logo-container img { 
          max-height: 36px; 
          max-width: 160px; 
          object-fit: contain;
        }
        .form-header h2 { 
          margin: 0 0 6px 0; 
          font-family: 'Inter', sans-serif; 
          font-size: 20px; 
          font-weight: 700; 
          letter-spacing: -0.3px;
          position: relative;
          z-index: 1;
        }
        .form-header p { 
          margin: 0; 
          font-family: 'Inter', sans-serif; 
          font-size: 13px; 
          opacity: 0.95; 
          line-height: 1.4;
          position: relative;
          z-index: 1;
        }
        
        /* --- Content Area --- */
        .form-content { 
          flex: 1; 
          padding: 32px 28px 20px 28px; 
          font-family: 'Inter', sans-serif; 
          background: ${backgroundColor};
          overflow-y: auto;
        }
        
        /* --- Form Steps --- */
        .form-step { 
          display: none; 
          animation: fadeInUp 0.3s ease-out;
        }
        .form-step.active { 
          display: block; 
        }
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(12px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        
        /* --- Compact Form Elements --- */
        .form-group { 
          margin-bottom: 22px; 
          position: relative; 
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-group label { 
          display: block; 
          margin-bottom: 8px; 
          font-weight: 600; 
          color: ${textColor}; 
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .form-group input, .form-group select { 
          width: 100%; 
          padding: 14px 16px; 
          border-radius: 10px; 
          border: 1.5px solid ${borderColor}; 
          font-size: 15px; 
          font-family: 'Inter', sans-serif; 
          transition: all 0.2s ease;
          background: ${accentColor};
        }
        .form-group input::placeholder { 
          color: #94A3B8; 
          font-size: 14px;
        }
        .form-group input:focus, .form-group select:focus { 
          outline: none; 
          border-color: ${primaryColor}; 
          box-shadow: 0 0 0 3px rgba(237, 67, 65, 0.15);
          background: ${accentColor};
          transform: translateY(-1px);
        }
        
        /* --- Compact Checkbox --- */
        .checkbox-group { 
          display: flex; 
          align-items: flex-start; 
          margin: 16px 0 0 0; 
          gap: 10px;
        }
        .checkbox-wrapper {
          position: relative;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .checkbox-wrapper input[type="checkbox"] {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid ${borderColor};
          border-radius: 4px;
          background: ${accentColor};
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .checkbox-wrapper input[type="checkbox"]:checked {
          background: ${primaryColor};
          border-color: ${primaryColor};
          transform: scale(1.05);
        }
        .checkbox-wrapper input[type="checkbox"]:checked::before {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
        .checkbox-group label { 
          margin-bottom: 0; 
          font-size: 11px; 
          line-height: 1.4;
          font-weight: 400;
          text-transform: none;
          letter-spacing: normal;
          color: #64748B;
        }
        .checkbox-group a { 
          color: ${primaryColor}; 
          text-decoration: underline; 
        }
        
        /* --- Loading State --- */
        .loading-container { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          text-align: center; 
          padding: 40px 20px;
          height: 100%;
        }
        .spinner { 
          width: 40px; 
          height: 40px; 
          border: 3px solid rgba(237, 67, 65, 0.2); 
          border-top-color: ${primaryColor}; 
          border-radius: 50%; 
          animation: spin 0.8s linear infinite; 
          margin-bottom: 16px;
        }
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        .loading-text {
          color: ${textColor};
          font-size: 16px;
          font-weight: 600;
        }
        
        /* --- Success State --- */
        .success-container { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          text-align: center; 
          padding: 30px 20px;
          height: 100%;
        }
        .success-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #10B981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          animation: successPulse 0.5s ease-out;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        }
        @keyframes successPulse {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .success-icon svg {
          width: 30px;
          height: 30px;
          color: white;
        }
        .success-title {
          color: ${textColor};
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .success-message {
          color: #64748B;
          font-size: 14px;
          line-height: 1.5;
        }
        
        /* --- Button Styling --- */
        .btn-container { 
          padding: 18px 28px; 
          border-top: 1px solid ${borderColor}; 
          background: ${pinkAccent};
        }
        .btn { 
          width: 100%;
          padding: 16px 24px; 
          border-radius: 12px; 
          font-family: 'Inter', sans-serif; 
          font-weight: 600; 
          font-size: 15px;
          cursor: pointer; 
          border: none; 
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
          text-transform: uppercase;
          letter-spacing: 0.8px;
          position: relative;
          overflow: hidden;
        }
        .btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
          transition: opacity 0.2s ease;
          opacity: 0;
        }
        .btn:hover::before {
          opacity: 1;
        }
        .btn-primary { 
          background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); 
          color: white; 
          box-shadow: 0 4px 20px rgba(237, 67, 65, 0.3);
        }
        .btn-primary:hover:not(:disabled) { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 25px rgba(237, 67, 65, 0.4);
        }
        .btn-primary:disabled { 
          background: #CBD5E1; 
          cursor: not-allowed; 
          transform: none;
          box-shadow: none;
        }
        
        /* --- Error Styling --- */
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #DC2626;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 12px;
          margin-top: 12px;
          backdrop-filter: blur(10px);
        }
        
        /* --- Responsive Design --- */
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .form-content {
            padding: 24px 20px 16px 20px;
          }
          .form-header {
            padding: 18px 20px;
          }
          .form-header h2 {
            font-size: 18px;
            line-height: 1.3;
          }
          .form-header p {
            font-size: 12px;
          }
          .logo-container img {
            max-height: 32px;
          }
          .btn-container {
            padding: 16px 20px;
          }
          .form-group {
            margin-bottom: 18px;
          }
          .form-group input, .form-group select {
            padding: 12px 14px;
            font-size: 16px; /* Prevents zoom on iOS */
          }
          .checkbox-group {
            margin: 12px 0 0 0;
          }
          .checkbox-group label {
            font-size: 12px;
          }
        }
        
        @media (max-width: 480px) {
          .form-header {
            padding: 16px 16px;
          }
          .form-content {
            padding: 20px 16px 12px 16px;
          }
          .btn-container {
            padding: 14px 16px;
          }
          .form-group input, .form-group select {
            padding: 14px 12px;
            font-size: 16px;
          }
          .btn {
            padding: 14px 20px;
            font-size: 14px;
            letter-spacing: 0.6px;
          }
          .error-message {
            font-size: 11px;
            padding: 8px 12px;
          }
        }
        
        @media (max-width: 360px) {
          .form-header h2 {
            font-size: 16px;
          }
          .form-header p {
            font-size: 11px;
          }
          .form-group label {
            font-size: 12px;
          }
        }
      </style>

      <div class="form-header">
        ${showLogo ? `
          <div class="logo-container">
            <img src="${logoUrl}" alt="Discover Destinations Logo" onerror="this.style.display='none'">
          </div>
        ` : ''}
        <h2>${formTitle}</h2>
        <p>${formSubtitle}</p>
      </div>

      <div class="form-content">
        <!-- Form Step -->
        <div id="form-step" class="form-step active">
          <form id="lead-form" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label for="first-name">First Name</label>
                <input type="text" id="first-name" name="firstName" placeholder="John" required>
              </div>
              <div class="form-group">
                <label for="last-name">Last Name</label>
                <input type="text" id="last-name" name="lastName" placeholder="Smith" required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="john.smith@email.com" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone" placeholder="+1 (555) 123-4567" required>
              </div>
              <div class="form-group">
                <label for="destination">Destination</label>
                <select id="destination" name="destination" required>
                  <option value="">Choose...</option>
                  <option value="caribbean">Caribbean</option>
                  <option value="hawaii">Hawaii</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                  <option value="middle-east">Middle East</option>
                  <option value="australia-nz">Australia & NZ</option>
                  <option value="africa">Africa</option>
                  <option value="latin-america">Latin America</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div class="checkbox-group">
              <div class="checkbox-wrapper">
                <input type="checkbox" id="privacy-consent" name="privacyConsent" required>
              </div>
              <label for="privacy-consent">
                I want a personalized itinerary and agree to the <a href="#" target="_blank">Privacy Policy</a>.
              </label>
            </div>
            
            <div id="error-container"></div>
          </form>
        </div>
        
        <!-- Loading Step -->
        <div id="loading-step" class="form-step">
          <div class="loading-container">
            <div class="spinner"></div>
            <div class="loading-text">Creating your adventure...</div>
          </div>
        </div>
        
        <!-- Success Step -->
        <div id="success-step" class="form-step">
          <div class="success-container">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="success-title">Your Adventure Awaits!</h3>
            <p class="success-message">
              We'll contact you within 24 hours with an amazing personalized quote. Get ready to discover your dream destination!
            </p>
          </div>
        </div>
      </div>

      <div class="btn-container">
        <button id="submit-btn" class="btn btn-primary">Get My Custom Itinerary</button>
      </div>
    `;

    // --- Append to DOM ---
    container.appendChild(wrapper);
    element.appendChild(container);

    if (animateIn) {
      setTimeout(() => {
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translateY(0) scale(1)';
      }, 50);
    }

    // --- Helper Functions ---
    function showStep(stepId) {
      const steps = wrapper.querySelectorAll('.form-step');
      steps.forEach(step => step.classList.remove('active'));
      
      const targetStep = wrapper.querySelector(`#${stepId}-step`);
      if (targetStep) {
        targetStep.classList.add('active');
        currentStep = stepId;
        
        // Hide/show button container based on step
        const btnContainer = wrapper.querySelector('.btn-container');
        btnContainer.style.display = (stepId === 'form') ? 'block' : 'none';
      }
    }

    function showError(message) {
      const errorContainer = wrapper.querySelector('#error-container');
      errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    }

    function clearError() {
      const errorContainer = wrapper.querySelector('#error-container');
      errorContainer.innerHTML = '';
    }

    function validateForm() {
      const form = wrapper.querySelector('#lead-form');
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#EF4444';
        } else {
          field.style.borderColor = borderColor;
        }
      });
      
      // Validate email format
      const emailField = wrapper.querySelector('#email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailField.value && !emailRegex.test(emailField.value)) {
        isValid = false;
        emailField.style.borderColor = '#EF4444';
      }
      
      return isValid;
    }

    async function sendToWebhook(formData) {
      try {
        // Clean and escape conversation history if it exists
        let cleanConversationHistory = conversationHistory;
        if (conversationHistory && typeof conversationHistory === 'string') {
          // Remove or replace problematic characters
          cleanConversationHistory = conversationHistory
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
            .replace(/"/g, '\\"');
        }

        // Enhanced payload with conversation history and metadata
        const payload = {
          lead: formData,
          conversationData: {
            history: cleanConversationHistory,
            conversationId: conversationId,
            userId: userId,
            timestamp: new Date().toISOString()
          },
          source: 'Voiceflow Lead Form',
          formType: 'Discover Destinations Lead Capture',
          timestamp: new Date().toISOString()
        };

        // Log the payload for debugging (remove in production)
        console.log('Sending payload to webhook:', JSON.stringify(payload, null, 2));

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Successfully sent lead to webhook');
        return true;
      } catch (error) {
        console.error('Error sending data to webhook:', error);
        return true; // For demo purposes, still show success
      }
    }

    // --- Event Listeners ---
    const submitBtn = wrapper.querySelector('#submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        clearError();
        
        if (!validateForm()) {
          showError('Please fill out all required fields correctly.');
          return;
        }
        
        isSubmitting = true;
        showStep('loading');
        
        // Collect form data
        const formData = {
          firstName: wrapper.querySelector('#first-name').value.trim(),
          lastName: wrapper.querySelector('#last-name').value.trim(),
          email: wrapper.querySelector('#email').value.trim(),
          phone: wrapper.querySelector('#phone').value.trim(),
          destination: wrapper.querySelector('#destination').value
        };
        
        const success = await sendToWebhook(formData);
        
        if (success) {
          showStep('success');
        } else {
          showStep('form');
          showError('Oops! Something went wrong. Please try again.');
        }
        
        isSubmitting = false;
      });
    }

    // --- Real-time validation feedback ---
    const inputs = wrapper.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.style.borderColor = '#EF4444';
        } else {
          input.style.borderColor = borderColor;
        }
      });
      
      input.addEventListener('input', () => {
        if (input.style.borderColor === 'rgb(239, 68, 68)') {
          input.style.borderColor = borderColor;
        }
      });
    });

    // --- Cleanup function ---
    return function cleanup() {
      // Any cleanup code if needed
    };
  }
};