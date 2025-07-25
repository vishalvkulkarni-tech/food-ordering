const menuItems = [
  { name: "Poha", price: 20 },
  { name: "Idli Sambar", price: 30 },
  { name: "Vada Pav", price: 15 },
  { name: "Upma", price: 25 },
  { name: "Misal Pav", price: 40 },
];

const menuDiv = document.getElementById("menu");
const totalSpan = document.getElementById("total");
const qrContainer = document.getElementById("qrContainer");
let selectedItems = [];

menuItems.forEach((item, index) => {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = item.price;
  checkbox.dataset.name = item.name;
  checkbox.addEventListener("change", updateTotal);
  label.appendChild(checkbox);
  label.append(` ${item.name} - ₹${item.price}`);
  menuDiv.appendChild(label);
});

function updateTotal() {
  let total = 0;
  selectedItems = [];
  document.querySelectorAll("#menu input:checked").forEach((checkbox) => {
    total += parseInt(checkbox.value);
    selectedItems.push(checkbox.dataset.name);
  });
  totalSpan.textContent = total;
}

document.getElementById("payButton").addEventListener("click", () => {
  const total = totalSpan.textContent;
  if (total == 0) {
    alert("Please select at least one item.");
    return;
  }

  // Create UPI QR Code via Google Chart API
  const upiId = "9766448463@apl";
  const name = "Vishal Food";
  const upiString = `upi://pay?pa=${upiId}&pn=${name}&am=${total}&cu=INR`;

  const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(
    upiString
  )}`;

  qrContainer.innerHTML = `
    <p>Scan this QR with your UPI app:</p>
    <img src="${qrUrl}" alt="UPI QR Code" />
    <p><strong>Order:</strong> ${selectedItems.join(", ")}</p>
  `;
});
