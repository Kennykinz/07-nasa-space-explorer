// DOM Elements
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');

// Initialize date pickers
setupDateInputs(startInput, endInput);

// Constants
const apiKey = 'eRepE7m7SSmMiMRHx6SZbKH2Rpt08JtnczxGLICA';
const apiBase = 'https://api.nasa.gov/planetary/apod';

// Utility to format date as YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

// Generate random date range within allowed APOD dates
function getRandomDateRange(days = 5) {
  const start = new Date('1995-06-16');
  const today = new Date();

  const rangeInDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const randomOffset = Math.floor(Math.random() * (rangeInDays - days));
  const randomStart = new Date(start.getTime() + randomOffset * 24 * 60 * 60 * 1000);
  const randomEnd = new Date(randomStart.getTime() + (days - 1) * 24 * 60 * 60 * 1000);

  return {
    startDate: formatDate(randomStart),
    endDate: formatDate(randomEnd),
  };
}

// Render loading message
function showLoading() {
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos…</p>
    </div>
  `;
}

// Render gallery items
function displayGallery(data) {
  gallery.innerHTML = '';

  data.forEach(item => {
    if (item.media_type === 'image') {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      galleryItem.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <p><strong>${item.title}</strong><br>${item.date}</p>
      `;
      gallery.appendChild(galleryItem);
    }
  });

  if (gallery.innerHTML === '') {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">📭</div>
        <p>No images found for this range. Try again!</p>
      </div>
    `;
  }
}

// Fetch images from NASA API
async function fetchImages() {
  showLoading();

  const { startDate, endDate } = getRandomDateRange();
  const url = `${apiBase}?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (Array.isArray(data)) {
      displayGallery(data);
    } else {
      throw new Error(data.error?.message || 'Unexpected response');
    }
  } catch (err) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">❌</div>
        <p>Failed to load images: ${err.message}</p>
      </div>
    `;
  }
}

// Button click handler
button.addEventListener('click', fetchImages);