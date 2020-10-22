const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imageContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// Nasa Api
const count = 10;
const apiKey = 'DEMO_KEY';
const apiurl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${apiKey}&page=1&per_page=${count}`;
// https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}

let resultsArray = [];
let favorites = {}; // we are using this so we can delete item eaisly using key
 

function showContent(page){
    window.scrollTo({top : 0 , behavior : 'instant'});
    if(page === 'result'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }else{
        favoritesNav.classList.remove('hidden');
        resultsNav.classList.add('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page){
    const currentArray = page === 'result'? resultsArray.latest_photos: Object.values(favorites);
// console.log('currentArray' , page , currentArray);

currentArray.forEach((result) => {
    // card Container 
    const card = document.createElement('div');
    card.classList.add('card');
    // link 
    const link = document.createElement('a');
    link.href = result.img_src;
    link.title = 'View Full image';
    link.target = '_blank';
    // image
    const image = document.createElement('img');
    image.src = result.img_src;
    image.alt = 'Nasa picture of Mars';
    image.loading = 'lazy';
    image.classList.add('card-img-top');
    // card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // card title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.full_name;
    // Save Text
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if(page === 'result'){
        saveText.textContent = 'Add to Favorites';
        saveText.setAttribute('onClick',`saveFavorite('${result.img_src}')`);
    }else{
        saveText.textContent = 'Remove Favorites';
        saveText.setAttribute('onClick',`removeFavorite('${result.img_src}')`);
        
    }

    // card Text
    const cardText = document.createElement('p');
    cardText.textContent = `The camera name is ${result.camera.full_name} ,
The rover name is ${result.rover.name} ,
Rover's landing date is : ${result.rover.landing_date}
    
    `;
    // Footer Container
    const footer = document.createElement('small');
    footer.classList.add('text-muted');

    // Date
    const date = document.createElement('strong');
    date.textContent = ` The earth date is : ${result.earth_date} , `;

    // copyright
    const copyright = document.createElement('strong');
    copyright.textContent = ` Camera Used :  ${result.camera.name}  `;

    // Append
    footer.append(date , copyright);
    cardBody.append(cardTitle,saveText,cardText, footer);
    link.appendChild(image);
    card.append(link,cardBody);
    imageContainer.appendChild(card);

    });
}


function updateDom(page){
// get favourites from localstorage
if(localStorage.getItem('nasaFavorites')){
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    console.log('favorites from local',favorites);
}
imageContainer.textContent = '';
createDOMNodes(page);
showContent(page);
}


// Get 10 images from Nasa api

async function getNasaPictures(){
try{
    loader.classList.remove('hidden');
    const response = await fetch(apiurl);
    resultsArray = await response.json();
    console.log(resultsArray);
    updateDom('result');
}catch(error){
    console.log(error);
}
}

// Add result to Favorites

function saveFavorite(itemUrl){
// Loop through Results Array to select favorite
resultsArray.latest_photos.forEach((item) => {
    if(item.img_src.includes(itemUrl) && !favorites[itemUrl]){
        favorites[itemUrl] = item; // the key is itemurl and the value is item
        // show save confirmation for 2 seconds
        saveConfirmed.hidden = false;
        setTimeout(() => {
            saveConfirmed.hidden = true;
        }, 2000);
        // set Favorites in local storage
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
    }
})
}

// reomove item from favorites
function removeFavorite(itemUrl){
if(favorites[itemUrl]){
    delete favorites[itemUrl];
    localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
    updateDom('favorites');
}
}


// On load
getNasaPictures();