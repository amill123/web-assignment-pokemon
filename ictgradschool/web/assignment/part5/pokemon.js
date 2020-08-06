/* Base address for the Pokemon endpoints. Add the endpoint name and parameters onto this */
const ENDPOINT_BASE_URL = "https://trex-sandwich.com/pokesignment/";


/* TODO: Your code here */
window.addEventListener("load", function() {

    //event listener for if the user resizes - this is to make the weak and strong boxes wrap below the selected pokemon
    window.addEventListener('resize', function () {
        let pokemonContainer = document.querySelector('#pokemon');
        if (window.innerWidth > 900) {
            pokemonContainer.style.flexWrap = 'nowrap';
        } else {
            pokemonContainer.style.flexWrap = 'wrap';
        }
    });

    const hamburger = document.querySelector('.hamburger');
    hamburger.addEventListener('click', function () {
        document.querySelectorAll('.nav_list').forEach(nav => nav.classList.toggle('navigation_list_onclick'));
    });


    //Pokemon of The day
    let pokemon = null;

    async function getPokemonOfTheDay() {
        let randomPokemonName = await getRandomPokemon();
        let responseObject = await fetch(`${ENDPOINT_BASE_URL}pokemon?pokemon=${randomPokemonName.name}`);
        let pokeJsonResponse = await responseObject.json();
        pokemon = await pokeJsonResponse;
        let changePokemon = document.querySelector('#pokemon_of_the_day');
        changePokemon.innerHTML = ''
        await applyPokemonOfTheDay();

    }




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
        applyHandler();
        // await showDetails();
        // console.log(document.querySelector('#show_details').children[0].id);
        let value = document.querySelector('#show_details');
        value.addEventListener('click', (event)=> {
            let getId;
            getId = event.target.getAttribute('id');
            changeImage(getId);
        });
    }
    getPokemonOfTheDay();



     function applyHandler() {
        document.querySelector('#pokemon_of_day').addEventListener('click', function () {
            let changePokeOfDay = document.querySelector('.col3');
            // changePokeOfDay.innerHTML = '';

            getPokemonOfTheDay();
        })
    }
    // async function showDetails() {
    //     document.querySelector('#show_details').addEventListener('click', await changeImage(document.querySelector('#show_details').children[0].id));
    // }

    //add functionality to the Show List of Pokemon button in the menu
    document.querySelector('#show_all_pokemon').addEventListener('click', function(){
        document.querySelector('#pokemon').style.visibility = 'hidden';

        let pokemonContainer = document.querySelector('#pokemonSelect');
        pokemonContainer.style.visibility = 'visible';
        pokemonContainer.style.height = 'auto';
        document.querySelector('#pokemon').style.height = '0';
    });

     document.querySelector('.nav_list').children[1].addEventListener('click', function(){
         document.querySelector('#pokemon').style.visibility = 'hidden';

         let pokemonContainer = document.querySelector('#pokemonSelect');
         pokemonContainer.style.visibility = 'visible';
         pokemonContainer.style.height = 'auto';
         document.querySelector('#pokemon').style.height = '0';
     });


//Add functionality to the load random pokemon button in the menu
document.querySelector('#load_random_pokemon').addEventListener('click', async function () {
  let randomPokemon = await getRandomPokemon();
  changeImage(randomPokemon.name);

});

document.querySelector('.nav_list').firstElementChild.addEventListener('click',async function () {
    let randomPokemon = await getRandomPokemon();
    changeImage(randomPokemon.name);
});

    async function fillPokemonDetails(){
        document.querySelector('#pokemon').style.visibility = 'hidden';
        let pokemonContainer = document.querySelector('#pokemonSelect');
        pokemonContainer.style.visibility = 'visible';
        // pokemonContainer.style.height = 'auto';
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
    document.querySelector('#pokemonSelect').addEventListener('click', (event)=>{
        // let clicked = event.target.src.toString();   Maybe need to delete this line if unrequired
        let getId;
            getId = event.target.getAttribute('id');


        //Prevents reloading if the feature image is reclicked
        if(getId === 'weak' || getId === 'strong' || getId === 'pokemon'){
            getId = null;
        }
        if(getId !== "pokemon" && getId !== "featured_image" && getId !== null) {
            console.log(getId);
            changeImage(getId);
        }
    });
    //Adds a click event to
    document.querySelector('#pokemon').addEventListener('click', (event)=>{
        // let clicked = event.target.src.toString();   Maybe need to delete this line if unrequired
        let getId;
        getId = event.target.getAttribute('id');


        //Prevents reloading if the feature image is reclicked
        if(getId === 'weak' || getId === 'strong' || getId === 'pokemon'){
            getId = null;
        }
        if(getId !== "pokemon" && getId !== "featured_image" && getId !== null) {
            console.log(getId);
            changeImage(getId);
        }
    });

    async function changeImage(pokemon){
        console.log(pokemon);
        //Clear away what's already in the pokemonContainer
        let clearContainer = document.querySelector('#pokemonSelect');
        clearContainer.style.visibility = 'hidden';
        clearContainer.style.height = '0px';
        let pokemonContainer = document.querySelector('#pokemon');

        pokemonContainer.innerHTML = '';
        pokemonContainer.style.height = 'auto';
        pokemonContainer.style.visibility = 'visible';
        // pokemonContainer.style.flexWrap = 'nowrap';



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


        //Create Skill set Box
        let movesAndClass = document.createElement('div');
        movesAndClass.classList = 'movesAndClass';
        let moves = document.createElement('div');


        let classSet = document.createElement('div');
        classSet.classList = 'classList';
        let classHeading = document.createElement('h3');
        classHeading.innerText = 'Class List';
        classSet.appendChild(classHeading);
        let classList = document.createElement('ul');

        for (let i = 0; i < selectedPokemon.classes.length; i++) {
            let listItem = document.createElement('li');
            let className = `${selectedPokemon.classes[i]}`;
            let listItemEndPoint = await getPokemonClassList(className);

            listItem.innerText = `${selectedPokemon.classes[i]}`;
            listItem.style.backgroundColor = `${listItemEndPoint.background}`;
            listItem.style.color = `${listItemEndPoint.foreground}`;

            classList.appendChild(listItem);
        }

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

        classSet.appendChild(classList);
        movesAndClass.appendChild(classSet);
        moves.appendChild(movesList);
        movesAndClass.appendChild(moves);



            //Append Name, Image and description of Selected pokemon to the generated pokemonBox.
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

    async function getPokemonClassList(className){
        let response = await fetch(`${ENDPOINT_BASE_URL}keyword?keyword=${className}`);
        return await response.json();
    }

    //Returns a Pokemon array as a json object
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



//Have used recursion in getRandomPokemon function. Fix later. This currently works, but is probably bad practice.