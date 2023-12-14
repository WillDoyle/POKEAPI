const pokemonNameDiv = document.querySelector(".pokemon__name");
const pokemonTypeWrapperDiv = document.querySelector(".pokemon__type--wrapper");
const pokemonImgDiv = document.querySelector(".pokemon__img--wrapper");
const pokemonImage = document.querySelector(".pokemon__img");
const pokemonIDDiv = document.querySelector(".pokemon__id");
const statsWrapper = document.querySelector(".stats__wrapper");

let results;

const pokedexContainer = document.getElementById("pokedex");

const typeStyleMap = {
  grass: "grass__style",
  fire: "fire__style",
  water: "water__style",
  bug: "bug__style",
  dark: "dark__style",
  dragon: "dragon__style",
  electric: "electric__style",
  fairy: "fairy__style",
  fighting: "fighting__style",
  flying: "flying__style",
  ghost: "ghost__style",
  ground: "ground__style",
  ice: "ice__style",
  normal: "normal__style",
  poison: "poison__style",
  psychic: "psychic__style",
  rock: "rock__style",
  steel: "steel__style",
};

async function getPokemon(pokemonIdentifier) {
  const apiURL = `https://pokeapi.co/api/v2/pokemon/${pokemonIdentifier}/`;

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log("API Data:", data);
    renderPokemon(data);
  } catch (error) {
    console.error("Fetch Error:", error);
    console.log("ERROR");
  }
}

function extractPokemonId(url) {
  // Check if url is defined
  if (url) {
    // console.log("URL:", url);

    // Using a regular expression to match the end id
    const match = url.match(/\/pokemon\/(\d+)\/$/);

    // Check if there is a match and return the captured group (end id)
    return match ? match[1] : null;
  } else {
    console.log("URL is undefined or null");
    return null;
  }
}

async function getPokemonList() {
  const apiURL = `https://pokeapi.co/api/v2/pokemon/?limit=20`;

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    results = data.results;
    return data.results;
  } catch (error) {
    console.error("Fetch Error:", error);
    console.log("ERROR");
  }
}

function renderPokemonList(pokemonList) {
  pokemonList.forEach(async (pokemon) => {
    const pokemonId = extractPokemonId(pokemon.url);
    const pokemonData = await getPokemonData(pokemonId);
    renderPokemon(pokemonData);
  });
}

async function getPokemonData(pokemonId) {
  const apiURL = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // console.log("API Data:", data);
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    console.log("ERROR");
  }
}

async function renderPokemonList(pokemonList) {
  for (const pokemon of pokemonList) {
    const pokemonId = extractPokemonId(pokemon.url);
    const pokemonData = await getPokemonData(pokemonId); // Wait for the promise to be fulfilled
    renderPokemon(pokemonData);
  }
}

function renderPokemon(data) {
  const pokemonWrapper = document.createElement("div");
  pokemonWrapper.classList.add("pokemon__wrapper");

  // Pokemon Name
  const pokemonName = data.name;
  const pokemonNameCapital =
    pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  const pokemonNameDiv = document.createElement("div");
  pokemonNameDiv.classList.add("pokemon__name");
  pokemonNameDiv.innerHTML = `<h1 class="pokemon__header">${pokemonNameCapital}</h1>`;
  pokemonWrapper.appendChild(pokemonNameDiv);

  // Pokemon Img
  const pokemonImg = data.sprites.front_default;
  const pokemonImgDiv = document.createElement("div");
  pokemonImgDiv.classList.add(
    "pokemon__img--wrapper",
    "pixel-corners--wrapper"
  );
  pokemonImgDiv.innerHTML = `<img class="pokemon__img pixel-corners" src="${pokemonImg}" />`;
  pokemonWrapper.appendChild(pokemonImgDiv);

  // Pokemon ID
  const pokemonID = data.id;
  const pokemonIDDiv = document.createElement("div");
  pokemonIDDiv.classList.add("pokemon__id");
  pokemonIDDiv.innerHTML = `<h1 class="pokemon__id">#${pokemonID}</h1>`;
  pokemonWrapper.appendChild(pokemonIDDiv);

  // Pokemon Types
  const pokemonTypeWrapperDiv = document.createElement("div");
  pokemonTypeWrapperDiv.classList.add("pokemon__type--wrapper");
  const typeNames = data.types.map((type) => type.type.name);
  typeNames.forEach((typeName) => {
    const typeVar = typeStyleMap[typeName] || ""; // Use typeStyleMap from your existing code
    pokemonTypeWrapperDiv.innerHTML += `<h1 class="type__style ${typeVar}">${typeName.toUpperCase()}</h1>`;
  });
  pokemonWrapper.appendChild(pokemonTypeWrapperDiv);

  // // Stats
  // const statsWrapper = document.createElement("div");
  // statsWrapper.classList.add("stats__wrapper");
  // const statLabels = ["HP", "ATK", "DEF", "SpA", "SpD", "SPD"];
  // for (let i = 0; i < statLabels.length; i++) {
  //   const statDiv = document.createElement("div");
  //   statDiv.classList.add(`stats__item`, statLabels[i].toLowerCase());
  //   statDiv.setAttribute("data-stat", statLabels[i]);
  //   statDiv.innerHTML = `${data.stats[i].base_stat}`;
  //   statsWrapper.appendChild(statDiv);
  // }
  // pokemonWrapper.appendChild(statsWrapper);

  // Append the new pokemonWrapper to the pokedexContainer
  pokedexContainer.appendChild(pokemonWrapper);
}

function removeAllPokemon() {
  const pokemonWrappers = document.querySelectorAll(".pokemon__wrapper");

  // Loop through each pokemonWrapper and remove it
  pokemonWrappers.forEach((pokemonWrapper) => {
    pokedexContainer.removeChild(pokemonWrapper);
  });
}

function sortPokemonAlphabetically(pokemonList) {
  // Create a shallow copy of the array before sorting
  const copy = [...pokemonList];

  return copy.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    return nameA.localeCompare(nameB);
  });
}

function sortPokemonBackwardsAlphabetically(results) {
  // Create a shallow copy of the array before sorting
  const copy = [...results];

  return copy.sort((b, a) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    return nameA.localeCompare(nameB);
  });
}

async function sortPokemonById(results, order) {
  // For each pokemon in the list, get its id, search for it using its id and return the result in a const
  const promises = results.map(async (pokemon) => {
    const pokemonId = extractPokemonId(pokemon.url);
    const pokemonData = await getPokemonData(pokemonId);

    return pokemonData;
  });

  //Wait for all pokemon to be added to the list

  const pokemonDataArray = await Promise.all(promises);

  // Sort the array based on "id"
  const sortedPokemonList = pokemonDataArray.sort((a, b) => {
    if (order === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  return sortedPokemonList;
}

async function filterPokemon(event) {
  removeAllPokemon();
  const sort = event.target.value;

  //Get pokemon list value

  if (sort === "A-Z") {
    const sortedPokemonList = sortPokemonAlphabetically(results);
    console.log(results);

    renderPokemonList(sortedPokemonList);
  } else if (sort === "Z-A") {
    const sortedPokemonList = sortPokemonBackwardsAlphabetically(results);
    console.log(results);

    renderPokemonList(sortedPokemonList);
  } else if (sort === "LOW_TO_HIGH") {
    // For each pokemon in the list (default is low to high id value order)
    console.log(results);

    for (const pokemon of results) {
      const pokemonId = extractPokemonId(pokemon.url);
      const pokemonData = await getPokemonData(pokemonId); // Wait for the promise to be fulfilled
      renderPokemon(pokemonData);
    }
  } else if (sort === "HIGH_TO_LOW") {
    //Call sort pokemon by id and await data from getPokemonList()
    const sortedPokemonList = await sortPokemonById(results, "desc");
    console.log(results);

    //For each pokemon in the sorted list (high to low), render the pokemon
    for (const pokemon of sortedPokemonList) {
      renderPokemon(pokemon);
    }
  }
}

function searchPokemon(event) {
  removeAllPokemon();
  event.preventDefault();
  const userInput = event.target[0].value.toLowerCase();
  console.log(event);

  console.log(userInput);

  getPokemon(userInput);
}

function renderPokemonListOnLoad() {
  getPokemonList()
    .then((pokemonList) => {
      renderPokemonList(pokemonList);
    })
    .catch((error) => {
      console.error("Error fetching initial Pokemon list:", error);
    });
}

document.addEventListener("DOMContentLoaded", renderPokemonListOnLoad);
