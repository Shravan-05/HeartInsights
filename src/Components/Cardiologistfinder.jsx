import React, { useState } from 'react';
import '../STYLE/CardiologistsFinder.css';

function CardiologistsFinder() {
  const [cardiologists, setCardiologists] = useState([]);
  const [status, setStatus] = useState('Click the button to find cardiologists near you.');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchStarted, setIsSearchStarted] = useState(false);

  const handleFindClick = () => {
    setIsSearchStarted(true);
    setIsLoading(true);
    setStatus('Getting your location... Please allow location access in the browser prompt.');

    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(success, error);
  };

  const success = (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    setStatus('Searching for nearby cardiologists...');
    
    if (!window.google || !window.google.maps || !window.google.maps.places) {
        setStatus('Google Maps API is not loaded. Please check your setup.');
        setIsLoading(false);
        return;
    }
    
    const userLocation = new window.google.maps.LatLng(lat, lng);
    const map = new window.google.maps.Map(document.createElement('div')); 
    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      location: userLocation,
      radius: '5000',
      keyword: 'cardiologist'
    };

    service.nearbySearch(request, (results, searchStatus) => {
      if (searchStatus === window.google.maps.places.PlacesServiceStatus.OK && results) {
        

        const ratedResults = results.filter(place => place.rating);
        let processedResults;

        if (ratedResults.length > 0) {
          processedResults = ratedResults
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
        } else {
          processedResults = results.slice(0, 5);
        }

        setCardiologists(processedResults);
        setStatus(`Showing the top ${processedResults.length} cardiologists near you.`);
        

      } else {
        setStatus('Could not find any cardiologists nearby. Please try again.');
      }
      setIsLoading(false);
    });
  };

  const error = (err) => {
    let errorMessage = 'Unable to retrieve your location.';
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'You denied the request for Geolocation. Please enable it in your browser settings.';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable.';
        break;
      case err.TIMEOUT:
        errorMessage = 'The request to get user location timed out.';
        break;
      default:
        errorMessage = 'An unknown error occurred.';
        break;
    }
    setStatus(errorMessage);
    setIsLoading(false);
  };

  return (
    <div className="finder-container">
      <h1>Find a Cardiologist Near You 🩺</h1>

      {!isSearchStarted && (
        <button id="find-btn" onClick={handleFindClick}>
          📍 Use My Current Location
        </button>
      )}

      <p id="status">{status}</p>
      
      {isLoading && <div className="loader"></div>}

      <div id="results-container">
        {cardiologists.map((place) => {
        
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`;
          
          return (
            <div key={place.place_id} className="cardiologist-card">
              <div className="card-content">
                <h3>{place.name.slice(0,40)}</h3>
                <p>{place.vicinity}</p>
                <p className="rating">
                  {place.rating ? `${place.rating} ⭐` : 'No rating available'}
                </p>
              </div>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="map-link">
                View on Google Maps
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CardiologistsFinder;