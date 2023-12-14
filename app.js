const pokemonNameDiv = document.querySelector(".pokemon__name");
const pokemonTypeWrapperDiv = document.querySelector(".pokemon__type--wrapper");
const pokemonImgDiv = document.querySelector(".pokemon__img--wrapper");
const pokemonImage = document.querySelector(".pokemon__img");
const pokemonIDDiv = document.querySelector(".pokemon__id");
const statsWrapper = document.querySelector(".stats__wrapper");

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
  // Using a regular expression to match the end id
  const match = url.match(/\/pokemon\/(\d+)\/$/);

  // Check if there is a match and return the captured group (end id)
  return match ? match[1] : null;
}

async function getPokemonList() {
  const apiURL = `https://pokeapi.co/api/v2/pokemon/?limit=20`;

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log("API Data:", data);
    renderPokemonList(data);
  } catch (error) {
    console.error("Fetch Error:", error);
    console.log("ERROR");
  }
}

getPokemonList();

function renderPokemonList(data) {
  data.results.map((item) => {
    const pokemonId = extractPokemonId(item.url);
    getPokemon(pokemonId);
  });
}

// Keep track of the last created wrapper
let lastPokemonWrapper;

function renderPokemon(data) {
  const pokemonName = data.name;
  const pokemonImg = data.sprites.front_default;
  const pokemonID = data.id;

  const pokemonWrapper = document.createElement("div");
  pokemonWrapper.classList.add("pokemon--wrapper", "pixel-corners--wrapper");

  const typeNames = data.types.map((type) => type.type.name);
  let typeVar = "";
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

  for (let i = 0; i < typeNames.length; i++) {
    if (typeStyleMap[typeNames[i]]) {
      typeVar = typeStyleMap[typeNames[i]];
    }

    pokemonTypeWrapperDiv.innerHTML += `<h1 class="type__style ${typeVar}">${typeNames[
      i
    ].toUpperCase()}</h1>`;
  }

  pokemonIDDiv.innerHTML = `<h1 class="pokemon__id">#${pokemonID}</h1>`;
  pokemonImgDiv.innerHTML = `<img class="pokemon__img pixel-corners" src="${pokemonImg}" />`;

  for (let i = 0; i < statsWrapper.children.length; i++) {
    statsWrapper.children[i].innerHTML = `${data.stats[i].base_stat} </div>`;
  }

  const typeElement = document.querySelector(".type__style");
  const computedStyle = window.getComputedStyle(typeElement);

  const secondStyleClass = typeElement.classList.item(1);
  if (pokemonImgDiv) {
    pokemonImgDiv.style.backgroundColor = computedStyle.backgroundColor;
  }
  if (pokemonImage) {
    pokemonImage.classList.add("show");
  }

  pokemonNameDiv.innerHTML = `<h1 class="pokemon__header">${
    pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
  }</h1>`;

  // Append the new pokemon wrapper after the last one
  if (lastPokemonWrapper) {
    document.body.insertBefore(pokemonWrapper, lastPokemonWrapper.nextSibling);
  } else {
    document.body.appendChild(pokemonWrapper);
  }

  // Update the last wrapper
  lastPokemonWrapper = pokemonWrapper.cloneNode(true);
}

function searchPokemon(event) {
  event.preventDefault();
  const userInput = event.target[0].value.toLowerCase();
  console.log(event);

  console.log(userInput);

  getPokemon(userInput);
}
