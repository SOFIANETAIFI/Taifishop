// Configuration - Replace with your Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/{YOUR_DEPLOYMENT_ID}/userweb?e=YourEmailHere';

// Form submission handler
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.submit-button');
    const form = this;
    
    // Collect form data
    const formData = {
        timestamp: new Date().toLocaleString('ar-AE'),
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value || 'لم يتم تحديد',
        city: document.getElementById('city').value,
        address: document.getElementById('address').value,
        quantity: parseInt(document.getElementById('quantity').value),
        notes: document.getElementById('notes').value || 'لا توجد ملاحظات',
        totalPrice: document.getElementById('totalPrice').textContent
    };

    // Validate phone number
    if (!isValidPhoneNumber(formData.phone)) {
        showError('يرجى إدخال رقم هاتف صحيح (مثال: 971501234567)');
        return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري معالجة الطلب...';

    try {
        // Send data to Google Apps Script
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Show success message
        showSuccess('تم استقبال طلبك بنجاح! سيتصل بك فريقنا قريباً.');
        
        // Reset form
        form.reset();
        document.getElementById('totalPrice').textContent = '99';
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'تأكيد الطلب';

    } catch (error) {
        console.error('Error:', error);
        showError('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'تأكيد الطلب';
    }
});

// Calculate total price based on quantity
document.getElementById('quantity').addEventListener('change', function() {
    const quantity = parseInt(this.value) || 1;
    const unitPrice = 99;
    const totalPrice = quantity * unitPrice;
    document.getElementById('totalPrice').textContent = totalPrice;
});

// Phone number validation
function isValidPhoneNumber(phone) {
    // Basic validation for UAE phone numbers
    const phoneRegex = /^(?:\+971|971|0)?(?:5[0-9]|6[0-9]|7[0-9])[0-9]{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Show success message
function showSuccess(message) {
    removeMessages();
    const form = document.getElementById('orderForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    form.insertBefore(successDiv, form.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Show error message
function showError(message) {
    removeMessages();
    const form = document.getElementById('orderForm');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    form.insertBefore(errorDiv, form.firstChild);
}

// Remove all messages
function removeMessages() {
    const messages = document.querySelectorAll('.success-message, .error-message');
    messages.forEach(msg => msg.remove());
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#order') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and steps
document.querySelectorAll('.feature-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Landing page loaded successfully');
    
    // Set initial quantity price
    updateTotalPrice();
});

function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const unitPrice = 99;
    const totalPrice = quantity * unitPrice;
    document.getElementById('totalPrice').textContent = totalPrice;
}

// Format phone input
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    // Allow up to 12 digits
    if (value.length > 12) {
        value = value.slice(0, 12);
    }
    e.target.value = value;
});