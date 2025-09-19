// YRS: DiscoverDestinationsLeadForm VERSION 1 (17 SEP 2025, 17:22 CEST)

export const DiscoverDestinationsLeadForm1 = {
  name: 'DiscoverDestinationsLeadForm',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_discoverLeadForm1' || trace.payload?.name === 'ext_discoverLeadForm1',
  render: ({ trace, element }) => {
    // --- Configuration from Voiceflow Payload ---
    const {
      formTitle = 'Get Your Personalized Travel Quote',
      formSubtitle = 'Fill out the form below and one of our travel experts will contact you within 24 hours with a customized quote for your dream destination.',
      height = '650',
      backgroundColor = '#FFFFFF',
      maxWidth = '500px',
      // --- Branding based on Discover Destinations website ---
      primaryColor = '#2E86AB', // Ocean blue from website
      secondaryColor = '#4A90A4', // Lighter blue
      accentColor = '#FFFFFF',
      textColor = '#2C3E50',
      lightGray = '#F8F9FA',
      borderColor = '#E5E8EB',
      // --- Border & Shadow ---
      borderWidth = '1px',
      borderStyle = 'solid',
      borderRadius = '12px',
      shadowColor = 'rgba(46, 134, 171, 0.15)',
      shadowSize = '10px',
      animateIn = true,
      // --- Logo Configuration ---
      logoUrl = 'https://raw.githubusercontent.com/YannickSegaar/2025-09_C0001_WinterTour_ReverseLeadMagnet_DEMOS/main/demos/discover-destinations_6457ff07_JM/assets/DiscoverDestinations_Voiceflow_Avatar.png',
      showLogo = true,
    } = trace.payload || {};

    // --- N8N Webhook URL - Update this with your actual webhook URL ---
    const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/your-webhook-id';

    // --- State Variables ---
    let currentStep = 'form';
    let isSubmitting = false;

    // --- Initial Setup ---
    element.innerHTML = '';
    const container = document.createElement('div');
    container.style.cssText = 'width: 100%; display: flex; justify-content: center; align-items: flex-start; background-color: transparent; margin: 0; padding: 10px 0;';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'discover-lead-form-wrapper';
    wrapper.style.cssText = `
      width: ${maxWidth}; min-width: ${maxWidth}; max-width: ${maxWidth};
      border: ${borderWidth} ${borderStyle} ${borderColor}; border-radius: ${borderRadius};
      overflow: hidden; background-color: ${backgroundColor};
      box-shadow: 0 4px ${shadowSize} ${shadowColor}; min-height: ${height}px;
      display: flex; flex-direction: column; margin: 0 auto; position: relative;
    `;
    
    if (animateIn) {
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(20px)';
      wrapper.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }

    // --- Complete HTML & CSS for the lead form (truncated for brevity) ---
    wrapper.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        /* Complete CSS styling would be included here */
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
        <!-- Complete form HTML would be included here -->
      </div>

      <div class="btn-container">
        <button id="submit-btn" class="btn btn-primary">Get My Personal Quote</button>
      </div>
    `;

    // --- Append to DOM ---
    container.appendChild(wrapper);
    element.appendChild(container);

    // --- Event handlers and functionality would continue here ---
    
    return function cleanup() {
      // Cleanup code if needed
    };
  }
};