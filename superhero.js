const comicDetailsElement = document.querySelector("#comicDetails");

document.addEventListener("DOMContentLoaded", function () {
    const superheroData = JSON.parse(localStorage.getItem('superheroData'));

    if (superheroData) {
        const { id, path, extension, description, name, comicsAvailable, storiesAvailable, eventsAvailable, seriesAvailable } = superheroData;
        const superheroImage = document.querySelector("#imageDescription");
        const superheroDescription = document.querySelector("#characterDescription");
        const superheroComic = document.querySelector("#comic");
        const superheroSeries = document.querySelector("#series");
        const superheroStories = document.querySelector("#stories");
        const superheroEvents = document.querySelector("#event");
        const charName = document.querySelector(".charName");
        const charFooter = document.querySelector("#charFooter");

        charName.textContent = name;
        superheroImage.src = `${path}/portrait_uncanny.${extension}`;
        superheroDescription.textContent = description;
        superheroComic.textContent = comicsAvailable;
        superheroSeries.textContent = seriesAvailable;
        superheroStories.textContent = storiesAvailable;
        superheroEvents.textContent = eventsAvailable;

        // this will fetch the data based on the id of the character.
        // if the promise is ok, it will execute another promise after which we can extract the data.
        fetch(`https://gateway.marvel.com/v1/public/characters/${id}/comics?ts=1&format=comic&apikey=94f9dd363d5806b381e9fc6b89213040&hash=bee9a8c7c16ad77342458326dedbee9d`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const comicList = data.data.results;
                console.log(data.data.results)
                const footer = data.attributionText;
                charFooter.textContent = footer;
                const html = generateComicHTML(comicList, footer);
                comicDetailsElement.innerHTML = html;
            })
            .catch(error => {
                console.error('Error fetching comics:', error);
                comicDetailsElement.innerHTML = "<div>Error fetching comics</div>";
            });
    }
});


// this function will generate the html for the comics of each character that is selected.
// the page will contain the image, title etc. of the character.
// clicking on the comic image will take you to the official url of that particular comic in the marvel website.
function generateComicHTML(comics, footer) {
    let rowElement = "<div class='row'>";
    comics.forEach((comic, index) => {
        const { title, description, thumbnail, creators, characters, urls } = comic;
        const comicImage = `${thumbnail.path}/portrait_uncanny.${thumbnail.extension}`;
        let comicCreator = "";
        let comicCharacters = "";
        //fetching all the creators of the  comic.
        for(let a=0; a<creators.items.length; a++){
            comicCreator += creators.items[a].name;
            if (a < creators.items.length - 1) {
                comicCreator += ", "; 
            }
            // console.log(creators.items[a].name);
        }

        //fetching all the characters of the comic.
        for(let b=0; b<characters.items.length; b++){
            comicCharacters += characters.items[b].name;
            if (b < characters.items.length - 1) {
                comicCharacters += ", "; 
            }
          
        }

        //the comic url is the first url among the list of urls. 
        // below is the creation of the comic html part of the page.
        const comicURL = (urls[0].url);
        // <span class='ComicDescription'>${description}</span>
        rowElement += `<div class='col-3'>
                            <div>
                            <a href='${urls[0].url}' target="_blank">
                                <img class='ComicImage' src='${comicImage}' alt='${title}'/>
                               </a> 
                                <br>
                                <div class='ComicNameDiv'>
                                    <h3 class='ComicName'>${title}</h3>
                                    
                                    
                                    <h4 class="creatorName">
                                        <span class="label">Characters:</span>
                                        <span class="creators">${comicCharacters}</span>
                                    </h4>
                                    <h4 class="creatorName">
                                        <span class="label">Creators:</span>
                                        <span class="creators">${comicCreator}</span>
                                    </h4>
                                    <div class="Comicfooter">
                                        <hr>
                                        <span>${footer}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;

        if ((index + 1) % 3 === 0) {
            rowElement += "</div><div class='row'>";
        }
    });
    rowElement += "</div>";
    return rowElement;
}
