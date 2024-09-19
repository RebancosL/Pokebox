//npm install typescript
//npm install @types/node
//npm install base64-js

const express = require('express');
const app = express();

interface Pokemon {
  id: number;
  name: string;
  image: string;
  moves: string[];
  sound: string;
}

let box: Pokemon[] = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => console.log('Listening on port 3000.'));

app.get('/', (req, res) => {
  res.send(`
    <h1>Pokémon API</h1>
    <ul>
      <li><a href="/store">Store</a></li>
      <li><a href="/box">Box</a></li>
      <li><a href="/viewPokemon">View Pokémon</a></li>
    </ul>
  `);
});

//html output to input pokemon choice
app.get('/store', (req, res) => {
  res.send(`
    <h1>Store Pokémon</h1>
    <form method="get" action="/store/pokemon">
      <input type="text" name="pokemonName" placeholder="Enter Pokémon name">
      <button type="submit">Store</button>
    </form>
  `);
});

//limit requirement 
app.get('/store/pokemon', async (req, res) => {
  if (box.length >= 1000) {
    res.status(400).send('Error: Box is full. Cannot store more Pokémon.');
    return;
  }

  const { pokemonName } = req.query;
  try {// store image and convert to base64 
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const pokemonData = await response.json();
    const pokemonImageResponse = await fetch(pokemonData.sprites.front_default);
    const imageData = await pokemonImageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageData).toString('base64');
    //store sound data pokeapi -> base 64 -> wav 
    const soundResponse = await fetch(pokemonData.cries.latest);
    const soundData = await soundResponse.arrayBuffer();
    const soundBase64 = Buffer.from(soundData).toString('base64');
    const pokemon: Pokemon = {
      id: pokemonData.id,
      name: pokemonData.name,
      image: imageBase64,
      moves: [],
      sound: `data:audio/wav;base64,${soundBase64}`,
    };
    for (let i = 0; i < pokemonData.moves.length; i++) {
      pokemon.moves.push(pokemonData.moves[i].move.name);
    }
//lalagay sa box 
    box.push(pokemon);
    res.json(pokemon);
  } catch (error) {
    res.status(400).send(`Error storing pokemon: ${error.message}`);
  }
});

app.get('/box', (req, res) => {
  res.json(box);
});

app.get('/viewPokemon', (req, res) => { // html output on localhost:3000/viewPokemon
  res.send(`
    <h1>View Pokémon</h1>
    <form method="get" action="/viewPokemon/result">
      <input type="text" name="pokemonName" placeholder="Enter Pokémon name">
      <button type="submit">View</button>
    </form>
  `);
});

app.get('/viewPokemon/result', (req, res) => {
  const { pokemonName } = req.query;
  const foundPokemon = box.find((pkmn) => pkmn.name === pokemonName);//type bool
  console.log(foundPokemon)
  if (!foundPokemon) {
    res.status(400).send(`Error: Pokémon not found in box`);
  } else { // Html output to show pokemon 
    res.send(` 
      <h1>View Pokémon</h1>
      <p>Name: ${foundPokemon.name}</p>
      <p>Image: <img src="data:image/png;base64,${foundPokemon.image}" /></p>
      <p>Base64 Image: ${foundPokemon.image}</p>
      <p>Moves: ${foundPokemon.moves.join(', ')}</p>
      <p>Sound: ${foundPokemon.name}.wav</p>
      <p><audio controls>
        <source src="${foundPokemon.sound}" type="audio/wav">
        Your browser does not support the audio element.
      </audio></p>
    `);
  }
});

