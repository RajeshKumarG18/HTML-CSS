document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hexInput = document.getElementById('hex');
    const rInput = document.getElementById('r');
    const gInput = document.getElementById('g');
    const bInput = document.getElementById('b');
    const hInput = document.getElementById('h');
    const sInput = document.getElementById('s');
    const lInput = document.getElementById('l');
    const cInput = document.getElementById('c');
    const mInput = document.getElementById('m');
    const yInput = document.getElementById('y');
    const kInput = document.getElementById('k');
    const colorDisplay = document.getElementById('colorDisplay');
    const currentColorCode = document.getElementById('currentColorCode');
    const copyColorBtn = document.getElementById('copyColorBtn');
    const randomColorBtn = document.getElementById('randomColorBtn');
    const resetBtn = document.getElementById('resetBtn');
    const paletteGrid = document.getElementById('paletteGrid');

    // Initialize with white color
    updateColorDisplay('#ffffff');
    generateColorPalette('#ffffff');

    // Event Listeners for HEX input
    hexInput.addEventListener('input', function() {
        let hexValue = this.value;
        if (hexValue[0] !== '#') {
            hexValue = '#' + hexValue;
            this.value = hexValue;
        }
        
        if (isValidHex(hexValue)) {
            updateAllValuesFromHex(hexValue);
            updateColorDisplay(hexValue);
            generateColorPalette(hexValue);
        }
    });

    // Event Listeners for RGB inputs
    [rInput, gInput, bInput].forEach(input => {
        input.addEventListener('input', function() {
            if (this.value > 255) this.value = 255;
            if (this.value < 0) this.value = 0;
            
            if (rInput.value && gInput.value && bInput.value) {
                const hex = rgbToHex(parseInt(rInput.value), parseInt(gInput.value), parseInt(bInput.value));
                updateAllValuesFromHex(hex);
                updateColorDisplay(hex);
                generateColorPalette(hex);
            }
        });
    });

    // Event Listeners for HSL inputs
    [hInput, sInput, lInput].forEach(input => {
        input.addEventListener('input', function() {
            if (hInput.value > 360) hInput.value = 360;
            if (sInput.value > 100) sInput.value = 100;
            if (lInput.value > 100) lInput.value = 100;
            if (hInput.value < 0) hInput.value = 0;
            if (sInput.value < 0) sInput.value = 0;
            if (lInput.value < 0) lInput.value = 0;
            
            if (hInput.value && sInput.value && lInput.value) {
                const hex = hslToHex(parseInt(hInput.value), parseInt(sInput.value), parseInt(lInput.value));
                updateAllValuesFromHex(hex);
                updateColorDisplay(hex);
                generateColorPalette(hex);
            }
        });
    });

    // Event Listeners for CMYK inputs
    [cInput, mInput, yInput, kInput].forEach(input => {
        input.addEventListener('input', function() {
            if (this.value > 100) this.value = 100;
            if (this.value < 0) this.value = 0;
            
            if (cInput.value && mInput.value && yInput.value && kInput.value) {
                const hex = cmykToHex(
                    parseInt(cInput.value), 
                    parseInt(mInput.value), 
                    parseInt(yInput.value), 
                    parseInt(kInput.value)
                );
                updateAllValuesFromHex(hex);
                updateColorDisplay(hex);
                generateColorPalette(hex);
            }
        });
    });

    // Copy to clipboard button
    copyColorBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(currentColorCode.textContent)
            .then(() => {
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                currentColorCode.textContent = 'Copied!';
                
                setTimeout(() => {
                    this.innerHTML = originalIcon;
                    currentColorCode.textContent = hexInput.value;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    });

    // Random color button
    randomColorBtn.addEventListener('click', function() {
        const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        updateAllValuesFromHex(randomHex);
        updateColorDisplay(randomHex);
        generateColorPalette(randomHex);
    });

    // Reset button
    resetBtn.addEventListener('click', function() {
        hexInput.value = '#ffffff';
        rInput.value = '255';
        gInput.value = '255';
        bInput.value = '255';
        hInput.value = '0';
        sInput.value = '0';
        lInput.value = '100';
        cInput.value = '0';
        mInput.value = '0';
        yInput.value = '0';
        kInput.value = '0';
        updateColorDisplay('#ffffff');
        generateColorPalette('#ffffff');
    });

    // Update color display
    function updateColorDisplay(hex) {
        colorDisplay.style.backgroundColor = hex;
        currentColorCode.textContent = hex.toUpperCase();
        
        // Determine if color is light or dark for text contrast
        const rgb = hexToRgb(hex);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        colorDisplay.style.color = brightness > 128 ? 'black' : 'white';
    }

    // Update all values from HEX
    function updateAllValuesFromHex(hex) {
        hexInput.value = hex;
        
        // Update RGB
        const rgb = hexToRgb(hex);
        rInput.value = rgb.r;
        gInput.value = rgb.g;
        bInput.value = rgb.b;
        
        // Update HSL
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        hInput.value = Math.round(hsl.h);
        sInput.value = Math.round(hsl.s);
        lInput.value = Math.round(hsl.l);
        
        // Update CMYK
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
        cInput.value = Math.round(cmyk.c);
        mInput.value = Math.round(cmyk.m);
        yInput.value = Math.round(cmyk.y);
        kInput.value = Math.round(cmyk.k);
    }

    // Generate color palette
    function generateColorPalette(baseHex) {
        paletteGrid.innerHTML = '';
        
        const baseRgb = hexToRgb(baseHex);
        const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
        
        // Create variations
        const variations = [
            { name: 'Original', hex: baseHex },
            { name: 'Lighter', hex: hslToHex(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 20, 100)) },
            { name: 'Light', hex: hslToHex(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 10, 100)) },
            { name: 'Darker', hex: hslToHex(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 20, 0)) },
            { name: 'Dark', hex: hslToHex(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 10, 0)) },
            { name: 'Saturated', hex: hslToHex(baseHsl.h, Math.min(baseHsl.s + 30, 100), baseHsl.l) },
            { name: 'Desaturated', hex: hslToHex(baseHsl.h, Math.max(baseHsl.s - 30, 0), baseHsl.l) },
            { name: 'Complementary', hex: hslToHex((baseHsl.h + 180) % 360, baseHsl.s, baseHsl.l) },
            { name: 'Analogous 1', hex: hslToHex((baseHsl.h + 30) % 360, baseHsl.s, baseHsl.l) },
            { name: 'Analogous 2', hex: hslToHex((baseHsl.h - 30 + 360) % 360, baseHsl.s, baseHsl.l) },
            { name: 'Triadic 1', hex: hslToHex((baseHsl.h + 120) % 360, baseHsl.s, baseHsl.l) },
            { name: 'Triadic 2', hex: hslToHex((baseHsl.h + 240) % 360, baseHsl.s, baseHsl.l) },
        ];
        
        variations.forEach(variation => {
            const paletteItem = document.createElement('div');
            paletteItem.className = 'palette-item';
            paletteItem.style.backgroundColor = variation.hex;
            paletteItem.innerHTML = `<span>${variation.name}</span><span>${variation.hex.toUpperCase()}</span>`;
            
            paletteItem.addEventListener('click', () => {
                updateAllValuesFromHex(variation.hex);
                updateColorDisplay(variation.hex);
                generateColorPalette(variation.hex);
            });
            
            paletteGrid.appendChild(paletteItem);
        });
    }

    // Color conversion functions
    function isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    function hexToRgb(hex) {
        if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        
        return { r, g, b };
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }

        return {
            h: h,
            s: s * 100,
            l: l * 100
        };
    }

    function hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        
        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
        let r = 0, g = 0, b = 0;
        
        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        
        return rgbToHex(r, g, b);
    }

    function rgbToCmyk(r, g, b) {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);
        
        c = (c - k) / (1 - k) || 0;
        m = (m - k) / (1 - k) || 0;
        y = (y - k) / (1 - k) || 0;
        
        return {
            c: c * 100,
            m: m * 100,
            y: y * 100,
            k: k * 100
        };
    }

    function cmykToHex(c, m, y, k) {
        c /= 100;
        m /= 100;
        y /= 100;
        k /= 100;
        
        const r = 255 * (1 - c) * (1 - k);
        const g = 255 * (1 - m) * (1 - k);
        const b = 255 * (1 - y) * (1 - k);
        
        return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
    }
});