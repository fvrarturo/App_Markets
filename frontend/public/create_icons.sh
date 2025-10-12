#!/bin/bash
# Simple script to create placeholder app icons
# Using ImageMagick (if available) or creating SVG fallbacks

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    # Create 192x192 icon with ImageMagick
    convert -size 192x192 xc:'#1e293b' -gravity center \
            -pointsize 120 -fill '#3b82f6' -annotate +0+0 '📊' \
            icon-192.png
    
    # Create 512x512 icon
    convert -size 512x512 xc:'#1e293b' -gravity center \
            -pointsize 320 -fill '#3b82f6' -annotate +0+0 '📊' \
            icon-512.png
    
    echo "✅ Icons created with ImageMagick"
else
    # Create SVG icons as fallback
    cat > icon.svg << 'SVGEND'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#1e293b"/>
  <text x="100" y="130" font-size="100" text-anchor="middle" fill="#3b82f6">📊</text>
</svg>
SVGEND
    
    # Copy SVG to PNG names (browsers will handle it)
    cp icon.svg icon-192.png
    cp icon.svg icon-512.png
    
    echo "✅ SVG icons created (ImageMagick not found)"
    echo "💡 For better icons, install ImageMagick: brew install imagemagick"
fi
