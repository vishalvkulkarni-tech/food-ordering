let menuData = [];
let config = {};
let total = 0;

fetch('menu.json')
  .then(res => res.json())
  .then(data => {
    config = data.config;
    menuData = data.menu;
    buildMenu();
  });

function buildMenu() {
  const menuDiv = document.getElementById('menu');
  menuData.forEach((item, index) => {
    const available = item.available.toLowerCase() === 'true';
    if (!available) return;

    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
      <label>
        <input type="checkbox" onchange="updateTotal(${index})" id="chk${index}">
        ${item.name} (₹${item.price})
      </label>
      <input type="number" id="qty${index}" value="1" min="1" max="20" disabled onchange="updateTotal(${index})">
    `;
    menuDiv.appendChild(div);
  });
}

function updateTotal(index) {
  const chk = document.getElementById('chk' + index);
  const qty = document.getElementById('qty' + index);
  qty.disabled = !chk.checked;

  total = 0;
  menuData.forEach((item, i) => {
    const c = document.getElementById('chk' + i);
    const q = document.getElementById('qty' + i);
    if (c && c.checked) {
      const price = parseFloat(item.price);
      const quantity = parseInt(q.value);
      total += price * quantity;
    }
  });
  document.getElementById('total').innerText = total;
}

document.getElementById('payNow').addEventListener('click', () => {
  if (total <= 0) {
    alert("Please select at least one item.");
    return;
  }
  const qr = new QRious({
    element: document.getElementById('qrcode'),
    value: `upi://pay?pa=9766448463@apl&pn=AnnapurnaKitchen&am=${total}&cu=INR`,
    size: 200
  });
  document.getElementById('qrSection').style.display = 'block';
  setTimeout(() => {
    document.getElementById('userDetails').style.display = 'block';
  }, 30000);
});

document.getElementById('submitOrder').addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const addr = document.getElementById('address').value;
  const mob = document.getElementById('mobile').value;
  if (!name || !addr || !mob) {
    alert("Please fill all details.");
    return;
  }

  let orderDetails = `*Order from Annapurna Kitchen*%0A`;
  menuData.forEach((item, i) => {
    const c = document.getElementById('chk' + i);
    const q = document.getElementById('qty' + i);
    if (c && c.checked) {
      orderDetails += `${item.name} x ${q.value} = ₹${item.price * q.value}%0A`;
    }
  });
  orderDetails += `*Total:* ₹${total}%0A`;
  orderDetails += `*Name:* ${name}%0A*Address:* ${addr}%0A*Mobile:* ${mob}%0A`;
  orderDetails += `*Please share payment screenshot as well.*`;

  const waURL = `https://wa.me/919766448463?text=${orderDetails}`;
  window.location.href = waURL;

  // fallback
  document.getElementById('fallback').style.display = 'block';
  document.getElementById('fallbackText').value = decodeURIComponent(orderDetails.replace(/%0A/g, '\n'));
});

function copyFallback() {
  const textarea = document.getElementById('fallbackText');
  textarea.select();
  document.execCommand('copy');
  alert("Copied! Please paste in WhatsApp chat.");
}