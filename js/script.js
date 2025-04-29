// DOM elements
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');

// Setup default date range
setupDateInputs(startInput, endInput);

// Use your API key here
const API_KEY = 'eRepE7m7SSmMiMRHx6SZbKH2Rpt08JtnczxGLICA';

// Button click handler
button.addEventListener('click', async () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert('Please select both a start and end date.');
    return;
  }
// Set today's date to end input
endInput.value = new Date().toISOString().split('T')[0];

  // Show loading message
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos…</p>
    </div>
  `;

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`
    );
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected API response');
    }

    const galleryItems = data
      .filter(item => item.media_type === 'image') // Skip videos
      .map(item => `
        <div class="gallery-item">
          <img src="${item.url}" alt="${item.title}" />
          <p><strong>${item.title}</strong><br>${item.date}</p>
        </div>
      `).join('');

    gallery.innerHTML = galleryItems || `
      <div class="placeholder">
        <div class="placeholder-icon">🚫</div>
        <p>No images found for this date range.</p>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching data:', error);
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">⚠️</div>
        <p>Oops! Something went wrong while fetching the data.</p>
      </div>
    `;
  }
});