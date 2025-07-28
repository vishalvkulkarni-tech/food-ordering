// Enhanced Annapurna Kitchen JavaScript
let menuData = [];
let config = {};
let coupons = [];
let cart = {};
let subtotal = 0;
let packagingTotal = 0;
let appliedCoupon = null;
let couponDiscount = 0;

// Load configuration and menu data
fetch('menu.json')
    .then(response => response.json())
    .then(data => {
        config = data.config;
        menuData = data.menu;
        coupons = data.coupons || [];
        initializeApp();
    })
    .catch(error => {
        console.error('Error loading menu data:', error);
        showError('Failed to load menu data. Please refresh the page.');
    });

function initializeApp() {
    // Set dynamic content from config
    document.getElementById('site-title').textContent = config.site_title;
    document.getElementById('page-title').textContent = config.site_title + ' - Order Online';
    document.getElementById('working-hours').textContent = `Working Hours: ${config.working_hours_IST}`;
    document.getElementById('freshly-cooked-msg').textContent = config.freshly_cooked_message;
    document.getElementById('fallback-mobile').textContent = config.mobile_number;

    // Check if kitchen is open
    if (config.LIVE === 'FALSE') {
        showClosedMessage();
        return;
    }

    // Initialize the app
    buildMenu();
    setupEventListeners();
    updateCartDisplay();
}

function showClosedMessage() {
    document.getElementById('closed-message').style.display = 'block';
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('closed-working-hours').textContent = `Working Hours: ${config.working_hours_IST}`;
}

function buildMenu() {
    const menuDiv = document.getElementById('menu');
    menuDiv.innerHTML = '';

    menuData.forEach((item, index) => {
        if (item.available !== 'true') return;

        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.style.animationDelay = `${index * 0.1}s`;

        // Handle image loading with fallback
        const imageSrc = item.image ? `menu_images/${item.image}` : 'https://via.placeholder.com/300x150/ff6b35/ffffff?text=Delicious+Food';

        menuItem.innerHTML = `
            <img src="${imageSrc}" alt="${item.name}" class="menu-item-image" 
                 onerror="this.src='https://via.placeholder.com/300x150/ff6b35/ffffff?text=Delicious+Food'">
            <div class="menu-item-header">
                <span class="menu-item-name">${item.name}</span>
                <span class="menu-item-price">₹${item.price}</span>
            </div>
            <div class="menu-item-controls">
                <input type="checkbox" id="item-${index}" class="menu-checkbox" 
                       onchange="toggleItem(${index})" />
                <div class="quantity-control">
                    <label for="qty-${index}">Qty:</label>
                    <input type="number" id="qty-${index}" class="quantity-input" 
                           value="1" min="1" max="20" disabled onchange="updateQuantity(${index})" />
                </div>
            </div>
        `;

        menuDiv.appendChild(menuItem);
    });
}

function toggleItem(index) {
    const checkbox = document.getElementById(`item-${index}`);
    const qtyInput = document.getElementById(`qty-${index}`);

    if (checkbox.checked) {
        cart[index] = {
            item: menuData[index],
            quantity: parseInt(qtyInput.value) || 1
        };
        qtyInput.disabled = false;
    } else {
        delete cart[index];
        qtyInput.disabled = true;
    }

    updateCartDisplay();
}

function updateQuantity(index) {
    const qtyInput = document.getElementById(`qty-${index}`);
    const quantity = parseInt(qtyInput.value) || 1;

    if (cart[index]) {
        cart[index].quantity = quantity;
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = Object.keys(cart);
    const cartSummary = document.getElementById('cart-summary');

    if (cartItems.length === 0) {
        cartSummary.style.display = 'none';
        return;
    }

    // Calculate totals
    subtotal = 0;
    packagingTotal = 0;

    cartItems.forEach(index => {
        const cartItem = cart[index];
        const itemPrice = parseFloat(cartItem.item.price);
        const quantity = cartItem.quantity;
        const packagingCharge = parseFloat(cartItem.item.packaging_charge) || 0;

        subtotal += itemPrice * quantity;
        packagingTotal += packagingCharge * quantity;
    });

    // Apply packaging charge cap
    if (packagingTotal > config.max_packaging_charge) {
        packagingTotal = config.max_packaging_charge;
    }

    // Update display
    document.getElementById('subtotal').textContent = subtotal;
    document.getElementById('packaging-total').textContent = packagingTotal;
    document.getElementById('convenience-fees').textContent = config.convenience_fees;
    document.getElementById('platform-fees').textContent = config.platform_fees;

    // Calculate final total with coupon discount
    const finalTotal = subtotal + packagingTotal + config.convenience_fees + config.platform_fees - couponDiscount;
    document.getElementById('total').textContent = finalTotal;

    cartSummary.style.display = 'block';
}

function setupEventListeners() {
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', showCheckoutPage);

    // Coupon application
    document.getElementById('apply-coupon-btn').addEventListener('click', applyCoupon);

    // Payment flow
    document.getElementById('pay-now-btn').addEventListener('click', showPaymentSection);
    document.getElementById('back-to-menu-btn').addEventListener('click', backToMenu);

    // Order submission
    document.getElementById('submit-order-btn').addEventListener('click', submitOrder);

    // Fallback copy
    document.getElementById('copy-fallback-btn').addEventListener('click', copyFallbackText);

    // New order
    document.getElementById('new-order-btn').addEventListener('click', startNewOrder);

    // Show user details after 30 seconds of QR display
    setTimeout(() => {
        const paymentSection = document.getElementById('payment-section');
        const userDetailsSection = document.getElementById('user-details-section');
        if (paymentSection.style.display !== 'none') {
            userDetailsSection.style.display = 'block';
        }
    }, 30000);
}

function showCheckoutPage() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('checkout-page').style.display = 'block';

    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    // Update final order items
    const orderItemsDiv = document.getElementById('final-order-items');
    orderItemsDiv.innerHTML = '';

    Object.keys(cart).forEach(index => {
        const cartItem = cart[index];
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <span>${cartItem.item.name} x ${cartItem.quantity}</span>
            <span>₹${parseFloat(cartItem.item.price) * cartItem.quantity}</span>
        `;
        orderItemsDiv.appendChild(itemDiv);
    });

    // Update final summary
    document.getElementById('final-subtotal').textContent = subtotal;
    document.getElementById('final-packaging').textContent = packagingTotal;
    document.getElementById('final-convenience').textContent = config.convenience_fees;
    document.getElementById('final-platform').textContent = config.platform_fees;
    document.getElementById('final-delivery').textContent = config.delivery_message;

    // Update coupon discount display
    if (appliedCoupon) {
        document.getElementById('final-coupon-row').style.display = 'flex';
        document.getElementById('final-coupon-discount').textContent = couponDiscount;
    } else {
        document.getElementById('final-coupon-row').style.display = 'none';
    }

    const finalTotal = subtotal + packagingTotal + config.convenience_fees + config.platform_fees - couponDiscount;
    document.getElementById('final-total').textContent = finalTotal;
}

function applyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    const couponCode = couponInput.value.trim().toUpperCase();
    const messageDiv = document.getElementById('coupon-message');

    if (!couponCode) {
        showCouponMessage('Please enter a coupon code', 'error');
        return;
    }

    // Find matching coupon (case insensitive)
    const matchingCoupon = coupons.find(coupon => 
        coupon.coupon_code.toUpperCase() === couponCode
    );

    if (!matchingCoupon) {
        showCouponMessage('Invalid coupon code', 'error');
        return;
    }

    // Check minimum order value
    if (subtotal < matchingCoupon.min_order_value_for_coupon) {
        showCouponMessage(`Minimum order value of ₹${matchingCoupon.min_order_value_for_coupon} required for this coupon`, 'error');
        return;
    }

    // Calculate discount
    let discount = 0;
    if (matchingCoupon.fixed_discount) {
        discount = matchingCoupon.fixed_discount;
    } else {
        discount = (subtotal * matchingCoupon.discount_perc) / 100;
    }

    // Apply maximum discount limit
    if (discount > matchingCoupon.max_discount) {
        discount = matchingCoupon.max_discount;
    }

    // Apply coupon
    appliedCoupon = matchingCoupon;
    couponDiscount = discount;

    showCouponMessage(`Coupon applied! You saved ₹${discount}`, 'success');
    updateCheckoutSummary();

    // Disable coupon input
    couponInput.disabled = true;
    document.getElementById('apply-coupon-btn').textContent = 'Applied';
    document.getElementById('apply-coupon-btn').disabled = true;
}

function showCouponMessage(message, type) {
    const messageDiv = document.getElementById('coupon-message');
    messageDiv.textContent = message;
    messageDiv.className = `coupon-message ${type}`;
}

function backToMenu() {
    document.getElementById('checkout-page').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

function showPaymentSection() {
    const finalTotal = subtotal + packagingTotal + config.convenience_fees + config.platform_fees - couponDiscount;

    document.getElementById('checkout-page').style.display = 'none';
    document.getElementById('payment-section').style.display = 'block';

    // Generate QR code
    const qr = new QRious({
        element: document.getElementById('qr-code'),
        value: `upi://pay?pa=${config.upi_id}&pn=${config.upi_name}&am=${finalTotal}&cu=INR`,
        size: 200
    });

    document.getElementById('payment-amount').textContent = finalTotal;
}

function submitOrder() {
    const name = document.getElementById('customer-name').value.trim();
    const address = document.getElementById('delivery-address').value.trim();
    const mobile = document.getElementById('customer-mobile').value.trim();

    if (!name || !address || !mobile) {
        alert('Please fill all delivery details');
        return;
    }

    // Generate WhatsApp message with numbered items
    let orderMessage = `*Order from ${config.site_title}*\n\n`;

    let itemNumber = 1;
    Object.keys(cart).forEach(index => {
        const cartItem = cart[index];
        orderMessage += `${itemNumber}. ${cartItem.item.name} x ${cartItem.quantity}\n`;
        itemNumber++;
    });

    orderMessage += `\n*Order Summary:*\n`;
    orderMessage += `Subtotal: ₹${subtotal}\n`;
    orderMessage += `Packaging: ₹${packagingTotal}\n`;
    orderMessage += `Convenience Fees: ₹${config.convenience_fees}\n`;
    orderMessage += `Platform Fees: ₹${config.platform_fees}\n`;

    if (appliedCoupon) {
        orderMessage += `Coupon Discount: -₹${couponDiscount}\n`;
    }

    const finalTotal = subtotal + packagingTotal + config.convenience_fees + config.platform_fees - couponDiscount;
    orderMessage += `*Total: ₹${finalTotal}*\n\n`;

    orderMessage += `*Customer Details:*\n`;
    orderMessage += `Name: ${name}\n`;
    orderMessage += `Address: ${address}\n`;
    orderMessage += `Mobile: ${mobile}\n\n`;
    orderMessage += `${config.payment_completion_message}`;

    // Try to open WhatsApp
    const whatsappUrl = `https://wa.me/91${config.mobile_number}?text=${encodeURIComponent(orderMessage.replace(/\\n/g, '\n'))}`;

    try {
        window.open(whatsappUrl, '_blank');
    } catch (error) {
        console.error('Error opening WhatsApp:', error);
    }

    // Show fallback option
    showFallbackOption(orderMessage.replace(/\\n/g, '\n'));

    // Show completion message
    showPaymentCompletion();
}

function showFallbackOption(message) {
    document.getElementById('fallback-section').style.display = 'block';
    document.getElementById('fallback-text').value = message;
}

function copyFallbackText() {
    const textarea = document.getElementById('fallback-text');
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices

    try {
        document.execCommand('copy');
        alert('Message copied! Please paste it in WhatsApp.');
    } catch (error) {
        console.error('Copy failed:', error);
        alert('Please manually copy and paste the message.');
    }
}

function showPaymentCompletion() {
    document.getElementById('payment-section').style.display = 'none';
    document.getElementById('payment-completion').style.display = 'block';
    document.getElementById('payment-completion-message').textContent = config.payment_completion_message;
}

function startNewOrder() {
    // Reset everything
    cart = {};
    subtotal = 0;
    packagingTotal = 0;
    appliedCoupon = null;
    couponDiscount = 0;

    // Reset form inputs
    document.getElementById('coupon-input').value = '';
    document.getElementById('coupon-input').disabled = false;
    document.getElementById('apply-coupon-btn').textContent = 'Apply';
    document.getElementById('apply-coupon-btn').disabled = false;
    document.getElementById('customer-name').value = '';
    document.getElementById('delivery-address').value = '';
    document.getElementById('customer-mobile').value = '';

    // Reset checkboxes and quantities
    menuData.forEach((item, index) => {
        const checkbox = document.getElementById(`item-${index}`);
        const qtyInput = document.getElementById(`qty-${index}`);
        if (checkbox) {
            checkbox.checked = false;
            qtyInput.disabled = true;
            qtyInput.value = 1;
        }
    });

    // Hide all sections except main content
    document.getElementById('checkout-page').style.display = 'none';
    document.getElementById('payment-section').style.display = 'none';
    document.getElementById('payment-completion').style.display = 'none';
    document.getElementById('fallback-section').style.display = 'none';
    document.getElementById('user-details-section').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';

    updateCartDisplay();

    // Scroll to top
    window.scrollTo(0, 0);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 300px;
    `;
    errorDiv.textContent = message;

    document.body.appendChild(errorDiv);

    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Add smooth scrolling behavior
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});