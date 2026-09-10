// DOM Elements
const templateSelect = document.getElementById('template');
const headlineInput = document.getElementById('headline');
const subheadlineInput = document.getElementById('subheadline');
const bodyTextInput = document.getElementById('body-text');
const ctaButtonInput = document.getElementById('cta-button');
const primaryColorInput = document.getElementById('primary-color');
const secondaryColorInput = document.getElementById('secondary-color');
const textColorInput = document.getElementById('text-color');
const mockupContainer = document.getElementById('mockup');
const previewBtn = document.getElementById('preview-btn');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');

// Event Listeners
templateSelect.addEventListener('change', generateMockup);
headlineInput.addEventListener('input', generateMockup);
subheadlineInput.addEventListener('input', generateMockup);
bodyTextInput.addEventListener('input', generateMockup);
ctaButtonInput.addEventListener('input', generateMockup);
primaryColorInput.addEventListener('change', generateMockup);
secondaryColorInput.addEventListener('change', generateMockup);
textColorInput.addEventListener('change', generateMockup);
previewBtn.addEventListener('click', generateMockup);
downloadBtn.addEventListener('click', downloadMockup);
resetBtn.addEventListener('click', resetForm);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    generateMockup();
});

/**
 * Generate mockup based on selected template and user inputs
 */
function generateMockup() {
    const template = templateSelect.value;
    const headline = headlineInput.value;
    const subheadline = subheadlineInput.value;
    const bodyText = bodyTextInput.value;
    const ctaButtonText = ctaButtonInput.value;
    const primaryColor = primaryColorInput.value;
    const secondaryColor = secondaryColorInput.value;
    const textColor = textColorInput.value;

    let mockupHTML = '';

    switch (template) {
        case 'social-media':
            mockupHTML = generateSocialMediaMockup(headline, subheadline, bodyText, ctaButtonText, primaryColor, secondaryColor, textColor);
            break;
        case 'email-header':
            mockupHTML = generateEmailHeaderMockup(headline, subheadline, bodyText, ctaButtonText, primaryColor, secondaryColor, textColor);
            break;
        case 'banner':
            mockupHTML = generateBannerMockup(headline, subheadline, bodyText, ctaButtonText, primaryColor, secondaryColor, textColor);
            break;
        case 'flyer':
            mockupHTML = generateFlyerMockup(headline, subheadline, bodyText, ctaButtonText, primaryColor, secondaryColor, textColor);
            break;
        case 'business-card':
            mockupHTML = generateBusinessCardMockup(headline, subheadline, bodyText, ctaButtonText, primaryColor, secondaryColor, textColor);
            break;
        default:
            mockupHTML = generateSocialMediaMockup(headline, subheadline, bodyText, ctaButtonText, primaryColor, secondaryColor, textColor);
    }

    mockupContainer.innerHTML = mockupHTML;
}

/**
 * Social Media Post Template
 */
function generateSocialMediaMockup(headline, subheadline, bodyText, cta, primary, secondary, textColor) {
    return `
        <div class="mockup social-media" style="background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%); color: ${textColor};">
            <h1 style="color: white;">${headline}</h1>
            <h2 style="color: rgba(255, 255, 255, 0.9);">${subheadline}</h2>
            <p style="color: rgba(255, 255, 255, 0.85);">${bodyText}</p>
            <button class="cta-button" style="background-color: white; color: ${primary};">${cta}</button>
        </div>
    `;
}

/**
 * Email Header Template
 */
function generateEmailHeaderMockup(headline, subheadline, bodyText, cta, primary, secondary, textColor) {
    return `
        <div class="mockup email-header" style="background: linear-gradient(to right, ${primary} 0%, ${secondary} 100%); color: white;">
            <h1 style="color: white; font-size: 2.2em; margin-bottom: 10px;">${headline}</h1>
            <h2 style="color: rgba(255, 255, 255, 0.95); font-size: 1.4em; margin-bottom: 15px;">${subheadline}</h2>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 1em; line-height: 1.6; margin-bottom: 20px;">${bodyText}</p>
            <button class="cta-button" style="background-color: white; color: ${primary}; font-size: 1em;">${cta}</button>
        </div>
    `;
}

/**
 * Web Banner Template
 */
function generateBannerMockup(headline, subheadline, bodyText, cta, primary, secondary, textColor) {
    return `
        <div class="mockup banner" style="background: linear-gradient(90deg, ${primary} 0%, ${secondary} 100%); display: flex; flex-direction: column; justify-content: center;">
            <h1 style="color: white; font-size: 3em; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${headline}</h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.3em; margin: 15px 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">${subheadline}</p>
            <button class="cta-button" style="background-color: white; color: ${primary}; width: fit-content; margin-top: 20px;">${cta}</button>
        </div>
    `;
}

/**
 * Flyer Template
 */
function generateFlyerMockup(headline, subheadline, bodyText, cta, primary, secondary, textColor) {
    return `
        <div class="mockup flyer" style="background: white; border-top: 8px solid ${primary}; border-bottom: 8px solid ${secondary};">
            <div style="padding: 20px;">
                <h1 style="color: ${primary}; font-size: 2em; margin-bottom: 10px;">${headline}</h1>
                <h2 style="color: ${secondary}; font-size: 1.4em; margin-bottom: 15px;">${subheadline}</h2>
                <p style="color: ${textColor}; font-size: 0.95em; line-height: 1.6; margin-bottom: 20px;">${bodyText}</p>
                <button class="cta-button" style="background-color: ${primary}; color: white;">${cta}</button>
            </div>
        </div>
    `;
}

/**
 * Business Card Template
 */
function generateBusinessCardMockup(headline, subheadline, bodyText, cta, primary, secondary, textColor) {
    return `
        <div class="mockup business-card" style="background: ${primary}; color: white; display: flex; flex-direction: column; justify-content: space-between; padding: 20px;">
            <div>
                <h1 style="color: white; font-size: 1.6em; margin-bottom: 5px;">${headline}</h1>
                <h2 style="color: ${secondary}; font-size: 0.9em; margin-bottom: 10px;">${subheadline}</h2>
            </div>
            <div style="font-size: 0.85em; line-height: 1.5; border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 15px;">
                <p>${bodyText}</p>
            </div>
        </div>
    `;
}

/**
 * Download mockup as image
 */
function downloadMockup() {
    const mockup = document.querySelector('.mockup');
    
    if (!mockup) {
        showMessage('No mockup to download!', 'error');
        return;
    }

    // Dynamically load html2canvas library from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => {
        html2canvas(mockup, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false
        }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `marketing-mockup-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showMessage('Mockup downloaded successfully!', 'success');
        }).catch(err => {
            console.error('Error generating image:', err);
            showMessage('Failed to download mockup. Please try again.', 'error');
        });
    };
    script.onerror = () => {
        showMessage('Failed to load image library. Please try again.', 'error');
    };
    document.head.appendChild(script);
}

/**
 * Reset form to default values
 */
function resetForm() {
    headlineInput.value = 'Your Headline Here';
    subheadlineInput.value = 'Add a compelling message';
    bodyTextInput.value = 'Describe your product or service here. Make it compelling and clear.';
    ctaButtonInput.value = 'Learn More';
    primaryColorInput.value = '#0066cc';
    secondaryColorInput.value = '#ff6600';
    textColorInput.value = '#333333';
    templateSelect.value = 'social-media';
    
    generateMockup();
    showMessage('Form reset successfully!', 'info');
}

/**
 * Show message to user
 */
function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    const controlPanel = document.querySelector('.control-panel');
    controlPanel.insertBefore(message, controlPanel.firstChild);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

/**
 * Copy mockup styles and content for sharing
 */
function getMockupData() {
    return {
        template: templateSelect.value,
        headline: headlineInput.value,
        subheadline: subheadlineInput.value,
        bodyText: bodyTextInput.value,
        ctaButton: ctaButtonInput.value,
        primaryColor: primaryColorInput.value,
        secondaryColor: secondaryColorInput.value,
        textColor: textColorInput.value,
        timestamp: new Date().toISOString()
    };
}

/**
 * Load mockup data from saved state
 */
function loadMockupData(data) {
    if (data.template) templateSelect.value = data.template;
    if (data.headline) headlineInput.value = data.headline;
    if (data.subheadline) subheadlineInput.value = data.subheadline;
    if (data.bodyText) bodyTextInput.value = data.bodyText;
    if (data.ctaButton) ctaButtonInput.value = data.ctaButton;
    if (data.primaryColor) primaryColorInput.value = data.primaryColor;
    if (data.secondaryColor) secondaryColorInput.value = data.secondaryColor;
    if (data.textColor) textColorInput.value = data.textColor;
    
    generateMockup();
}

console.log('Marketing Material Mock-Up Generator initialized successfully!');
