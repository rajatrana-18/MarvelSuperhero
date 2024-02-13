//fetching all the elements that are required in the js from the html.
const footerElement = document.querySelector("#footer-text");
const superHeroList = document.querySelector(".superheroesList");
const searchInput = document.querySelector("#searchInput");
const favButton = document.querySelector(".characterFavourite");
const imageDescription = document.querySelector("#imageDescription");
const characterDescription = document.querySelector("#characterDescription");

// fetchData function accepts the url and after processing returns the data in the url.
function fetchData(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error fetching Marvel data:', error);
    });
}

// getNameAndImage function used to extract the name and image of the character.
function getNameAndImage(superHero) {
const {id, name, thumbnail, description, comics, stories, events, series} = superHero;        // thumbnail contains the path and extension of the image.
    // creating a row with col width = 3 
    var className = "characterName";
    var classNameDiv = "characterNameDiv"
    var classImage = "characterImage"
    var classFav = "characterFavourite"

    return `
        <div class='col-3'>  
        <a href="superhero.html" onclick="passSuperheroData('${id}', '${name}', '${thumbnail.path}', '${thumbnail.extension}', '${description}', '${comics.available}', '${stories.available}', '${events.available}', '${series.available}')">               
                <img class=${classImage} src='${thumbnail.path}/portrait_uncanny.${thumbnail.extension}'>
            </a>   
        <br>
        <div class=${classNameDiv}>
        <h3 class=${className} >${name}</h3>
        <button class=${classFav} data-id="${id}">
          <i class="fa-solid fa-plus"></i>
        </button>
        </div>
        </div>`;
}



function passSuperheroData(id, name, path, extension, description, comicsAvailable, storiesAvailable, eventsAvailable, seriesAvailable) {
  localStorage.setItem('superheroData', JSON.stringify({id, name, path, extension, description, comicsAvailable, storiesAvailable, eventsAvailable, seriesAvailable }));
  window.location.href = "superhero.html"; // Redirect to superhero page when the character image is clicked.
}


//addCharacterNameImage function is used to create an element and add that element to the html with the character name and image.
function addCharacterNameImage(characters) {
  let rowElement = "<div class='row'>";
  characters.forEach((character, index) => {
    rowElement += getNameAndImage(character);
    if ((index + 1) % 3 === 0) {
    rowElement += "</div><div class='row'>";              // creates a new row after every 3rd character
    }
  });
  rowElement += "</div>";
  superHeroList.innerHTML = rowElement;


  // this is used to add the character to the favourites page.
  const favButtons = document.querySelectorAll(".characterFavourite");
    favButtons.forEach(button => {
        button.addEventListener("click", () => {
          const characterId = button.getAttribute("data-id");
          const character = characters.find(char => char.id === parseInt(characterId));
          const characterImageSrc = character.thumbnail.path + "/portrait_uncanny." + character.thumbnail.extension;
          const characterName = character.name;
          addToFavorites(characterId, characterImageSrc, characterName, character.thumbnail.path, character.thumbnail.extension, character.description, character.comics.available, character.stories.available, character.events.available, character.series.available);

        });
    });

}

// This will add items to the local storage. This will create an array out of the object using JSON.stringify.
// If an item exists in the local storage, it will add the new item to the already existing list. If there is no item in the list, it will create an empty array first and then add items.
function addToFavorites(id, imageSrc, name, path, extension, description, comicsAvailable, storiesAvailable, eventsAvailable, seriesAvailable) {
  let favorites = localStorage.getItem("favorites") ? JSON.parse(localStorage.getItem("favorites")) : [];
  //check if the item already exists in the favourites page. If yes, it won't add it.
  if (favorites.some(favorite => favorite.id === id)) {
    alert("Character is already present in the favourites page.")
    return;
  }
  favorites.push({ id, imageSrc, name, path, extension, description, comicsAvailable, storiesAvailable, eventsAvailable, seriesAvailable });
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Character added successfully")
}


// fetchAndDisplayCharacters function is used to get the desired data from the json. We are interested in the results object of the json.
function fetchAndDisplayCharacters(url) {
  fetchData(url)
    .then(characterData => {
      addCharacterNameImage(characterData.data.results);
      console.log(characterData.data.results);
    footerElement.textContent = characterData.attributionText;    // Marvel copyright text in the footer.
    });
}

// this function is used to search a Marvel character based on the input given in the input tag.
function searchCharacter() {
  searchInput.addEventListener("keydown", event => {            
    if (event.keyCode === 13) {                         // keyCode 13 refers to the 'enter' key
      const searchText = searchInput.value;
      const url = `https://gateway.marvel.com/v1/public/characters?ts=1&nameStartsWith=${searchText}&apikey=94f9dd363d5806b381e9fc6b89213040&hash=bee9a8c7c16ad77342458326dedbee9d`;
      fetchAndDisplayCharacters(url);
    }
  });
}

// function call with the url.
fetchAndDisplayCharacters('https://gateway.marvel.com/v1/public/characters?ts=1&apikey=94f9dd363d5806b381e9fc6b89213040&hash=bee9a8c7c16ad77342458326dedbee9d');
searchCharacter();