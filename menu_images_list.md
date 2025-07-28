# Menu Images Required for menu_images/ Folder

Based on the menu.json configuration, you need to create the following image files in the `menu_images/` folder:

## Image File List:

1. **puranpoli.jpg** - For "Puranpoli (1P)"
2. **puri_bhaji.jpg** - For "Puri Bhaji (4P Puri)"
3. **masalebhat.jpg** - For "Masalebhat (serves 1)"
4. **masalebhat_large.jpg** - For "Masalebhat (serves 2/3)"
5. **kothimbir_vadi.jpg** - For "Kothimbir Vadi (6P)"
6. **batata_vada.jpg** - For "Batata Vada (4P)"
7. **fried_modak.jpg** - For "Fried Modak (11P)"
8. **fried_modak_large.jpg** - For "Fried Modak (21P)"
9. **besan_ladu.jpg** - For "Besan Ladu (Approx 250gms)"
10. **onion_thalipith.jpg** - For "Onion Thalipith (2P)"
11. **kothimbir_thalipith.jpg** - For "Kothimbir Thalipith (2P)"
12. **sabudana_ladu.jpg** - For "Sabudana Ladu (Approx 250gms)"
13. **shengdana_ladu.jpg** - For "Shengdana Ladu (Approx 250gms)"
14. **bhagar.jpg** - For "Bhagar (serves 1)"
15. **bhagar_large.jpg** - For "Bhagar (serves 2/3)"
16. **sabudana_khichadi.jpg** - For "Sabudana Khichadi (serves 2)"
17. **upwasache_thalipith.jpg** - For "Upwasache Thalipith (2P) + curd"

## Image Specifications:

- **Format:** JPG, PNG, or WebP
- **Recommended Size:** 300x150 pixels (2:1 aspect ratio)
- **File Size:** Keep under 100KB for fast loading
- **Quality:** High enough to look appetizing but optimized for web

## Folder Structure:

```
your-website-folder/
├── index.html
├── style.css
├── script.js
├── menu.json
├── README.md
└── menu_images/
    ├── puranpoli.jpg
    ├── puri_bhaji.jpg
    ├── masalebhat.jpg
    ├── masalebhat_large.jpg
    ├── kothimbir_vadi.jpg
    ├── batata_vada.jpg
    ├── fried_modak.jpg
    ├── fried_modak_large.jpg
    ├── besan_ladu.jpg
    ├── onion_thalipith.jpg
    ├── kothimbir_thalipith.jpg
    ├── sabudana_ladu.jpg
    ├── shengdana_ladu.jpg
    ├── bhagar.jpg
    ├── bhagar_large.jpg
    ├── sabudana_khichadi.jpg
    └── upwasache_thalipith.jpg
```

## Important Notes:

1. **Exact File Names:** Use the exact file names listed above as they match the menu.json configuration
2. **Case Sensitive:** File names are case-sensitive on most web servers
3. **Fallback:** If any image is missing, a default placeholder will be shown automatically
4. **Easy Updates:** To change an image, simply replace the file in the menu_images folder with the same name

## GitHub Pages Setup:

If you're using GitHub Pages:
1. Create a `menu_images` folder in your repository
2. Upload all image files to this folder
3. Commit and push the changes
4. The images will be automatically available at `your-site.github.io/menu_images/filename.jpg`

The application will automatically try to load each image and gracefully fall back to a placeholder if any image is not found.