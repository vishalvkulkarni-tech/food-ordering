// Application data embedded directly to avoid loading issues
const APP_DATA = {
  "config": {
    "site_title": "Annapurna Kitchen",
    "mobile_number": "9766448463",
    "upi_id": "9766448463@apl",
    "upi_name": "Annapurna Kitchen",
    "LIVE": "TRUE",
    "working_hours_IST": "10 AM: 7 PM",
    "max_packaging_charge": 50,
    "convenience_fees": 0,
    "platform_fees": 0,
    "delivery_message": "Free for 5km radius, else depends on location sent via parcel services",
    "freshly_cooked_message": "As items are freshly cooked, it will take little time to serve you the authentic taste",
    "payment_completion_message": "Please share payment screenshot along with menu"
  },
  "coupons": [
    {
      "coupon_code": "SAVE10",
      "discount_perc": 10,
      "max_discount": 100,
      "min_order_value_for_coupon": 200
    },
    {
      "coupon_code": "WELCOME20",
      "discount_perc": 20,
      "max_discount": 150,
      "min_order_value_for_coupon": 300
    },
    {
      "coupon_code": "FLAT50",
      "discount_perc": 0,
      "max_discount": 50,
      "min_order_value_for_coupon": 250,
      "fixed_discount": 50
    }
  ],
  "menu": [
    {
      "name": "Puranpoli (1P)",
      "price": "89",
      "available": "true",
      "packaging_charge": 5,
      "image": "puranpoli.jpg"
    },
    {
      "name": "Puri Bhaji (4P Puri)",
      "price": "99",
      "available": "true",
      "packaging_charge": 12,
      "image": "puri_bhaji.jpg"
    },
    {
      "name": "Masalebhat (serves 1)",
      "price": "149",
      "available": "true",
      "packaging_charge": 10,
      "image": "masalebhat.jpg"
    },
    {
      "name": "Masalebhat (serves 2/3)",
      "price": "289",
      "available": "true",
      "packaging_charge": 20,
      "image": "masalebhat_large.jpg"
    },
    {
      "name": "Kothimbir Vadi (6P)",
      "price": "59",
      "available": "true",
      "packaging_charge": 5,
      "image": "kothimbir_vadi.jpg"
    },
    {
      "name": "Batata Vada (4P)",
      "price": "99",
      "available": "true",
      "packaging_charge": 15,
      "image": "batata_vada.jpg"
    },
    {
      "name": "Fried Modak (11P)",
      "price": "149",
      "available": "true",
      "packaging_charge": 15,
      "image": "fried_modak.jpg"
    },
    {
      "name": "Fried Modak (21P)",
      "price": "249",
      "available": "true",
      "packaging_charge": 25,
      "image": "fried_modak_large.jpg"
    },
    {
      "name": "Besan Ladu (Approx 250gms)",
      "price": "249",
      "available": "true",
      "packaging_charge": 15,
      "image": "besan_ladu.jpg"
    },
    {
      "name": "Onion Thalipith (2P)",
      "price": "99",
      "available": "true",
      "packaging_charge": 8,
      "image": "onion_thalipith.jpg"
    },
    {
      "name": "Kothimbir Thalipith (2P)",
      "price": "129",
      "available": "true",
      "packaging_charge": 8,
      "image": "kothimbir_thalipith.jpg"
    },
    {
      "name": "Sabudana Ladu (Approx 250gms)",
      "price": "249",
      "available": "true",
      "packaging_charge": 15,
      "image": "sabudana_ladu.jpg"
    },
    {
      "name": "Shengdana Ladu (Approx 250gms)",
      "price": "299",
      "available": "true",
      "packaging_charge": 15,
      "image": "shengdana_ladu.jpg"
    },
    {
      "name": "Bhagar (serves 1)",
      "price": "149",
      "available": "true",
      "packaging_charge": 10,
      "image": "bhagar.jpg"
    },
    {
      "name": "Bhagar (serves 2/3)",
      "price": "289",
      "available": "true",
      "packaging_charge": 20,
      "image": "bhagar_large.jpg"
    },
    {
      "name": "Sabudana Khichadi (serves 2)",
      "price": "199",
      "available": "true",
      "packaging_charge": 8,
      "image": "sabudana_khichadi.jpg"
    },
    {
      "name": "Upwasache Thalipith (2P) + curd",
      "price": "99",
      "available": "true",
      "packaging_charge": 10,
      "image": "upwasache_thalipith.jpg"
    }
  ]
};

// Global state
let cart = {};
let appliedCoupon = null;
let discountAmount = 0;

// Food emojis for menu items
const foodEmojis = ['🍛', '🥘', '🍚', '🥟', '🍜', '🥗', '🍲', '🥙', '🌯', '🥪', '🍕', '🍝', '🥞', '🧆', '🍤', '🍳', '🥨'];

// DOM Elements
let elements = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('DOM loaded, initializing app...');
        initializeElements();
        initializeApp();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to initialize application');
    }
});

function initializeElements() {
    elements = {
        loadingState: document.getElementById('loadingState'),
        closedMessage: document.getElementById('closedMessage'),
        menuSection: document.getElementById('menuSection'),
        menuGrid: document.getElementById('menuGrid'),
        cartSummary: document.getElementById('cartSummary'),
        cartItems: document.getElementById('cartItems'),
        statusIndicator: document.getElementById('statusIndicator'),
        subtotal: document.getElementById('subtotal'),
        packagingCharges: document.getElementById('packagingCharges'),
        discountRow: document.getElementById('discountRow'),
        appliedCouponCode: document.getElementById('appliedCouponCode'),
        discountAmount: document.getElementById('discountAmount'),
        finalTotal: document.getElementById('finalTotal'),
        proceedToCheckout: document.getElementById('proceedToCheckout'),
        clearCart: document.getElementById('clearCart'),
        checkoutModal: document.getElementById('checkoutModal'),
        closeCheckout: document.getElementById('closeCheckout'),
        checkoutItems: document.getElementById('checkoutItems'),
        checkoutSubtotal: document.getElementById('checkoutSubtotal'),
        checkoutPackaging: document.getElementById('checkoutPackaging'),
        checkoutDiscountRow: document.getElementById('checkoutDiscountRow'),
        checkoutDiscountAmount: document.getElementById('checkoutDiscountAmount'),
        checkoutFinalTotal: document.getElementById('checkoutFinalTotal'),
        couponInput: document.getElementById('couponInput'),
        applyCoupon: document.getElementById('applyCoupon'),
        couponError: document.getElementById('couponError'),
        couponSuccess: document.getElementById('couponSuccess'),
        customerForm: document.getElementById('customerForm'),
        customerName: document.getElementById('customerName'),
        customerMobile: document.getElementById('customerMobile'),
        customerAddress: document.getElementById('customerAddress'),
        paymentSection: document.getElementById('paymentSection'),
        generatePayment: document.getElementById('generatePayment'),
        qrCode: document.getElementById('qrCode'),
        paymentAmount: document.getElementById('paymentAmount'),
        whatsappButton: document.getElementById('whatsappButton'),
        copyOrderButton: document.getElementById('copyOrderButton'),
        successMessage: document.getElementById('successMessage')
    };
}

function initializeApp() {
    console.log('Starting app initialization...');
    
    // Set up event listeners
    setupEventListeners();
    
    // Simulate loading delay then initialize
    setTimeout(() => {
        try {
            loadAppData();
        } catch (error) {
            console.error('Error loading app data:', error);
            showError('Failed to load application data');
        }
    }, 500);
}

function setupEventListeners() {
    // Cart actions
    if (elements.proceedToCheckout) {
        elements.proceedToCheckout.addEventListener('click', openCheckoutModal);
    }
    
    if (elements.clearCart) {
        elements.clearCart.addEventListener('click', clearCart);
    }
    
    // Modal actions
    if (elements.closeCheckout) {
        elements.closeCheckout.addEventListener('click', closeCheckoutModal);
    }
    
    // Coupon handling
    if (elements.applyCoupon) {
        elements.applyCoupon.addEventListener('click', applyCouponCode);
    }
    
    if (elements.couponInput) {
        elements.couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyCouponCode();
            }
        });
    }
    
    // Payment generation
    if (elements.generatePayment) {
        elements.generatePayment.addEventListener('click', generatePaymentAndOrder);
    }
    
    // WhatsApp and copy actions
    if (elements.whatsappButton) {
        elements.whatsappButton.addEventListener('click', sendWhatsAppOrder);
    }
    
    if (elements.copyOrderButton) {
        elements.copyOrderButton.addEventListener('click', copyOrderDetails);
    }
    
    // Modal backdrop click
    if (elements.checkoutModal) {
        elements.checkoutModal.addEventListener('click', function(e) {
            if (e.target === elements.checkoutModal) {
                closeCheckoutModal();
            }
        });
    }
}

function loadAppData() {
    console.log('Loading app data...');
    
    try {
        // Hide loading state
        if (elements.loadingState) {
            elements.loadingState.classList.add('hidden');
        }
        
        // Check if kitchen is open
        const isLive = APP_DATA.config.LIVE === "TRUE";
        updateKitchenStatus(isLive);
        
        if (isLive) {
            // Show menu
            renderMenu();
            if (elements.menuSection) {
                elements.menuSection.classList.remove('hidden');
            }
        } else {
            // Show closed message
            if (elements.closedMessage) {
                elements.closedMessage.classList.remove('hidden');
            }
        }
        
        console.log('App data loaded successfully');
    } catch (error) {
        console.error('Error in loadAppData:', error);
        showError('Failed to load menu data');
    }
}

function updateKitchenStatus(isLive) {
    const statusIndicator = elements.statusIndicator;
    if (!statusIndicator) return;
    
    const statusText = statusIndicator.querySelector('.status-text');
    if (statusText) {
        statusText.textContent = isLive ? 'Open Now' : 'Closed';
    }
    
    if (!isLive) {
        statusIndicator.classList.add('closed');
    }
}

function renderMenu() {
    if (!elements.menuGrid) return;
    
    console.log('Rendering menu...');
    elements.menuGrid.innerHTML = '';
    
    APP_DATA.menu.forEach((item, index) => {
        if (item.available === "true") {
            const menuItemElement = createMenuItemElement(item, index);
            elements.menuGrid.appendChild(menuItemElement);
        }
    });
}

function createMenuItemElement(item, index) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    
    const emoji = foodEmojis[index % foodEmojis.length];
    const quantity = cart[item.name] || 0;
    
    menuItem.innerHTML = `
        <div class="menu-item-image">
            <span style="font-size: 4rem;">${emoji}</span>
        </div>
        <div class="menu-item-content">
            <div class="menu-item-header">
                <h3 class="menu-item-name">${item.name}</h3>
                <span class="menu-item-price">₹${item.price}</span>
            </div>
            <div class="menu-item-actions">
                <div class="quantity-controls" style="display: ${quantity > 0 ? 'flex' : 'none'}">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">−</button>
                    <span class="quantity-display">${quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <button class="add-to-cart" onclick="addToCart('${item.name}')" style="display: ${quantity > 0 ? 'none' : 'block'}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    return menuItem;
}

function addToCart(itemName) {
    cart[itemName] = 1;
    updateCartDisplay();
    renderMenu(); // Re-render to show quantity controls
}

function updateQuantity(itemName, change) {
    if (!cart[itemName]) cart[itemName] = 0;
    
    cart[itemName] += change;
    
    if (cart[itemName] <= 0) {
        delete cart[itemName];
    }
    
    updateCartDisplay();
    renderMenu(); // Re-render to update quantity display
}

function updateCartDisplay() {
    const cartItemCount = Object.keys(cart).length;
    const hasItems = cartItemCount > 0;
    
    if (elements.cartSummary) {
        elements.cartSummary.classList.toggle('hidden', !hasItems);
    }
    
    if (!hasItems) return;
    
    renderCartItems();
    updateCartTotals();
}

function renderCartItems() {
    if (!elements.cartItems) return;
    
    elements.cartItems.innerHTML = '';
    
    Object.entries(cart).forEach(([itemName, quantity]) => {
        const menuItem = APP_DATA.menu.find(item => item.name === itemName);
        if (!menuItem) return;
        
        const itemTotal = parseInt(menuItem.price) * quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${itemName}</div>
                <div class="cart-item-meta">₹${menuItem.price} × ${quantity}</div>
            </div>
            <div class="cart-item-price">₹${itemTotal}</div>
        `;
        
        elements.cartItems.appendChild(cartItem);
    });
}

function updateCartTotals() {
    const { subtotal, packagingTotal, finalTotal } = calculateTotals();
    
    if (elements.subtotal) elements.subtotal.textContent = `₹${subtotal}`;
    if (elements.packagingCharges) elements.packagingCharges.textContent = `₹${packagingTotal}`;
    if (elements.finalTotal) elements.finalTotal.textContent = `₹${finalTotal}`;
    
    // Update discount display
    if (appliedCoupon && discountAmount > 0) {
        if (elements.discountRow) elements.discountRow.classList.remove('hidden');
        if (elements.appliedCouponCode) elements.appliedCouponCode.textContent = appliedCoupon.coupon_code;
        if (elements.discountAmount) elements.discountAmount.textContent = `-₹${discountAmount}`;
    } else {
        if (elements.discountRow) elements.discountRow.classList.add('hidden');
    }
}

function calculateTotals() {
    let subtotal = 0;
    let packagingTotal = 0;
    
    Object.entries(cart).forEach(([itemName, quantity]) => {
        const menuItem = APP_DATA.menu.find(item => item.name === itemName);
        if (menuItem) {
            subtotal += parseInt(menuItem.price) * quantity;
            packagingTotal += menuItem.packaging_charge * quantity;
        }
    });
    
    // Cap packaging charges
    packagingTotal = Math.min(packagingTotal, APP_DATA.config.max_packaging_charge);
    
    const finalTotal = subtotal + packagingTotal - discountAmount;
    
    return { subtotal, packagingTotal, finalTotal };
}

function clearCart() {
    cart = {};
    appliedCoupon = null;
    discountAmount = 0;
    updateCartDisplay();
    renderMenu();
}

function openCheckoutModal() {
    if (elements.checkoutModal) {
        elements.checkoutModal.classList.remove('hidden');
        updateCheckoutDisplay();
    }
}

function closeCheckoutModal() {
    if (elements.checkoutModal) {
        elements.checkoutModal.classList.add('hidden');
    }
    if (elements.paymentSection) {
        elements.paymentSection.classList.add('hidden');
    }
}

function updateCheckoutDisplay() {
    renderCheckoutItems();
    updateCheckoutTotals();
}

function renderCheckoutItems() {
    if (!elements.checkoutItems) return;
    
    elements.checkoutItems.innerHTML = '';
    
    Object.entries(cart).forEach(([itemName, quantity]) => {
        const menuItem = APP_DATA.menu.find(item => item.name === itemName);
        if (!menuItem) return;
        
        const itemTotal = parseInt(menuItem.price) * quantity;
        
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <div>
                <strong>${itemName}</strong><br>
                <small>₹${menuItem.price} × ${quantity}</small>
            </div>
            <div>₹${itemTotal}</div>
        `;
        
        elements.checkoutItems.appendChild(checkoutItem);
    });
}

function updateCheckoutTotals() {
    const { subtotal, packagingTotal, finalTotal } = calculateTotals();
    
    if (elements.checkoutSubtotal) elements.checkoutSubtotal.textContent = `₹${subtotal}`;
    if (elements.checkoutPackaging) elements.checkoutPackaging.textContent = `₹${packagingTotal}`;
    if (elements.checkoutFinalTotal) elements.checkoutFinalTotal.textContent = `₹${finalTotal}`;
    
    if (appliedCoupon && discountAmount > 0) {
        if (elements.checkoutDiscountRow) elements.checkoutDiscountRow.classList.remove('hidden');
        if (elements.checkoutDiscountAmount) elements.checkoutDiscountAmount.textContent = `-₹${discountAmount}`;
    } else {
        if (elements.checkoutDiscountRow) elements.checkoutDiscountRow.classList.add('hidden');
    }
}

function applyCouponCode() {
    const couponCode = elements.couponInput ? elements.couponInput.value.trim().toUpperCase() : '';
    
    if (!couponCode) {
        showCouponError('Please enter a coupon code');
        return;
    }
    
    const coupon = APP_DATA.coupons.find(c => c.coupon_code === couponCode);
    
    if (!coupon) {
        showCouponError('Invalid coupon code');
        return;
    }
    
    const { subtotal } = calculateTotals();
    
    if (subtotal < coupon.min_order_value_for_coupon) {
        showCouponError(`Minimum order value of ₹${coupon.min_order_value_for_coupon} required`);
        return;
    }
    
    // Calculate discount
    let discount = 0;
    if (coupon.fixed_discount) {
        discount = coupon.fixed_discount;
    } else {
        discount = Math.min((subtotal * coupon.discount_perc) / 100, coupon.max_discount);
    }
    
    appliedCoupon = coupon;
    discountAmount = discount;
    
    showCouponSuccess(`Coupon applied! You saved ₹${discount}`);
    
    updateCartTotals();
    updateCheckoutTotals();
}

function showCouponError(message) {
    if (elements.couponError) {
        elements.couponError.textContent = message;
        elements.couponError.classList.remove('hidden');
    }
    if (elements.couponSuccess) {
        elements.couponSuccess.classList.add('hidden');
    }
}

function showCouponSuccess(message) {
    if (elements.couponSuccess) {
        elements.couponSuccess.textContent = message;
        elements.couponSuccess.classList.remove('hidden');
    }
    if (elements.couponError) {
        elements.couponError.classList.add('hidden');
    }
}

function generatePaymentAndOrder() {
    // Validate form
    const name = elements.customerName ? elements.customerName.value.trim() : '';
    const mobile = elements.customerMobile ? elements.customerMobile.value.trim() : '';
    const address = elements.customerAddress ? elements.customerAddress.value.trim() : '';
    
    if (!name || !mobile || !address) {
        alert('Please fill in all customer details');
        return;
    }
    
    const { finalTotal } = calculateTotals();
    
    // Generate QR Code
    generateQRCode(finalTotal);
    
    // Show payment section
    if (elements.paymentSection) {
        elements.paymentSection.classList.remove('hidden');
    }
    if (elements.paymentAmount) {
        elements.paymentAmount.textContent = finalTotal;
    }
}

function generateQRCode(amount) {
    if (!elements.qrCode) return;
    
    const upiString = `upi://pay?pa=${APP_DATA.config.upi_id}&pn=${APP_DATA.config.upi_name}&am=${amount}&cu=INR`;
    
    try {
        const qr = new QRious({
            element: elements.qrCode,
            value: upiString,
            size: 200,
            level: 'M'
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
    }
}

function sendWhatsAppOrder() {
    const orderMessage = generateOrderMessage();
    const whatsappUrl = `https://wa.me/${APP_DATA.config.mobile_number}?text=${encodeURIComponent(orderMessage)}`;
    
    try {
        window.open(whatsappUrl, '_blank');
    } catch (error) {
        console.error('Error opening WhatsApp:', error);
        copyOrderDetails(); // Fallback to copy
    }
}

function copyOrderDetails() {
    const orderMessage = generateOrderMessage();
    
    try {
        navigator.clipboard.writeText(orderMessage).then(() => {
            showSuccessMessage();
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = orderMessage;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showSuccessMessage();
        });
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Order details:\n\n' + orderMessage);
    }
}

function generateOrderMessage() {
    const name = elements.customerName ? elements.customerName.value.trim() : '';
    const mobile = elements.customerMobile ? elements.customerMobile.value.trim() : '';
    const address = elements.customerAddress ? elements.customerAddress.value.trim() : '';
    
    let message = `🍛 *Annapurna Kitchen Order*\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${name}\n`;
    message += `Mobile: ${mobile}\n`;
    message += `Address: ${address}\n\n`;
    
    message += `📋 *Order Items:*\n`;
    
    let itemNumber = 1;
    Object.entries(cart).forEach(([itemName, quantity]) => {
        message += `${itemNumber}. ${itemName} x ${quantity}\n`;
        itemNumber++;
    });
    
    const { subtotal, packagingTotal, finalTotal } = calculateTotals();
    
    message += `\n💰 *Bill Summary:*\n`;
    message += `Subtotal: ₹${subtotal}\n`;
    message += `Packaging: ₹${packagingTotal}\n`;
    
    if (appliedCoupon && discountAmount > 0) {
        message += `Discount (${appliedCoupon.coupon_code}): -₹${discountAmount}\n`;
    }
    
    message += `*Total: ₹${finalTotal}*\n\n`;
    message += `${APP_DATA.config.payment_completion_message}`;
    
    return message;
}

function showSuccessMessage() {
    if (elements.successMessage) {
        elements.successMessage.classList.remove('hidden');
        
        setTimeout(() => {
            elements.successMessage.classList.add('hidden');
            closeCheckoutModal();
        }, 3000);
    }
}

function showError(message) {
    console.error('Application Error:', message);
    
    // Hide loading state if visible
    if (elements.loadingState) {
        elements.loadingState.classList.add('hidden');
    }
    
    // Show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-surface);
        padding: var(--space-32);
        border-radius: var(--radius-lg);
        border: 2px solid var(--color-error);
        z-index: 2000;
        text-align: center;
        box-shadow: var(--shadow-lg);
    `;
    errorDiv.innerHTML = `
        <h3 style="color: var(--color-error); margin-bottom: var(--space-16);">⚠️ Error</h3>
        <p>${message}</p>
        <button onclick="location.reload()" class="btn btn--primary" style="margin-top: var(--space-16);">
            Reload Page
        </button>
    `;
    
    document.body.appendChild(errorDiv);
}

// Make functions globally available
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;