/* Base address for the Pokemon endpoints. Add the endpoint name and parameters onto this */
const ENDPOINT_BASE_URL = "https://trex-sandwich.com/pokesignment/";


/* TODO: Your code here */
window.addEventListener("load", function(){
 const hamburger  = document.querySelector('.hamburger');
     hamburger.addEventListener('click', function(){
    document.querySelectorAll('.nav_list').forEach(nav => nav.classList.toggle('navigation_list_onclick'));
     });


    //Pokemon of The day
    let pokemon = null;
    async function getPokemonOfTheDay() {
        let randomPokemonName = await getRandomPokemon();
        let responseObject = await fetch(`${ENDPOINT_BASE_URL}pokemon?pokemon=${randomPokemonName.name}`);
        let pokeJsonResponse = await responseObject.json();
        pokemon = await pokeJsonResponse;
        await applyPokemonOfTheDay();
    }

    async function getRandomPokemon() {
        let responseObject = await fetch(`https://trex-sandwich.com/pokesignment/pokemon?random=random`);
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

    async function applyPokemonOfTheDay(){

        let pokeOfDay = document.querySelector('.col3');
        let pokeImage = document.createElement('img');
        pokeImage.src = `${ENDPOINT_BASE_URL}img/${pokemon.image}`;
        pokeImage.alt = "image loading too slow";
        let pokeName = document.createElement('h3');
        pokeName.innerHTML = `${pokemon.name}`;
        let pokeDescription = document.createElement('p');
        pokeDescription.innerText= `${pokemon.description}`;

        pokeOfDay.appendChild(pokeImage);
        pokeOfDay.appendChild(pokeName);
        pokeOfDay.appendChild(pokeDescription);
    }
    getPokemonOfTheDay();

    document.querySelector('.col3').addEventListener('click', function () {
        let changePokeOfDay = document.querySelector('.col3');
        changePokeOfDay.innerHTML = '';

         let heading = document.createElement('h2');
         heading.innerText = ('Pokemon of the Day');
         changePokeOfDay.appendChild(heading);
        getPokemonOfTheDay();
    });



    //Returns a Pokemon array as a json object
    async function getPokemonArray() {
        let response = await fetch(`${ENDPOINT_BASE_URL}pokemon`);
        if(response.ok){
            return await response.json();
        }
    }



    async function fillPokemonDetails(){
        let pokemonContainer = document.querySelector('.list_of_pokemon');
        let pokemonArray = await getPokemonArray();


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
    fillPokemonDetails();

    //Adds a click event to
    document.querySelector('#pokemon').addEventListener('click', (event)=>{
        // let clicked = event.target.src.toString();   Maybe need to delete this line if unrequired
        let getId = event.target.getAttribute('id');

        //Prevents reloading if the feature image is reclicked
        if(getId !== "pokemon" && getId !== "featured_image" && getId !== null) {
            changeImage(getId);
        }
    });

    async function changeImage(pokemon){

        //Clear away what's already in the pokemonContainer
        let pokemonContainer = document.querySelector('.list_of_pokemon');
        pokemonContainer.innerHTML = "";
        pokemonContainer.style.flexWrap = 'nowrap';
        // pokemonContainer.style.display = 'none'; Might need this, might not

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

        //Append Name, Image and description of Selected pokemon to the generated pokemonBox.
        pokemonBox.appendChild(selectedPokemonName);
        pokemonBox.appendChild(pokemonImage);
        pokemonBox.appendChild(selectedPokemonDescription);

        //Append the pokemonBox to the pokemonContainer
        pokemonContainer.appendChild(pokemonBox);
        pokemonBox.style.backgroundColor = 'lightcoral';

        //Create Strong Against Box
        descriptor = selectedPokemon.opponents.strong_against;
        word = "Strong";
        await pokemonComparisons(word, descriptor, pokemonContainer);

    }


    async function pokemonComparisons(describeWord, descriptor, pokemonContainer){
        //Create a Box for the pokemon to sit in
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


    //Returns a pokemon json object given a Pokemon name
    async function getPokemon(pokemonName){
        let response = await fetch(`${ENDPOINT_BASE_URL}pokemon?pokemon=${pokemonName}`);
        return await response.json();
    }


});



//Have used recursion in getRandomPokemon function. Fix later. This currently works, but is probably bad practice.