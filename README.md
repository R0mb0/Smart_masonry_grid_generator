# Smart masonry grid generator

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/72932074f7b54f3eaa8bb772418f996f)](https://app.codacy.com/gh/R0mb0/Smart_masonry_grid_generator/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![pages-build-deployment](https://github.com/R0mb0/Smart_masonry_grid_generator/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/R0mb0/Smart_masonry_grid_generator/actions/workflows/pages/pages-build-deployment)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/R0mb0/PDF_accessibility_fixer)
[![Open Source Love svg3](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/R0mb0/PDF_accessibility_fixer)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/license/mit)
[![Donate](https://img.shields.io/badge/PayPal-Donate%20to%20Author-blue.svg)](http://paypal.me/R0mb0)

A lightweight, dependency-free JavaScript tool to generate justified image grids using HTML5 Canvas. Features smart layout optimization, aspect-ratio matching, and high-res export for A4/A3 formats.

<div align="center">

## [👉 Click here to test the page! 👈](https://r0mb0.github.io/Smart_masonry_grid_generator/)

[![example 1](https://github.com/R0mb0/Smart_masonry_grid_generator/blob/main/Readme_Imgs/0002.png?raw=true)](https://r0mb0.github.io/Smart_masonry_grid_generator/)

[![example 2](https://github.com/R0mb0/Smart_masonry_grid_generator/blob/main/Readme_Imgs/0001.png?raw=true)](https://r0mb0.github.io/Smart_masonry_grid_generator/)

</div>

---

## 🚀 Features

- **Smart "Best Fit" Algorithm**: Automatically calculates the optimal row height to fill the specific aspect ratio of the page (A4, A3, etc.) perfectly.
- **Print-Ready Formats**: Presets for A4, A3, A5 (Vertical & Horizontal) + Custom Dimensions.
- **Privacy-First**: Runs entirely in the browser. Your photos are never uploaded to a server.
- **Drag & Drop Interface**: Easy to use, supports multiple file uploads.
- **High Resolution Export**: Generates high-quality PNGs suitable for printing.
- **No Dependencies**: Built with pure Vanilla JavaScript and HTML5 Canvas. No frameworks, no bloat.

---

## 🛠️ How it works

1. **Upload Images**: Drag & drop your collection of photos.
2. **Select Format**: Choose a target paper size (e.g., A4 Vertical).
3. **The Math Magic**:
    - The algorithm simulates hundreds of layout variations.
    - It adjusts row heights iteratively to find the combination that results in a total grid height matching the target page height.
    - It centers the final row if necessary to avoid distortion.
4. **Render**: The grid is drawn onto an HTML5 Canvas.
5. **Download**: You get a clean PNG file ready to print.

---

## 🏆 What makes it special?

Most masonry grid libraries (like Masonry.js) are designed for infinite scrolling websites. They don't care about "filling a page".
If you try to print a standard masonry layout on an A4 sheet, you often get:
- A long, thin strip with massive empty margins.
- Or a grid that cuts off halfway through the page.

**This tool is different.** It reverses the logic: instead of just placing images, it mathematically solves the layout to match the **Aspect Ratio** of your physical paper.

---

## 💡 Why use this tool?

- **Photographers**: Quickly create contact sheets or collages for clients.
- **Designers**: Generate mood boards that fit perfectly into presentation slides.
- **Archiving**: Combine scanned receipts or documents into single pages.
- **Printing**: Create poster-sized collages without using complex software like Photoshop or InDesign.

---

## 🔒 Privacy & Security

- **Client-Side Only**: All image processing happens locally within your browser's memory.
- **Zero Data Transfer**: No images are sent to any external server or API.
- **Open Source**: You can inspect the code to verify that your data stays with you.

---

## ⚡ Getting Started

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/R0mb0/Smart_masonry_grid_generator](https://github.com/R0mb0/Smart_masonry_grid_generator.git)
    ```

2. **Run it**:
Simply open `index.html` in any modern web browser. No `npm install` or build steps required!
