const getData = async () => {

    const dittoAko = await fetch ("https://pokeapi.co/api/v2/pokemon/ditto");
    const dittoSotto = await dittoAko.json();

    console.log(dittoSotto)
    console.log(dittoAko, dittoJson)
}
getData(); 

console.log("Hello")
pokemonName : string = "brownie"
const foundPokemon = box.find((pkmn) => pkmn.name === pokemonName);//type bool
console.log(pokemonName)
console.log(foundPokemon)