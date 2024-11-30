// Helper functions for localStorage
const setLocalStorageKey = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getLocalStorageKey = (key) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return null;
  }
};

// Palette-specific functions
export const getPalettes = () => {
  const palettes = getLocalStorageKey('palettes');
  return Array.isArray(palettes) ? palettes : [];
};

export const setPalettes = (newPalettes) => {
  if (!Array.isArray(newPalettes)) {
    newPalettes = [];
  }
  setLocalStorageKey('palettes', newPalettes);
};

export const addPalette = (palette) => {
  const palettes = getPalettes();
  palettes.push(palette);
  setPalettes(palettes);
};

export const deletePalette = (paletteId) => {
  const palettes = getPalettes();
  const updatedPalettes = palettes.filter(p => p.id !== paletteId);
  setPalettes(updatedPalettes);
}; 