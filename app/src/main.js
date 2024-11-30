import './style.css'
import { v4 as generateUUID } from 'uuid';
import { getPalettes, addPalette, deletePalette } from './localStorage.js';

// DOM Elements
const paletteForm = document.querySelector('.palette-form');
const palettesContainer = document.getElementById('palettes-container');

// Create new palette
paletteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const title = document.getElementById('palette-title').value;
  const color1 = document.getElementById('color1').value;
  const color2 = document.getElementById('color2').value;
  const color3 = document.getElementById('color3').value;
  const temperature = document.querySelector('input[name="temperature"]:checked')?.value || 'neutral';

  // Create new palette object
  const newPalette = {
    id: generateUUID(),
    title,
    colors: [color1, color2, color3],
    temperature
  };

  // Save to localStorage
  addPalette(newPalette);
  
  // Create visual card
  createPaletteCard(newPalette);
  
  paletteForm.reset();
});

function createPaletteCard({ id, title, colors, temperature }) {
  const li = document.createElement('li');
  li.className = 'palette-card';
  li.dataset.id = id;
  li.innerHTML = `
    <div class="palette-header">
      <span>${title}</span>
    </div>
    ${colors.map(color => `
      <div class="color-row">
        <div class="color-box" style="background-color: ${color}">Text Example</div>
        <button class="copy-button" data-color="${color}">Copy</button>
      </div>
    `).join('')}
    <button class="delete-button">Delete Palette</button>
    <div class="temperature-label temperature-${temperature}">${temperature}</div>
  `;

  // Add delete functionality
  li.querySelector('.delete-button').addEventListener('click', () => {
    deletePalette(id);
    li.remove();
  });

  // Copy functionality remains the same
  li.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', async () => {
      const colorHex = button.dataset.color;
      const originalText = button.textContent;
      
      try {
        await navigator.clipboard.writeText(colorHex);
        button.textContent = 'Copied hex!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 1000);
      } catch (err) {
        console.error('Failed to copy:', err);
        button.textContent = 'Copy failed!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 1000);
      }
    });
  });

  palettesContainer.appendChild(li);
}

// Load saved palettes on page load
function loadSavedPalettes() {
  const savedPalettes = getPalettes();
  if (savedPalettes && Array.isArray(savedPalettes)) {  // Add check to ensure it's an array
    savedPalettes.forEach(palette => {
      createPaletteCard(palette);
    });
  }
}

// Make sure this is at the bottom of your file
window.addEventListener('DOMContentLoaded', loadSavedPalettes);