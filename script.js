// URL to fetch data for all countries from the REST Countries API
const apiUrl = 'https://restcountries.com/v3.1/all';

// Variable to store the selected random country
let selectedCountry = '';

// Initialize the player's score and set the maximum rounds for the game
var score = 0;
const maxRounds = 10; 
var roundsPlayed = 0;

// Function to get a random country from the API
async function getRandomCountry() {
  try {
    // Fetch data for all countries from the API
    const response = await fetch(apiUrl);
    const countries = await response.json();

    // Select a random index within the range of the countries array length
    const randomIndex = Math.floor(Math.random() * countries.length);

    // Retrieve the random country object
    const randomCountry = countries[randomIndex];

    // Save the random country's name into a global variable for later use
    selectedCountry = randomCountry.name.common;

    // Return the name of the selected random country
    return selectedCountry;
  } catch (error) {
    // Log any errors that occur during the fetch request
    console.error('Error fetching data:', error);
  }
}

// Get the HTML element where the flag will be displayed
const flagContainer = document.getElementById('Flag');

// Function to fetch and display the flag of the selected random country
async function fetchAndDisplayFlag() {
  try {
    // Get a random country name
    const countryName = await getRandomCountry();
    console.log('Random country:', countryName);

    // Fetch specific data for the selected country based on the name
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
    const data = await response.json();

    // Check if the response contains flag data, then display the flag
    if (data && data.length > 0 && data[0].flags && data[0].flags.svg) {
      const flagUrl = data[0].flags.svg;

      // Create an img element to display the flag
      const flagImg = document.createElement('img');
      flagImg.src = flagUrl;
      flagImg.classList.add('flag-img'); // Optional styling class

      // Clear any existing flag and append the new one to the container
      flagContainer.innerHTML = '';
      flagContainer.appendChild(flagImg);
    } else {
      // If flag information is not available, display a message
      console.log('Flag information not found');
      flagContainer.innerHTML = 'Flag not available';
    }

  } catch (error) {
    // Log any errors that occur and display an error message
    console.error('Error:', error);
    flagContainer.innerHTML = 'Failed to fetch flag';
  }
  result.innerHTML = ''; // Clear previous result
}

// Function to fetch details for a country entered by the user and display it
function searchCountry() {
  let countryName = countryInp.value;
  let finalURL = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
  console.log(finalURL);

  // Fetch details for the user-entered country and display them
  fetch(finalURL)
    .then((response) => response.json())
    .then((data) => {
      result.innerHTML = `
        <div class="wrapper">
          <div class="data-wrapper">
            <h4>Capital:</h4>
            <span>${data[0].capital[0]}</span>
          </div>
        </div>
        <div class="wrapper">
          <div class="data-wrapper">
            <h4>Continent:</h4>
            <span>${data[0].continents[0]}</span>
          </div>
        </div>
        <div class="wrapper">
          <div class="data-wrapper">
            <h4>Population:</h4>
            <span>${data[0].population}</span>
          </div>
        </div>
        <div class="wrapper">
          <div class="data-wrapper">
            <h4>Currency:</h4>
            <span>${data[0].currencies[Object.keys(data[0].currencies)].name} - ${Object.keys(data[0].currencies)[0]}</span>
          </div>
        </div>
        <div class="wrapper">
          <div class="data-wrapper">
            <h4>Common Languages:</h4>
            <span>${Object.values(data[0].languages).toString().split(",").join(", ")}</span>
          </div>
        </div>
      `;
    })
    .catch(() => {
      // Error handling for invalid or empty input
      if (countryName.length == 0) {
        result.innerHTML = `<h3>The input field cannot be empty</h3>`;
      } else {
        result.innerHTML = `<h3>Please enter a valid country name.</h3>`;
      }
    });
}

// Function to update and display the current score
function currentPlayerScore(){
  document.getElementById("Score").innerHTML = '<h2>Score: ' + score + '</h2>';
}

// Function to display the correct answer if the player guesses wrong
function answer() {
  document.getElementById("correct-answer").innerHTML = `<h3>Correct answer is ${selectedCountry}</h3>`;
}

// Handler function when the search button is clicked
function searchButtonClickHandler() {
  // Compare the user's input with the selected random country's name
  if (countryInp.value.toLowerCase() === selectedCountry.toLowerCase()) {
    searchCountry();  // Display country details
    score += 1;       // Increase score for correct answer
    currentPlayerScore();
    roundsPlayed++;
    
    // Check if the game can continue or if maximum rounds are reached
    if (roundsPlayed < maxRounds) {
      setTimeout(() => {
        fetchAndDisplayFlag();  // Load the next flag
        countryInp.value = '';  // Clear input field
      }, 3000); // 3-second delay between rounds
    } else {
      FinalPlayerScore();  // Display final score
      searchBtn.disabled = true;  // Disable search button after game ends
    }
  } else {
    // Display incorrect answer message and the correct answer
    result.innerHTML = `<h3>Incorrect</h3>`;
    answer();
    roundsPlayed++;
    
    // Load the next flag after 3 seconds if rounds are remaining
    if (roundsPlayed < maxRounds) {
      setTimeout(() => {
        clearCorrectAnswer();
        fetchAndDisplayFlag();
        countryInp.value = '';
      }, 3000);
    } else {
      FinalPlayerScore();  // Display final score if max rounds reached
      searchBtn.disabled = true;
    }
  }
}

// Function to clear the displayed correct answer
function clearCorrectAnswer() {
  document.getElementById("correct-answer").innerHTML = '';  // Clear correct-answer element
}

// Function to display the final score at the end of the game
function FinalPlayerScore() {
  var finalScoreElement = document.getElementById("Final-Score");
  finalScoreElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";  // Style the final score display
  finalScoreElement.innerHTML = `
    <h1>Game Over</h1>
    <h2>Your Final Score is</h2>
    <h2>Score: ${score}/${maxRounds}</h2>`;
}

// Fetch and display the first random flag when the page loads
fetchAndDisplayFlag();

// Attach event listener to the search button
let searchBtn = document.getElementById("search-btn");
let countryInp = document.getElementById("country-inp");
searchBtn.addEventListener("click", searchButtonClickHandler);
