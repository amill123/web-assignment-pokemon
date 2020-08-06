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
        let responseObject = await fetch(`https://trex-sandwich.com/pokesignment/pokemon?pokemon=${randomPokemonName.name}`);
        let pokeJsonResponse = await responseObject.json();
        pokemon = await pokeJsonResponse;
        console.log(pokemon.image);
        console.log(pokemon.name);
        await applyPokemonOfTheDay();
    }

    async function getRandomPokemon() {
        let responseObject = await fetch(`https://trex-sandwich.com/pokesignment/pokemon?random=random`);
        let randomPokemon;
        if (responseObject.ok) {
            let responseJson = await responseObject.json();
            randomPokemon = responseJson;
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
        pokeImage.src = `https://trex-sandwich.com/pokesignment/img/${pokemon.image}`;
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
    })
});



//Have used recursion in getRandomPokemon function. Fix later. This currently works, but is probably bad practice.