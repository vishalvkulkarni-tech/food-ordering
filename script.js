const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwgfbXBfU3MDUDUb4gPelPPJ1_52phISM-zZ_hT1QNGSRYH2zmbH4AZTJjuL6cEW6q6LA/exec';

function logDebug(msg) {
  document.getElementById('debug').innerText += msg + '\n';
  console.log(msg);
}

async function fetchMenu() {
  try {
    const response = await fetch(`${SHEET_URL}?action=menu`);
    const data = await response.json();
    logDebug("Menu data received: " + JSON.stringify(data));

    if (data.status !== 'success' || !Array.isArray(data.menu)) {
      throw new Error("Menu not available or incorrect format.");
    }

    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = '';

    data.menu.forEach((item, idx) => {
      const itemName = item.name || `Item ${idx + 1}`;
      const price = parseFloat(item.price || 0);
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      itemDiv.innerHTML = `
        <span>${itemName} (₹${price})</span>
        <input type="number" min="0" value="0" data-name="${itemName}" data-price="${price}" onchange="updateTotal()" />
      `;
      menuContainer.appendChild(itemDiv);
    });
  } catch (error) {
    document.getElementById('menu').innerText = 'Error loading menu.';
    logDebug('Menu fetch error: ' + error.message);
  }
}

function updateTotal() {
  const inputs = document.querySelectorAll('#menu input[type="number"]');
  let total = 0;
  inputs.forEach(input => {
    const qty = parseFloat(input.value || 0);
    const price = parseFloat(input.dataset.price || 0);
    total += qty * price;
  });
  document.getElementById('total').innerText = total.toFixed(2);
}

async function submitOrder() {
  const name = document.getElementById('custName').value.trim();
  const mobile = document.getElementById('custMobile').value.trim();
  if (!name || !mobile) {
    alert("Please fill customer details.");
    return;
  }

  const items = [];
  const inputs = document.querySelectorAll('#menu input[type="number"]');
  inputs.forEach(input => {
    const qty = parseFloat(input.value || 0);
    if (qty > 0) {
      items.push({
        name: input.dataset.name,
        qty: qty,
        price: parseFloat(input.dataset.price)
      });
    }
  });

  if (items.length === 0) {
    alert("Select at least one item.");
    return;
  }

  const orderData = {
    action: 'order',
    customer: { name, mobile },
    items: items
  };

  try {
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      body: JSON.stringify(orderData),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    logDebug("Order response: " + JSON.stringify(result));

    if (result.status === 'success') {
      document.getElementById('status').innerText = 'Order submitted! Order ID: ' + result.orderId;
    } else {
      document.getElementById('status').innerText = 'Order failed: ' + result.message;
    }
  } catch (err) {
    document.getElementById('status').innerText = 'Error submitting order.';
    logDebug("Submit error: " + err.message);
  }
}

fetchMenu();
