let categoryColors = {
  'School': '#FFA500',
  'Work': '#0066CC',
  'Personal': '#28A745'
};

function updateLocationOptions() {
  const modality = document.getElementById('event_modality').value;
  const locationField = document.getElementById('location_field');
  const remoteUrlField = document.getElementById('remote_url_field');
  const locationInput = document.getElementById('event_location');
  const remoteUrlInput = document.getElementById('event_remote_url');


  // Show/hide fields based on modality selection
  if (modality === 'inperson') {
    locationField.style.display = 'block';
    remoteUrlField.style.display = 'none';
    locationInput.setAttribute('required', '');
    remoteUrlInput.removeAttribute('required');
  } else if (modality === 'remote') {
    locationField.style.display = 'none';
    remoteUrlField.style.display = 'block';
    locationInput.removeAttribute('required');
    remoteUrlInput.setAttribute('required', '');
  } else {
    locationField.style.display = 'none';
    remoteUrlField.style.display = 'none';
    locationcput.removeAttribute('required');
    remoteUrlInput.removeAttribute('required');
  }
}

function createEventCard(eventDetails) {
  let event_element = document.createElement('div');
  event_element.classList.add('card', 'mt-2', 'shadow-sm', 'border-primary');
  const bgColor = categoryColors[eventDetails.category];
  if (bgColor) {
    event_element.style.backgroundColor = bgColor;
  }

  event_element.style.cursor = 'pointer';
  event_element.dataset.event = JSON.stringify(eventDetails);
  event_element.addEventListener('click', function() { editEvent(this); });

  let info = document.createElement('div');
  info.classList.add('card-body', 'p-2');
  info.innerHTML = `
    <h6 class="card-title text-truncate mb-1">${eventDetails.name}</h6>
    <small class="text-muted d-block mb-1">
      <strong>Time:</strong> ${eventDetails.time}
    </small>
     <small class="text-muted d-block mb-1">
      <strong>Category:</strong> ${eventDetails.category}
    </small>
    <small class="text-muted d-block mb-1">
      <strong>Modality:</strong> ${eventDetails.modality === 'inperson' ? 'In-Person' : 'Remote'}
    </small>
    ${eventDetails.modality === 'inperson' && eventDetails.location ? `<small class="text-muted d-block mb-1"><strong>Location:</strong> ${eventDetails.location}</small>` : ''}
    ${eventDetails.modality === 'remote' && eventDetails.remoteUrl ? `<small class="text-muted d-block mb-1"><strong>URL:</strong> <a href="${eventDetails.remoteUrl}" target="_blank" class="text-decoration-none">Join</a></small>` : ''}
    ${eventDetails.attendees ? `<small class="text-muted d-block"><strong>Attendees:</strong> ${eventDetails.attendees}</small>` : ''}
  `;

  event_element.appendChild(info);
  return event_element;
}

function editEvent(eventElement) {
  const eventData = JSON.parse(eventElement.dataset.event);
  document.getElementById('event_name').value = eventData.name;
  document.getElementById('event_weekday').value = eventData.weekday;
  document.getElementById('event_time').value = eventData.time;
  document.getElementById('event_category').value = eventData.category;
  document.getElementById('event_modality').value = eventData.modality;
  document.getElementById('event_location').value = eventData.location || '';
  document.getElementById('event_remote_url').value = eventData.remoteUrl || '';
  document.getElementById('event_attendees').value = eventData.attendees || '';
  updateLocationOptions();
  eventElement.remove();
  
  const myModalElement = document.getElementById('event_modal');
  const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
  myModal.show();
}

function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

function addEventToCalendarUI(eventInfo) {
  let event_card = createEventCard(eventInfo);
  let dayElement = document.getElementById(eventInfo.weekday);
  dayElement.appendChild(event_card);
}

function saveEvent() {
    const eventForm = document.getElementById('event_form');
    if (!eventForm.checkValidity()) {
      eventForm.classList.add('was-validated');
      return;
    }

    const modality = document.getElementById('event_modality').value;
    const remoteUrl = document.getElementById('event_remote_url').value;
    if (modality === 'remote' && remoteUrl && !isValidUrl(remoteUrl)) {
      alert('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    const eventData = {
      name: document.getElementById('event_name').value,
      weekday: document.getElementById('event_weekday').value,
      time: document.getElementById('event_time').value,
      category: document.getElementById('event_category').value,
      modality: document.getElementById('event_modality').value,
      location: document.getElementById('event_location').value || null,
      remoteUrl: document.getElementById('event_remote_url').value || null,
      attendees: document.getElementById('event_attendees').value || null
    };

    console.log('Event saved:', eventData);
    eventForm.classList.remove('was-validated');
    updateLocationOptions();

    addEventToCalendarUI(eventData);

    const myModalElement = document.getElementById('event_modal');
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.hide();

    reset();
}

function reset() {
    
    const eventForm = document.getElementById('event_form');

    eventForm.classList.remove('was-validated');
    eventForm.reset();
    updateLocationOptions();
}