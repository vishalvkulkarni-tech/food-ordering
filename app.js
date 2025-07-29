// Annapurna Kitchen Food Ordering App with GitHub Images (v2)
(() => {
  /* ---------------------- Static Data ------------------------- */
  const DATA = {
    config: {
      site_title: "Annapurna Kitchen",
      mobile_number: "9766448463",
      upi_id: "9766448463@apl",
      upi_name: "Annapurna Kitchen",
      LIVE: "TRUE",
      working_hours_IST: "10 AM : 7 PM",
      max_packaging_charge: 50,
      convenience_fees: 0,
      platform_fees: 0,
      delivery_message: "Free for 5km radius, else depends on location sent via parcel services",
      freshly_cooked_message: "As items are freshly cooked, it will take little time to serve you the authentic taste",
      payment_completion_message: "Please share payment screenshot along with menu"
    },
    coupons: [
      {
        coupon_code: "SAVE10",
        discount_perc: 10,
        max_discount: 100,
        min_order_value_for_coupon: 200
      },
      {
        coupon_code: "WELCOME20",
        discount_perc: 20,
        max_discount: 150,
        min_order_value_for_coupon: 300
      }
    ],
    menu: [
      { name: "Puranpoli (1P)", price: 89, available: true, packaging_charge: 5, image: "puranpoli.JPG" },
      { name: "Puri Bhaji (4P Puri)", price: 99, available: true, packaging_charge: 12, image: "puribhaji.JPG" },
      { name: "Masalebhat (serves 1)", price: 149, available: true, packaging_charge: 10, image: "masalebhat.JPG" },
      { name: "Masalebhat (serves 2/3)", price: 289, available: true, packaging_charge: 20, image: "masalebhat.JPG" },
      { name: "Kothimbir Vadi (6P)", price: 59, available: true, packaging_charge: 5, image: "kothimbirVadi.JPG" },
      { name: "Batata Vada (4P)", price: 99, available: true, packaging_charge: 15, image: "batatavada.JPG" },
      { name: "Fried Modak (11P)", price: 149, available: true, packaging_charge: 15, image: "friedmodak.JPG" },
      { name: "Fried Modak (21P)", price: 249, available: true, packaging_charge: 25, image: "friedmodak.JPG" },
      { name: "Besan Ladu (Approx 250gms)", price: 249, available: true, packaging_charge: 15, image: "besanLaddo.JPG" },
      { name: "Onion Thalipith (2P)", price: 99, available: true, packaging_charge: 5, image: "onionthalipith.JPG" },
      { name: "Kothimbir Thalipith (2P)", price: 129, available: true, packaging_charge: 5, image: "koththalipith.JPG" },
      { name: "Sabudana Ladu (Approx 250gms)", price: 249, available: true, packaging_charge: 15, image: "sabudanaLadu.JPG" },
      { name: "Shengdana Ladu (Approx 250gms)", price: 299, available: true, packaging_charge: 15, image: "shengdanaLadu.JPG" },
      { name: "Bhagar (serves 1)", price: 149, available: true, packaging_charge: 10, image: "bhagar.JPG" },
      { name: "Bhagar (serves 2/3)", price: 289, available: true, packaging_charge: 20, image: "bhagar.JPG" },
      { name: "Sabudana Khichadi (serves 2)", price: 199, available: true, packaging_charge: 8, image: "sabudanKhichdi.JPG" },
      { name: "Upwasache Thalipith (2P) + curd", price: 99, available: true, packaging_charge: 10, image: "upwasThalipith.JPG" }
    ],
    github_images_base_url: "https://raw.githubusercontent.com/vishalvkulkarni-tech/food-ordering/main/menu_images/"
  };

  /* ---------------------- State ------------------------- */
  let cart = [];
  let appliedCoupon = null;

  /* ---------------------- DOM ------------------------- */
  const el = (id) => document.getElementById(id);
  const elements = {
    menuGrid: el("menuGrid"),
    cartSidebar: el("cartSidebar"),
    cartItems: el("cartItems"),
    cartSubtotal: el("cartSubtotal"),
    cartPackaging: el("cartPackaging"),
    cartTotal: el("cartTotal"),
    cartCount: el("cartCountHeader"),
    checkoutBtn: el("checkoutBtn"),
    cartToggle: el("cartToggle"),
    closeCart: el("closeCart"),
    // Checkout modal
    checkoutModal: el("checkoutModal"),
    closeCheckout: el("closeCheckout"),
    checkoutSummary: el("checkoutSummary"),
    couponInput: el("couponInput"),
    applyCouponBtn: el("applyCouponBtn"),
    couponMsg: el("couponMsg"),
    grandTotal: el("grandTotal"),
    proceedToPayBtn: el("proceedToPayBtn"),
    // Payment modal
    paymentModal: el("paymentModal"),
    closePayment: el("closePayment"),
    upiQR: el("upiQR"),
    paymentDetails: el("paymentDetails"),
    customerDetailsSection: el("customerDetailsSection"),
    custName: el("custName"),
    custPhone: el("custPhone"),
    custAddress: el("custAddress"),
    placeOrderBtn: el("placeOrderBtn")
  };

  /* ---------------------- Utility: Cart Sidebar Show/Hide ------------------------- */
  function showCart() {
    elements.cartSidebar.classList.remove('hidden');
    document.body.classList.add('with-sidebar');
  }
  function hideCart() {
    elements.cartSidebar.classList.add('hidden');
    document.body.classList.remove('with-sidebar');
  }

  /* ---------------------- Image Loading with Fallback ------------------------- */
  function createImageWithFallback(imageName, altText) {
    const img = document.createElement('img');
    img.alt = altText;

    if (!imageName) {
      img.style.display = 'none';
      return img;
    }

    const urls = [
      DATA.github_images_base_url + imageName,
      DATA.github_images_base_url + imageName.replace('.JPG', '.jpg')
    ];

    let current = 0;
    function tryNext() {
      if (current >= urls.length) {
        img.style.display = 'none';
        console.warn('Failed to load image', imageName);
        return;
      }
      img.src = urls[current++];
    }
    img.onerror = tryNext;
    tryNext();
    return img;
  }

  /* ---------------------- Render Menu ------------------------- */
  function renderMenu() {
    const frag = document.createDocumentFragment();

    DATA.menu.forEach((item, idx) => {
      if (!item.available) return;

      const card = document.createElement('div');
      card.className = 'menu-card';

      // Image
      card.appendChild(createImageWithFallback(item.image, item.name));

      // Body
      const body = document.createElement('div');
      body.className = 'menu-card__body';

      const title = document.createElement('h4');
      title.textContent = item.name;
      title.style.margin = '0 0 8px 0';
      body.appendChild(title);

      const price = document.createElement('p');
      price.textContent = `₹${item.price}`;
      price.style.margin = '0 0 12px 0';
      price.style.fontWeight = 'var(--font-weight-semibold)';
      price.style.color = 'var(--color-primary)';
      body.appendChild(price);

      const addBtn = document.createElement('button');
      addBtn.className = 'btn btn--primary btn--sm menu-card__footer';
      addBtn.textContent = 'Add';
      addBtn.addEventListener('click', () => {
        addToCart(idx);
        showCart();
      });
      body.appendChild(addBtn);

      card.appendChild(body);
      frag.appendChild(card);
    });

    elements.menuGrid.appendChild(frag);
  }

  /* ---------------------- Cart Actions ------------------------- */
  function addToCart(index) {
    const existing = cart.find(c => c.index === index);
    if (existing) existing.qty += 1; else cart.push({ index, qty: 1 });
    updateCartUI();
  }
  function changeQty(index, delta) {
    const item = cart.find(c => c.index === index);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(c => c.index !== index);
    updateCartUI();
  }

  /* ---------------------- Totals & Discounts ------------------------- */
  function calcTotals() {
    let subtotal = 0;
    let packaging = 0;
    cart.forEach(({ index, qty }) => {
      const m = DATA.menu[index];
      subtotal += m.price * qty;
      packaging += m.packaging_charge * qty;
    });
    packaging = Math.min(packaging, DATA.config.max_packaging_charge);

    let discount = 0;
    if (appliedCoupon) {
      discount = Math.min((appliedCoupon.discount_perc / 100) * subtotal, appliedCoupon.max_discount);
    }

    const total = subtotal + packaging - discount;
    return { subtotal, packaging, discount, total };
  }

  /* ---------------------- Cart UI ------------------------- */
  function updateCartUI() {
    // Render items
    elements.cartItems.innerHTML = '';
    const frag = document.createDocumentFragment();

    cart.forEach(({ index, qty }) => {
      const m = DATA.menu[index];
      const row = document.createElement('div');
      row.className = 'flex justify-between items-center py-8';
      row.style.borderBottom = '1px solid var(--color-card-border-inner)';

      const info = document.createElement('div');
      info.innerHTML = `<p style="margin:0;font-size:var(--font-size-sm);font-weight:var(--font-weight-medium);">${m.name}</p><small style="color:var(--color-text-secondary);">₹${m.price} x ${qty}</small>`;

      const controls = document.createElement('div');
      controls.className = 'flex items-center gap-8';

      const dec = document.createElement('button');
      dec.className = 'btn btn--outline btn--sm';
      dec.textContent = '-';
      dec.addEventListener('click', () => changeQty(index, -1));

      const qtySpan = document.createElement('span');
      qtySpan.textContent = qty;
      qtySpan.style.minWidth = '24px';
      qtySpan.style.textAlign = 'center';

      const inc = document.createElement('button');
      inc.className = 'btn btn--outline btn--sm';
      inc.textContent = '+';
      inc.addEventListener('click', () => changeQty(index, 1));

      controls.appendChild(dec);
      controls.appendChild(qtySpan);
      controls.appendChild(inc);

      row.appendChild(info);
      row.appendChild(controls);
      frag.appendChild(row);
    });

    elements.cartItems.appendChild(frag);

    // Totals
    const { subtotal, packaging, total } = calcTotals();
    elements.cartSubtotal.textContent = subtotal.toFixed(0);
    elements.cartPackaging.textContent = packaging.toFixed(0);
    elements.cartTotal.textContent = total.toFixed(0);

    // Header cart count
    const totalQty = cart.reduce((s, c) => s + c.qty, 0);
    elements.cartCount.textContent = totalQty;
    elements.cartToggle.disabled = cart.length === 0;

    // Checkout enable
    elements.checkoutBtn.disabled = cart.length === 0;
  }

  /* ---------------------- Checkout Modal ------------------------- */
  function renderCheckoutSummary() {
    const list = cart.map(({ index, qty }, i) => {
      const m = DATA.menu[index];
      return `<li>${m.name} x ${qty} = ₹${m.price * qty}</li>`;
    }).join('');

    const { subtotal, packaging, discount, total } = calcTotals();

    elements.checkoutSummary.innerHTML = `
      <ul style="list-style:disc;padding-left:var(--space-16);margin:0 0 var(--space-16) 0;">${list}</ul>
      <p style="margin:0 0 var(--space-8) 0;"><strong>Subtotal:</strong> ₹${subtotal}</p>
      <p style="margin:0 0 var(--space-8) 0;"><strong>Packaging:</strong> ₹${packaging}</p>
      ${discount ? `<p style="margin:0 0 var(--space-8) 0;color:var(--color-success);"><strong>Discount:</strong> -₹${discount}</p>` : ''}
    `;

    elements.grandTotal.textContent = total;
  }

  function openCheckout() {
    renderCheckoutSummary();
    elements.checkoutModal.classList.remove('hidden');
  }
  function closeCheckout() {
    elements.checkoutModal.classList.add('hidden');
  }

  function applyCoupon() {
    const code = elements.couponInput.value.trim().toUpperCase();
    const coupon = DATA.coupons.find(c => c.coupon_code === code);
    const { subtotal } = calcTotals();

    elements.couponMsg.className = 'status mt-8';
    elements.couponMsg.classList.remove('hidden');

    if (!coupon) {
      elements.couponMsg.textContent = 'Invalid coupon code';
      elements.couponMsg.classList.add('status--error');
      return;
    }

    if (subtotal < coupon.min_order_value_for_coupon) {
      elements.couponMsg.textContent = `Minimum order value ₹${coupon.min_order_value_for_coupon} required`;
      elements.couponMsg.classList.add('status--warning');
      return;
    }

    appliedCoupon = coupon;
    elements.couponMsg.textContent = `Coupon ${coupon.coupon_code} applied!`;
    elements.couponMsg.classList.add('status--success');
    renderCheckoutSummary();
  }

  /* ---------------------- Payment ------------------------- */
  let detailsTimer;

  function openPaymentModal() {
    closeCheckout();
    const { total } = calcTotals();

    // QR code
    const upi = `upi://pay?pa=${encodeURIComponent(DATA.config.upi_id)}&pn=${encodeURIComponent(DATA.config.upi_name)}&am=${total}&cu=INR`;
    elements.upiQR.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upi)}`;

    elements.paymentDetails.innerHTML = `<strong>Pay ₹${total}</strong> to UPI ID: ${DATA.config.upi_id}`;

    elements.paymentModal.classList.remove('hidden');
    elements.customerDetailsSection.classList.add('hidden');

    if (detailsTimer) clearTimeout(detailsTimer);
    detailsTimer = setTimeout(() => elements.customerDetailsSection.classList.remove('hidden'), 30000);
  }

  function closePaymentModal() {
    elements.paymentModal.classList.add('hidden');
    if (detailsTimer) clearTimeout(detailsTimer);
  }

  function placeOrder() {
    const name = elements.custName.value.trim();
    const phone = elements.custPhone.value.trim();
    const address = elements.custAddress.value.trim();

    if (!name || !phone || !address) {
      alert('Please enter Name, Phone and Address');
      return;
    }

    const { subtotal, packaging, discount, total } = calcTotals();

    const itemLines = cart.map(({ index, qty }, i) => `${i + 1}. ${DATA.menu[index].name} x ${qty}`).join('%0A');

    const msg = [
      '*🍽️ Annapurna Kitchen New Order*',
      '',
      '*Customer*',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Address: ${address}`,
      '',
      '*Order*',
      itemLines,
      '',
      `Subtotal: ₹${subtotal}`,
      `Packaging: ₹${packaging}`,
      discount ? `Discount: -₹${discount}` : '',
      `Total Paid: ₹${total}`,
      '',
      DATA.config.payment_completion_message
    ].filter(Boolean).join('%0A');

    window.open(`https://wa.me/91${DATA.config.mobile_number}?text=${msg}`, '_blank');
    resetAll();
  }

  function resetAll() {
    cart = [];
    appliedCoupon = null;
    elements.couponInput.value = '';
    elements.couponMsg.classList.add('hidden');
    elements.custName.value = '';
    elements.custPhone.value = '';
    elements.custAddress.value = '';
    updateCartUI();
    closePaymentModal();
    hideCart();
  }

  /* ---------------------- Event Listeners ------------------------- */
  function setListeners() {
    // Header cart toggle
    elements.cartToggle.addEventListener('click', () => {
      if (elements.cartSidebar.classList.contains('hidden')) {
        showCart();
      } else {
        hideCart();
      }
    });
    elements.closeCart.addEventListener('click', hideCart);

    // Checkout
    elements.checkoutBtn.addEventListener('click', openCheckout);
    elements.closeCheckout.addEventListener('click', closeCheckout);
    elements.applyCouponBtn.addEventListener('click', applyCoupon);
    elements.proceedToPayBtn.addEventListener('click', openPaymentModal);

    // Payment
    elements.closePayment.addEventListener('click', closePaymentModal);
    elements.placeOrderBtn.addEventListener('click', placeOrder);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCheckout();
        closePaymentModal();
      }
    });

    // Allow Enter in coupon field
    elements.couponInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyCoupon();
    });
  }

  /* ---------------------- Init ------------------------- */
  function init() {
    renderMenu();
    updateCartUI();
    setListeners();
    console.info('Annapurna Kitchen Ready');
  }

  if (document.readyState === 'complete' || document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
