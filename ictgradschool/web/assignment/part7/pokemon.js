/* Base address for the Pokemon endpoints. Add the endpoint name and parameters onto this */
const ENDPOINT_BASE_URL = "https://trex-sandwich.com/pokesignment/";


/* TODO: Your code here */
window.addEventListener("load", function() {

    //Creates functionality to the hamburger button when clicked
    const hamburger = document.querySelector('.hamburger');
    hamburger.addEventListener('click', function () {
        document.querySelectorAll('.nav_list').forEach(nav => nav.classList.toggle('navigation_list_onclick'));
    });


    //Have to have two different times for setting the pokemonOfDay and FeaturePokemon in case the user only interacts with one for a long period of time
    let setTimePokemonOfDay;
    let setTimeFeaturePokemon;
    let pokemon = null;
    //start to be set to true to begin with. Start gets reassigned to false when the user starts clicking on Pokemon or loading random pokemon.
    let start = true;


    //Checks to see if there are any saved pokemon for pokemon_of_the_day or if 24hours has passed since that pokemon was generated
    function anySavedPokemon(pokemon, time){
        if(localStorage.getItem(pokemon) === 'null'){
            return false;
        }
        let lastAccessPokemonOfDay = localStorage.getItem(time);
        let is24Passed = parseInt(lastAccessPokemonOfDay) + (24*3600);
        let currentTime = Math.round(new Date().getTime()/1000);
        if(currentTime>is24Passed) {
            return false;
        } else{
            return true;
        }
    }


    async function getPokemonOfTheDay() {
        let pokemonOfDay = "pokemonofday";
        let pokemonOfTimeElapse ="timePokemonOfDay";
        let savedPokemon = anySavedPokemon(pokemonOfDay, pokemonOfTimeElapse);
        let pokemonName;
        if (savedPokemon === false || start === false) {
            let randomPokemonName = await getRandomPokemon();
            pokemonName = randomPokemonName.name;
            setTimePokemonOfDay = Math.round(new Date().getTime() / 1000);
            localStorage.setItem(pokemonOfTimeElapse, setTimePokemonOfDay);
        } else {
            pokemonName = localStorage.getItem(pokemonOfDay);
        }

        pokemon = await getPokemon(pokemonName);

        if (savedPokemon === false || start === false) {
            localStorage.setItem(pokemonOfDay, pokemon.name);
        }

        let changePokemon = document.querySelector('#pokemon_of_the_day');
        changePokemon.innerHTML = ''
        await applyPokemonOfTheDay();

    }



    //This function creates the HTML structure for the pokemon of the day, generated in the getPokemonOfTheDay Method.
    async function applyPokemonOfTheDay(){

        let pokeOfDay = document.querySelector('#pokemon_of_the_day');
        let pokeImage = document.createElement('img');
        pokeImage.id = 'pokemon_of_day';
        pokeImage.src = `${ENDPOINT_BASE_URL}img/${pokemon.image}`;
        pokeImage.alt = "image loading too slow";
        let pokeName = document.createElement('h3');
        pokeName.innerHTML = `${pokemon.name}`;
        let pokeDescription = document.createElement('p');
        pokeDescription.innerText= `${pokemon.description}`;

        let list = document.createElement('ul');
        list.id ='show_details';
        let  pokemonDetails = document.createElement('li');

        pokemonDetails.id = pokemon.name;
        pokemonDetails.classList = 'menu_button';
        pokemonDetails.innerText = 'Show Details';
        list.appendChild(pokemonDetails);

        pokeOfDay.appendChild(pokeImage);
        pokeOfDay.appendChild(pokeName);
        pokeOfDay.appendChild(pokeDescription);
        pokeOfDay.appendChild(list);

        //This applies a handler for allowing the user to click on the Pokemon of the day image to load another pokemon as a pokemon of the day
        applyHandler();

        //This adds an event  listener to the show details button so that the Pokemon of the day is loaded as the feature image
        let value = document.querySelector('#show_details');
        value.addEventListener('click', (event)=> {
            let getId;
            getId = event.target.getAttribute('id');
            changeImage(getId);
        });
    }
    getPokemonOfTheDay();


    //This function applies an event handler to the getPokemonOfTheDay to load another random pokemon. Removing this from the function prevents PokemonDetails from loading. In here
    //we'll assign the start variable to false so that a new/different "Pokemon Of The Day" can be loaded.
     function applyHandler() {
        document.querySelector('#pokemon_of_day').addEventListener('click', async function () {
            start = false;
            await getPokemonOfTheDay();
        });
    }


    //Adds functionality to the Show List of Pokemon button in the menu and nav bar. It hides the feature pokemon and unhides the list of Pokemon - rather than having to reload.
    //We'll also set the LocalStorage featurePokemon to null as we don't have a featurePokemon when the list of pokemon is present
    document.querySelector('#show_all_pokemon').addEventListener('click', function(){
        hideFeaturePokemon();
        localStorage.setItem('featurePokemon', 'null');
    });
    document.querySelector('.nav_list').children[1].addEventListener('click', function(){
        hideFeaturePokemon();
        localStorage.setItem('featurePokemon', 'null');
    });


    //Add functionality to the load random pokemon button in the menu as well as the nav bar Load Random Pokemon button
    document.querySelector('#load_random_pokemon').addEventListener('click', async function () {
        let randomPokemon = await getRandomPokemon();
        await changeImage(randomPokemon.name);
    });
    document.querySelector('.nav_list').firstElementChild.addEventListener('click',async function () {
        let randomPokemon = await getRandomPokemon();
        await changeImage(randomPokemon.name);
    });


    //This function will create the main Pokemon List so that each Pokemon is searchable. It hides the #pokemon box (if visible) and makes the #pokemonSelect box visible
    async function fillPokemonListDetails(){

        hideFeaturePokemon();

        let pokemonContainer = document.querySelector('#pokemonSelect');
        let pokemonArray = await getPokemonArray();

        //For each pokemon at the API end point we'll create a div, add the image, the images id will be set to the Pokemons name, and the the Pokemon's name will be added as a heading
        for (let i = 0; i < pokemonArray.length; i++) {
            let pokemonDetails = await getPokemon(pokemonArray[i]);
            let pokemonBox = document.createElement('div');
            let pokemonImage = document.createElement('img');
            pokemonImage.src = `${ENDPOINT_BASE_URL}img/${pokemonDetails.image}`;

            //assign pokemon name as id to each image, so that the pokemon's name can be retrieved when it's clicked on to fill the Pokemon Details of the selected Pokemon
            pokemonImage.id = `${pokemonDetails.name}`;
            let pokemonName = document.createElement('h3');
            pokemonName.innerHTML = pokemonDetails.name;
            pokemonBox.appendChild(pokemonImage);
            pokemonBox.appendChild(pokemonName);
            pokemonContainer.appendChild(pokemonBox);
        }
    }


    //generateFeatureContent function will be called when the window is first loaded - it will check to see if there are any Pokemon saved as the feature Pokemon from the last 24hours.
    //If there is such a Pokemon, it will be loaded - otherwise the Pokemon List will be loaded
    function generateFeatureContent(){
        let featurePokemonSaved = "featurePokemon";
        let featurePokemonTimeElapse = "timeFeaturePokemon";
        let featurePokemon = anySavedPokemon(featurePokemonSaved, featurePokemonTimeElapse);
        fillPokemonListDetails();

        if(featurePokemon === true){
           changeImage(localStorage.getItem(featurePokemonSaved));
        }
    }
    generateFeatureContent();


    //Adds a click event to each Pokemon with a Pokemon name as an ID in the Pokemon List
    document.querySelector('#pokemonSelect').addEventListener('click', getImageId);
    //Adds a click event to each Pokemon with a Pokemon name as an ID -  Strong Against and Weak Against Pokemon. We don't want to reload the feature Pokemon as it's already loaded on screen.
    document.querySelector('#pokemon').addEventListener('click', getImageId);


    //Get's the selected image's ID and calls the changeImage Function to apply the changes
    function getImageId(){
        let getId;
        getId = event.target.getAttribute('id');

        //Prevents reloading if the feature image is reclicked, also prevents a blank screen being loaded when the outer container is accidentally pressed.
        if(getId === 'weak' || getId === 'strong' || getId === 'pokemon' || getId === 'pokemonSelect'){
            getId = null;
        }
        if(getId !== "pokemon" && getId !== "featured_image" && getId !== null) {
            changeImage(getId);
        }
    }


    //The changeImage function takes a pokemon's name as an input and then will make the appropriate changes to the #pokemon container so that the input Pokemon is loaded as the feature Pokemon.
    async function changeImage(pokemon){
        //Hides the Pokemon List
        hidePokemonSelect();

        let pokemonContainer = document.querySelector('#pokemon');

        setTimeFeaturePokemon = Math.round(new Date().getTime() / 1000);
        localStorage.setItem("timeFeaturePokemon", setTimeFeaturePokemon);
        localStorage.setItem("featurePokemon", pokemon);

        //Retrieve the pokemon's details
        let selectedPokemon = await getPokemon(pokemon);


        //Create weak against container
        let descriptor = selectedPokemon.opponents.weak_against;
        let word = "Weak";
        await pokemonComparisons(word, descriptor, pokemonContainer);


        //Central Featured Image
        let pokemonBox = document.createElement('div');
        pokemonBox.classList = "featureBox";
        let pokemonImage = document.createElement('img');
        pokemonImage.id = "featured_image";
        pokemonImage.src = `${ENDPOINT_BASE_URL}img/${selectedPokemon.image}`;

        //Generate selectedPokemon Name/heading
        let selectedPokemonName = document.createElement('h2');
        selectedPokemonName.innerHTML = `${selectedPokemon.name}`;

        //Generate selectedPokemon Description
        let selectedPokemonDescription = document.createElement('p');
        selectedPokemonDescription.innerHTML = `${selectedPokemon.description}`;


        //Create a div for Signature moves and Classes to be generated in
        let movesAndClass = document.createElement('div');
        movesAndClass.classList = 'movesAndClass';

        //Creates a Class set Div
        let classSet = document.createElement('div');
        classSet.classList = 'classList';

        //Create Heading for Class set Div and append
        let classHeading = document.createElement('h3');
        classHeading.innerText = 'Class List';
        classSet.appendChild(classHeading);

        //Create Class list
        let classList = document.createElement('ul');

        //Gets each class of the selected Pokemon and adds them as a list item to the list of classes, includes styling the list item as per the API end points
        // for the background colour and text colour
        for (let i = 0; i < selectedPokemon.classes.length; i++) {
            let listItem = document.createElement('li');
            let className = `${selectedPokemon.classes[i]}`;
            let listItemEndPoint = await getPokemonClassList(className);

            listItem.innerText = `${selectedPokemon.classes[i]}`;
            listItem.style.backgroundColor = `${listItemEndPoint.background}`;
            listItem.style.color = `${listItemEndPoint.foreground}`;

            classList.appendChild(listItem);
        }

        //Creates a Signature Moves div
        let moves = document.createElement('div');
        moves.classList = 'movesList';
        let movesHeading = document.createElement('h3');
        movesHeading.innerText = 'Signature Moves';
        moves.appendChild(movesHeading);
        let movesList = document.createElement('ul');

        for (let i = 0; i < selectedPokemon.signature_skills.length; i++) {
            let listItem = document.createElement('li');
            listItem.innerText = `${selectedPokemon.signature_skills[i]}`;
            movesList.appendChild(listItem);
        }

        //Append the class and moves to the container div
        classSet.appendChild(classList);
        movesAndClass.appendChild(classSet);
        moves.appendChild(movesList);
        movesAndClass.appendChild(moves);


//Append Name, Image and description of Selected pokemon to the generated pokemonBox as well as the Moves and Classes Lists.
        pokemonBox.appendChild(selectedPokemonName);
        pokemonBox.appendChild(pokemonImage);
        pokemonBox.appendChild(selectedPokemonDescription);
        pokemonBox.appendChild(movesAndClass);

        //Append the pokemonBox to the pokemonContainer
        pokemonContainer.appendChild(pokemonBox);
        pokemonBox.style.backgroundColor = 'lightcoral';

        //Create Strong Against Box
        descriptor = selectedPokemon.opponents.strong_against;
        word = "Strong";
        await pokemonComparisons(word, descriptor, pokemonContainer);
    }

//This creates the boxes for the Weak Against and Strong against Pokemon. It takes the describeWord(i.e. weak or strong), the list of Pokemon (descriptor), and the container to append to as input arguments.
    async function pokemonComparisons(describeWord, descriptor, pokemonContainer){

        //Create a Box for the descriptor pokemon to sit in
        let pokemonBox = document.createElement('div');
        pokemonBox.classList = "box";

        if(describeWord === "Strong"){
            pokemonBox.id = "strong";
        } else if(describeWord === "Weak"){
            pokemonBox.id = "weak";
        }

        //Create and Append Heading
        let heading = document.createElement('h3');
        heading.innerHTML = `${describeWord} Against`;
        pokemonBox.appendChild(heading);

        //Run through the Pokemon array that the feature Pokemon is strong or weak against
        for (let i = 0; i < descriptor.length; i++) {
            //Get the pokemon
            let comparatorPokemon = await getPokemon(descriptor[i]);
            let subBox = document.createElement('div');
            subBox.classList = "sub-box";

            //Create image tag, assign the pokemon's name as an id so that it is clickable in the future and assign image source
            let comparatorPokemonImage = document.createElement('img');
            comparatorPokemonImage.id = `${comparatorPokemon.name}`;
            comparatorPokemonImage.src = `${ENDPOINT_BASE_URL}img/${comparatorPokemon.image}`;

            //Create heading tag and assign it
            let comparatorPokemonName = document.createElement('h3');
            comparatorPokemonName.innerHTML = `${descriptor[i]}`;
            subBox.appendChild(comparatorPokemonImage);
            subBox.appendChild(comparatorPokemonName);
            pokemonBox.appendChild(subBox);
        }
        pokemonContainer.appendChild(pokemonBox);
    }


    function hidePokemonSelect(){
        //Hides the Pokemon List
        let clearContainer = document.querySelector('#pokemonSelect');
        clearContainer.style.visibility = 'hidden';
        clearContainer.style.height = '0px';

        //Reveals the Feature Pokemon Box
        let pokemonContainer = document.querySelector('#pokemon');
        pokemonContainer.innerHTML = '';
        pokemonContainer.style.height = 'auto';
        pokemonContainer.style.visibility = 'visible';
    }

    function hideFeaturePokemon() {
        //Hides the feature Pokemon
        document.querySelector('#pokemon').style.visibility = 'hidden';
        document.querySelector('#pokemon').style.height = '0';

        //Reveals the Pokemon List
        let pokemonContainer = document.querySelector('#pokemonSelect');
        pokemonContainer.style.visibility = 'visible';
        pokemonContainer.style.height = 'auto';

    }


    /*
    All the API EndPoints
     */

    //Returns a pokemon json object given a Pokemon name
    async function getPokemon(pokemonName){
        let response = await fetch(`${ENDPOINT_BASE_URL}pokemon?pokemon=${pokemonName}`);
        return await response.json();
    }


    //Returns a Classes styling properties
    async function getPokemonClassList(className){
        let response = await fetch(`${ENDPOINT_BASE_URL}keyword?keyword=${className}`);
        return await response.json();
    }

    //Returns a Pokemon array
    async function getPokemonArray() {
        let response = await fetch(`${ENDPOINT_BASE_URL}pokemon`);
        if(response.ok){
            return await response.json();
        }
    }

    //Returns a random Pokemon
    async function getRandomPokemon() {
        let responseObject = await fetch(`${ENDPOINT_BASE_URL}pokemon?random=random`);
        let randomPokemon;
        if (responseObject.ok) {
            randomPokemon = await responseObject.json();
        }
        if (pokemon !== null) {
            while(randomPokemon.name === pokemon.name){
                randomPokemon = await getRandomPokemon();
            }
        }
        return randomPokemon;
    }
});


