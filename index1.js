document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('doctor-search-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const searchInput = document.getElementById('doctor-name').value.toLowerCase();
    const doctorResultsContainer = document.getElementById('doctor-results');
    doctorResultsContainer.innerHTML = ''; // Clear previous results

    // Local Doctor Search
    const doctors = [
      { name: 'Dr. John Doe', diseases: ['Cardiovascular Disease', 'High Blood Pressure', 'Diabetes'], location: { lat: 37.7749, lng: -122.4194 }},
      { name: 'Dr. Jane Smith', diseases: ['Pediatric Care', 'Childhood Diseases', 'Asthma'], location: { lat: 40.7128, lng: -74.0060 }},
      { name: 'Dr. Michael Johnson', diseases: ['Orthopedic Injuries', 'Sports Medicine', 'Fractures'], location: { lat: 38.9072, lng: -77.0369 }},
      { name: 'Dr. Emily Brown', diseases: ['Skin Disorders', 'Dermatitis', 'Acne'], location: { lat: 34.0522, lng: -118.2437 }},
      { name: 'Dr. David Wilson', diseases: ['Cancer Treatment', 'Oncology', 'Chemotherapy'], location: { lat: 41.8781, lng: -87.6298 }}
    ];

    const filteredDoctors = doctors.filter(doctor => {
      return doctor.diseases.some(disease => disease.toLowerCase().includes(searchInput));
    });

    // Display filtered local doctors (with distance check)
    if (filteredDoctors.length > 0) {
      const doctorList = document.createElement('ul');
      filteredDoctors.forEach(doctor => {
        const listItem = document.createElement('li');
        listItem.textContent = `${doctor.name} - ${doctor.diseases.join(', ')}`;
        doctorList.appendChild(listItem);
      });
      doctorResultsContainer.appendChild(doctorList);
    } else {
      doctorResultsContainer.textContent = 'No doctors found for the given disease.';
    }

    // Geolocation and Places API Search
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };

        // Initialize the map
        const map = new google.maps.Map(document.getElementById('map'), {
          center: userLocation,
          zoom: 12 
        });

        // Marker for user's location
        new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Your Location"
        });

        const placesService = new google.maps.places.PlacesService(document.createElement('div'));
        const request = {
          location: userLocation,
          radius: '5000', 
          type: 'doctor',
          keyword: searchInput 
        };

        placesService.nearbySearch(request, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
              new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name
              });
            });
          } else {
            console.error('Places service request failed. Status: ' + status);
          }
        });
      }, error => {
        console.error('Geolocation error:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  });
});
