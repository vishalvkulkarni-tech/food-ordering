# Annapurna Kitchen - Enhanced Food Ordering Web Application

## Overview
This is a comprehensive, modern food ordering web application for Annapurna Kitchen with advanced features including coupon system, packaging charges, dynamic configuration, and professional UI/UX design.

## Features

### ✅ **Fully Configurable via JSON**
- Site title, mobile number, UPI ID - all configurable in `menu.json`
- Working hours and LIVE/CLOSED status
- Packaging charges and fee structure
- Custom messages and delivery information

### 🎫 **Advanced Coupon System**
- Multiple coupon types (percentage, fixed amount)
- Minimum order value validation
- Maximum discount limits
- Case-insensitive coupon codes
- Real-time discount calculation

### 📱 **Modern UI/UX Design**
- Professional card-based menu layout
- Responsive design for all devices
- Smooth animations and hover effects
- Modern color scheme with gradients
- Loading states and error handling

### 💰 **Transparent Pricing**
- Item-wise packaging charges (automatically capped at ₹50)
- Clear breakdown showing:
  - Subtotal
  - Packaging charges
  - Convenience fees: ₹0
  - Platform fees: ₹0
  - Delivery: Free for 5km radius
  - Coupon discounts

### 🖼️ **Smart Image Management**
- Automatic image loading from `menu_images/` folder
- Fallback to default images if item image not found
- Proper image sizing and responsive display

### 📲 **Enhanced Order Processing**
- Numbered WhatsApp message format (1. Item x Quantity)
- QR code generation for UPI payments
- Customer details form with validation
- Payment completion message
- Manual copy/paste fallback option

### 🕒 **Business Hour Management**
- LIVE status control (TRUE/FALSE)
- Automatic closure message display
- Configurable working hours display

## File Structure

```
/
├── index.html          # Enhanced HTML with modern structure
├── style.css           # Professional CSS with animations
├── script.js           # Comprehensive JavaScript functionality
├── menu.json           # Complete configuration file
└── menu_images/        # Folder for menu item images
    ├── puranpoli.jpg
    ├── puri_bhaji.jpg
    ├── masalebhat.jpg
    └── ... (other menu item images)
```

## Configuration Guide

### Menu JSON Structure

The `menu.json` file contains all configuration:

```json
{
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
    }
  ],
  "menu": [
    {
      "name": "Puranpoli (1P)",
      "price": "89",
      "available": "true",
      "packaging_charge": 5,
      "image": "puranpoli.jpg"
    }
  ]
}
```

## Setup Instructions

### 1. **File Upload**
- Upload all files to your web hosting/GitHub Pages
- Create a `menu_images` folder in the root directory
- Upload menu item images to the `menu_images` folder

### 2. **Image Setup**
- Name images exactly as specified in the `menu.json` file
- Supported formats: JPG, PNG, WebP
- Recommended size: 300x150 pixels or similar aspect ratio
- If an image is missing, a default placeholder will be shown

### 3. **Customization**
To customize the application, simply edit the `menu.json` file:

#### **Change Business Details:**
```json
"config": {
  "site_title": "Your Restaurant Name",
  "mobile_number": "YOUR_MOBILE_NUMBER",
  "upi_id": "YOUR_UPI_ID@bankname"
}
```

#### **Add/Edit Coupons:**
```json
"coupons": [
  {
    "coupon_code": "NEW20",
    "discount_perc": 20,
    "max_discount": 200,
    "min_order_value_for_coupon": 500
  }
]
```

#### **Update Menu Items:**
```json
"menu": [
  {
    "name": "New Item",
    "price": "199",
    "available": "true",
    "packaging_charge": 15,
    "image": "new_item.jpg"
  }
]
```

#### **Control Kitchen Status:**
```json
"LIVE": "FALSE"  // Closes the kitchen
"LIVE": "TRUE"   // Opens the kitchen
```

## How It Works

### 1. **Menu Display**
- Items load from `menu.json`
- Images load from `menu_images/` folder
- Only available items are shown
- Professional card layout with hover effects

### 2. **Ordering Process**
1. Customer selects items and quantities
2. Cart summary shows real-time totals
3. Customer proceeds to checkout
4. Coupon codes can be applied
5. Final order summary is displayed
6. Customer proceeds to payment
7. QR code is generated for UPI payment
8. Customer fills delivery details
9. Order is sent via WhatsApp with numbered format

### 3. **Payment Flow**
- UPI QR code generation
- 30-second wait before showing delivery form
- WhatsApp message with complete order details
- Payment completion message
- Manual copy/paste fallback option

### 4. **Administrative Control**
- Set `LIVE: "FALSE"` to close kitchen
- All text messages configurable via JSON
- Easy addition/removal of menu items
- Simple coupon management

## Coupon System Details

### **Coupon Types:**
1. **Percentage Discounts:** `"discount_perc": 10` (10% off)
2. **Fixed Amount:** `"fixed_discount": 50` (₹50 off)

### **Validation Rules:**
- Case-insensitive coupon codes
- Minimum order value checking
- Maximum discount limits
- One coupon per order

### **Example Coupons:**
- `SAVE10`: 10% off, max ₹100 discount, min order ₹200
- `WELCOME20`: 20% off, max ₹150 discount, min order ₹300
- `FLAT50`: Fixed ₹50 off, min order ₹250

## Packaging Charges System

### **Item-wise Charges:**
Each menu item has individual packaging charges based on the provided table:
- Puranpoli: ₹5
- Puri Bhaji: ₹12
- Masalebhat (serves 1): ₹10
- And so on...

### **Automatic Capping:**
- Maximum packaging charge per order: ₹50
- System automatically applies the cap
- Transparent display in cart summary

## Mobile Responsiveness

The application is fully responsive and optimized for:
- Mobile phones (portrait & landscape)
- Tablets
- Desktop computers
- Touch interactions
- Fast loading on slow connections

## Technical Features

### **Performance:**
- Smooth animations and transitions
- Efficient image loading with fallbacks
- Minimal JavaScript for fast execution
- Progressive enhancement approach

### **Accessibility:**
- Proper HTML semantics
- Keyboard navigation support
- Screen reader friendly
- High contrast design elements

### **Browser Support:**
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Fallback support for older browsers

## Troubleshooting

### **Common Issues:**

1. **Images not loading:**
   - Check if images are in `menu_images/` folder
   - Verify image file names match JSON entries
   - Ensure images are web-compatible (JPG, PNG, WebP)

2. **WhatsApp not opening:**
   - Fallback copy/paste option is provided
   - Check mobile number format in config
   - Ensure WhatsApp is installed on device

3. **Coupons not working:**
   - Verify coupon code spelling in JSON
   - Check minimum order value requirements
   - Ensure coupon is properly formatted in JSON

4. **Kitchen shows as closed:**
   - Check `"LIVE": "TRUE"` in config
   - Verify JSON syntax is correct

## Support

For technical support or customization requests, the application is designed to be easily maintainable through the JSON configuration file. Most changes can be made without touching the code files.

## Version Information

- **Version:** 2.0 Enhanced
- **Last Updated:** July 2025
- **Compatibility:** Modern web browsers
- **Framework:** Vanilla JavaScript (no dependencies except QRious for QR codes)

---

**Ready to deploy!** Simply upload all files to your web hosting service and start taking orders with this professional food ordering system.