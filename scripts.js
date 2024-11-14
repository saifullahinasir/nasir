// Toggle the menu visibility
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Handle form submission to send data to the backend
document.getElementById('crimeForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Create a FormData object from the form
  const formData = new FormData();

  // Append all form data fields to FormData
  formData.append('reporterName', document.getElementById('reporterName').value);
  formData.append('crimeCategory', document.getElementById('crimeCategory').value);
  formData.append('crimeDescription', document.getElementById('crimeDescription').value);
  formData.append('location', document.getElementById('location').value);
  formData.append('date', document.getElementById('date').value);
  formData.append('time', document.getElementById('time').value);
  
  // Append files if selected
  const crimeImage = document.getElementById('crimeImage').files[0];
  const crimeVideo = document.getElementById('crimeVideo').files[0];
  const crimeAudio = document.getElementById('crimeAudio').files[0];
  
  if (crimeImage) formData.append('image', crimeImage);
  if (crimeVideo) formData.append('video', crimeVideo);
  if (crimeAudio) formData.append('audio', crimeAudio);

  // Send the form data to the backend
  fetch('http://localhost:5000/api/reports/submit', {
    method: 'POST',
    body: formData,  // Send the FormData object with files and text data
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('statusMessage').textContent = data.message;
    document.getElementById('crimeForm').reset();  // Reset the form after submission
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('statusMessage').textContent = 'Error submitting report.';
  });
});

// Redirect to admin page on 'View Report' button click
document.getElementById('viewReportButton').addEventListener('click', function() {
  window.location.href = 'admin.html';
});
