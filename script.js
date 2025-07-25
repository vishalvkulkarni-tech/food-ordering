const items = document.querySelectorAll('.item');
const totalSpan = document.getElementById('total');
const generateQRBtn = document.getElementById('generateQR');
const paidCheckbox = document.getElementById('paidCheckbox');
const submitBtn = document.getElementById('submitBtn');
const qrArea = document.getElementById('qrArea');

function updateTotal() {
  let total = 0;
  items.forEach(item => {
    if (item.checked) {
      total += parseFloat(item.dataset.price);
    }
  });
  totalSpan.textContent = total;
  qrArea.innerHTML = '';
  paidCheckbox.checked = false;
  paidCheckbox.disabled = true;
  submitBtn.disabled = true;
}

items.forEach(item => item.addEventListener('change', updateTotal));

generateQRBtn.addEventListener('click', () => {
  let total = parseFloat(totalSpan.textContent);
  if (total === 0) {
    alert("Please select items first");
    return;
  }

  const upiId = "9766448463@apl";
  const name = "FoodOrder";
  const note = "FoodPayment";
  const url = `upi://pay?pa=${upiId}&pn=${name}&am=${total}&cu=INR&tn=${note}`;
  const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  qrArea.innerHTML = `<img src="${qrAPI}" alt="UPI QR Code"><p>Scan to Pay ₹${total}</p>`;
  paidCheckbox.disabled = false;
});

paidCheckbox.addEventListener('change', () => {
  submitBtn.disabled = !paidCheckbox.checked;
});

submitBtn.addEventListener('click', () => {
  let selectedItems = [];
  items.forEach(item => {
    if (item.checked) selectedItems.push(item.value);
  });

  const msg = `Hi, I have ordered: ${selectedItems.join(", ")} and paid ₹${totalSpan.textContent}`;
  const whatsappURL = `https://wa.me/919766448463?text=${encodeURIComponent(msg)}`;
  window.open(whatsappURL, '_blank');
});
