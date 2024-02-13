// Function to remove a character from favorites
function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((favorite) => favorite.id !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }


//   function to pass parameters to the superhero page.
  function passSuperheroData(id, name, path, extension, description, comicsAvailable, storiesAvailable, eventsAvailable, seriesAvailable) {
    console.log(name)
    localStorage.setItem('superheroData', JSON.stringify({id, name, path, extension, description, comicsAvailable, storiesAvailable, eventsAvailable, seriesAvailable }));
    window.location.href = "superhero.html"; // This will redirect to the superHero page once the image is clicked. 
  }
  

  // Function to render favorite characters.
  // This will fetch data from the local storage and create necessary elements in the favourites page including the image, title and the remove element button.
  function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoriteCharactersContainer = document.getElementById("favoriteCharacters");
    favoriteCharactersContainer.innerHTML = ""; // Clear the container

    favorites.forEach((favorite) => {
      const characterContainer = document.createElement("div");
      characterContainer.classList.add("favorite-character", "col-3");

      //creating the image element.
      const imageElement = document.createElement("img");
      imageElement.classList.add("characterImage", "favImg");
      imageElement.src = `${favorite.path}/portrait_uncanny.${favorite.extension}`; 

      //creating the title element.
      const nameElement = document.createElement("h2");
      nameElement.classList.add("characterName");
      nameElement.textContent = favorite.name;

      //creating a div that stores the title and the remove button
      const characterNameDiv = document.createElement("div");
      characterNameDiv.classList.add("characterNameDiv");
      
      characterNameDiv.appendChild(nameElement);

      
// event handler to pass data to the superhero data when the image is clicked.
      characterContainer.addEventListener("click", (event) => {
        if (event.target === imageElement) {
          passSuperheroData(favorite.id, favorite.name, favorite.path, favorite.extension, favorite.description, favorite.comicsAvailable, favorite.storiesAvailable, favorite.eventsAvailable, favorite.seriesAvailable);
        }
      });

      // creating the button to remove the selected favourite item from the list.
      const removeButton = document.createElement("button");
      removeButton.classList.add( "favBtn");
    const iconElement = document.createElement("i");
    iconElement.classList.add("fa-solid", "fa-minus");
      removeButton.appendChild(iconElement);
      removeButton.addEventListener("click", () => {
        removeFromFavorites(favorite.id);
      });

      //appending all the children elements to their respective parents.
      characterContainer.appendChild(removeButton);
      characterContainer.appendChild(imageElement);
      characterContainer.appendChild(characterNameDiv);
      characterContainer.appendChild(removeButton);
      favoriteCharactersContainer.appendChild(characterContainer);
    });
  }

  renderFavorites();