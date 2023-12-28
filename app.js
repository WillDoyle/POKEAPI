const pokemonNameDiv = document.querySelector(".pokemon__name");
const pokemonTypeWrapperDiv = document.querySelector(".pokemon__type--wrapper");
const pokemonImgDiv = document.querySelector(".pokemon__img--wrapper");
const pokemonImage = document.querySelector(".pokemon__img");
const pokemonIDDiv = document.querySelector(".pokemon__id");
const statsWrapper = document.querySelector(".stats__wrapper");
const loadingSpinner = document.querySelector(".loading--spinner");
const selectedPokemon = document.querySelector(".selected__pokemon");

let errorWrapper;

let results;
let pokemonNames = [];

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
    removeAllPokemon();
    showError();
    console.log("ERROR");
  }
}

function showError() {
  pokedexContainer.innerHTML = `<div class="error__wrapper"> <img class="error__img" src="./assets/pokeball.svg"> <h1 class="error__h1"> Could not find any pokemon related to your search.</h1> <h2 class="error__h2"> Please enter proper pokemon name or change filter <h2> </div>`;
  errorWrapper = document.querySelector(".error__wrapper");
  errorWrapper.style.display = "flex";
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

//Gets list of 21 pokemon, called on page load
async function getPokemonList() {
  for (let i = 1; i < 22; i++) {
    pokemonNames.push(`https://pokeapi.co/api/v2/pokemon/${i}/`);
  }

  console.log(pokemonNames);
  try {
    const data = await Promise.all(
      pokemonNames.map((url) => fetch(url).then((response) => response.json()))
    );
    results = data;
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    console.log("ERROR");
  }
}

//Gets pokemon data for each individual pokemon
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
  pokemonList.forEach((pokemon) => {
    renderPokemon(pokemon);
  });
}

function renderPokemon(data) {
  if (errorWrapper && errorWrapper !== null) {
    errorWrapper.style.display = "none";
  }
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

  //Pokemon button
  const pokemonButton = document.createElement("button");
  pokemonButton.setAttribute("onClick", "pokemonClicked(event)");
  pokemonButton.classList.add("pokemon__button");
  pokemonWrapper.appendChild(pokemonButton);

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

  // // Pokemon Types
  // const pokemonTypeWrapperDiv = document.createElement("div");
  // pokemonTypeWrapperDiv.classList.add("pokemon__type--wrapper");
  // const typeNames = data.types.map((type) => type.type.name);
  // typeNames.forEach((typeName) => {
  //   const typeVar = typeStyleMap[typeName] || ""; // Use typeStyleMap from your existing code
  //   pokemonTypeWrapperDiv.innerHTML += `<h1 class="type__style ${typeVar}">${typeName.toUpperCase()}</h1>`;
  // });
  // pokemonWrapper.appendChild(pokemonTypeWrapperDiv);

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

function sortPokemonAlphabetically(results) {
  // Create a shallow copy of the array before sorting
  const copy = [...results];

  return copy.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    return nameA.localeCompare(nameB);
  });
}

function sortPokemonBackwardsAlphabetically(results) {
  // Create a shallow copy of the array before sorting

  // const copy = await Promise.all(results.map((item) => {
  //   fetch(``)
  // }));
  const copy = [...results];

  return copy.sort((b, a) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    return nameA.localeCompare(nameB);
  });
}

async function sortPokemonById(results, order) {
  console.log(results);
  // For each pokemon in the list, get its id, search for it using its id and return the result in a const  const promises = results.map(async (pokemon) => {
  const pokemonDataArray = await Promise.all(
    results.map((item) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${item.id}`).then((response) =>
        response.json()
      )
    )
  );

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

    const sortedPokemonList = await sortPokemonById(results, "asc");
    console.log(results);

    for (const pokemon of sortedPokemonList) {
      renderPokemon(pokemon);
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

var search_terms = [
  "Abomasnow",

  "Abra",

  "Absol",

  "Accelgor",

  "Aegislash",

  "Aerodactyl",

  "Aggron",

  "Aipom",

  "Alakazam",

  "Alcremie",

  "Alomomola",

  "Altaria",

  "Amaura",

  "Ambipom",

  "Amoonguss",

  "Ampharos",

  "Anorith",

  "Appletun",

  "Applin",

  "Araquanid",

  "Arbok",

  "Arcanine",

  "Arceus",

  "Archen",

  "Archeops",

  "Arctovish",

  "Arctozolt",

  "Ariados",

  "Armaldo",

  "Aromatisse",

  "Aron",

  "Arrokuda",

  "Articuno",

  "Audino",

  "Aurorus",

  "Avalugg",

  "Axew",

  "Azelf",

  "Azumarill",

  "Azurill",

  "Bagon",

  "Baltoy",

  "Banette",

  "Barbaracle",

  "Barboach",

  "Barraskewda",

  "Basculin",

  "Bastiodon",

  "Bayleef",

  "Beartic",

  "Beautifly",

  "Beedrill",

  "Beheeyem",

  "Beldum",

  "Bellossom",

  "Bellsprout",

  "Bergmite",

  "Bewear",

  "Bibarel",

  "Bidoof",

  "Binacle",

  "Bisharp",

  "Blacephalon",

  "Blastoise",

  "Blaziken",

  "Blipbug",

  "Blissey",

  "Blitzle",

  "Boldore",

  "Boltund",

  "Bonsly",

  "Bouffalant",

  "Bounsweet",

  "Braixen",

  "Braviary",

  "Breloom",

  "Brionne",

  "Bronzong",

  "Bronzor",

  "Bruxish",

  "Budew",

  "Buizel",

  "Bulbasaur",

  "Buneary",

  "Bunnelby",

  "Burmy",

  "Butterfree",

  "Buzzwole",

  "Cacnea",

  "Cacturne",

  "Calyrex",

  "Camerupt",

  "Carbink",

  "Carkol",

  "Carnivine",

  "Carracosta",

  "Carvanha",

  "Cascoon",

  "Castform",

  "Caterpie",

  "Celebi",

  "Celesteela",

  "Centiskorch",

  "Chandelure",

  "Chansey",

  "Charizard",

  "Charjabug",

  "Charmander",

  "Charmeleon",

  "Chatot",

  "Cherrim",

  "Cherubi",

  "Chesnaught",

  "Chespin",

  "Chewtle",

  "Chikorita",

  "Chimchar",

  "Chimecho",

  "Chinchou",

  "Chingling",

  "Cinccino",

  "Cinderace",

  "Clamperl",

  "Clauncher",

  "Clawitzer",

  "Claydol",

  "Clefable",

  "Clefairy",

  "Cleffa",

  "Clobbopus",

  "Cloyster",

  "Coalossal",

  "Cobalion",

  "Cofagrigus",

  "Combee",

  "Combusken",

  "Comfey",

  "Conkeldurr",

  "Copperajah",

  "Corphish",

  "Corsola",

  "Corviknight",

  "Corvisquire",

  "Cosmoem",

  "Cosmog",

  "Cottonee",

  "Crabominable",

  "Crabrawler",

  "Cradily",

  "Cramorant",

  "Cranidos",

  "Crawdaunt",

  "Cresselia",

  "Croagunk",

  "Crobat",

  "Croconaw",

  "Crustle",

  "Cryogonal",

  "Cubchoo",

  "Cubone",

  "Cufant",

  "Cursola",

  "Cutiefly",

  "Cyndaquil",

  "Darkrai",

  "Darmanitan",

  "Dartrix",

  "Darumaka",

  "Decidueye",

  "Dedenne",

  "Deerling",

  "Deino",

  "Delcatty",

  "Delibird",

  "Delphox",

  "Deoxys",

  "Dewgong",

  "Dewott",

  "Dewpider",

  "Dhelmise",

  "Dialga",

  "Diancie",

  "Diggersby",

  "Diglett",

  "Ditto",

  "Dodrio",

  "Doduo",

  "Donphan",

  "Dottler",

  "Doublade",

  "Dracovish",

  "Dracozolt",

  "Dragalge",

  "Dragapult",

  "Dragonair",

  "Dragonite",

  "Drakloak",

  "Drampa",

  "Drapion",

  "Dratini",

  "Drednaw",

  "Dreepy",

  "Drifblim",

  "Drifloon",

  "Drilbur",

  "Drizzile",

  "Drowzee",

  "Druddigon",

  "Dubwool",

  "Ducklett",

  "Dugtrio",

  "Dunsparce",

  "Duosion",

  "Duraludon",

  "Durant",

  "Dusclops",

  "Dusknoir",

  "Duskull",

  "Dustox",

  "Dwebble",

  "Eelektrik",

  "Eelektross",

  "Eevee",

  "Eiscue",

  "Ekans",

  "Eldegoss",

  "Electabuzz",

  "Electivire",

  "Electrike",

  "Electrode",

  "Elekid",

  "Elgyem",

  "Emboar",

  "Emolga",

  "Empoleon",

  "Entei",

  "Escavalier",

  "Espeon",

  "Espurr",

  "Eternatus",

  "Excadrill",

  "Exeggcute",

  "Exeggutor",

  "Exploud",

  "Falinks",

  "Farfetch'd",

  "Fearow",

  "Feebas",

  "Fennekin",

  "Feraligatr",

  "Ferroseed",

  "Ferrothorn",

  "Finneon",

  "Flaaffy",

  "Flabébé",

  "Flapple",

  "Flareon",

  "Fletchinder",

  "Fletchling",

  "Floatzel",

  "Floette",

  "Florges",

  "Flygon",

  "Fomantis",

  "Foongus",

  "Forretress",

  "Fraxure",

  "Frillish",

  "Froakie",

  "Frogadier",

  "Froslass",

  "Frosmoth",

  "Furfrou",

  "Furret",

  "Gabite",

  "Gallade",

  "Galvantula",

  "Garbodor",

  "Garchomp",

  "Gardevoir",

  "Gastly",

  "Gastrodon",

  "Genesect",

  "Gengar",

  "Geodude",

  "Gible",

  "Gigalith",

  "Girafarig",

  "Giratina",

  "Glaceon",

  "Glalie",

  "Glameow",

  "Glastrier",

  "Gligar",

  "Gliscor",

  "Gloom",

  "Gogoat",

  "Golbat",

  "Goldeen",

  "Golduck",

  "Golem",

  "Golett",

  "Golisopod",

  "Golurk",

  "Goodra",

  "Goomy",

  "Gorebyss",

  "Gossifleur",

  "Gothita",

  "Gothitelle",

  "Gothorita",

  "Gourgeist",

  "Granbull",

  "Grapploct",

  "Graveler",

  "Greedent",

  "Greninja",

  "Grimer",

  "Grimmsnarl",

  "Grookey",

  "Grotle",

  "Groudon",

  "Grovyle",

  "Growlithe",

  "Grubbin",

  "Grumpig",

  "Gulpin",

  "Gumshoos",

  "Gurdurr",

  "Guzzlord",

  "Gyarados",

  "Hakamo-o",

  "Happiny",

  "Hariyama",

  "Hatenna",

  "Hatterene",

  "Hattrem",

  "Haunter",

  "Hawlucha",

  "Haxorus",

  "Heatmor",

  "Heatran",

  "Heliolisk",

  "Helioptile",

  "Heracross",

  "Herdier",

  "Hippopotas",

  "Hippowdon",

  "Hitmonchan",

  "Hitmonlee",

  "Hitmontop",

  "Honchkrow",

  "Honedge",

  "Ho-Oh",

  "Hoopa",

  "Hoothoot",

  "Hoppip",

  "Horsea",

  "Houndoom",

  "Houndour",

  "Huntail",

  "Hydreigon",

  "Hypno",

  "Igglybuff",

  "Illumise",

  "Impidimp",

  "Incineroar",

  "Indeedee",

  "Infernape",

  "Inkay",

  "Inteleon",

  "Ivysaur",

  "Jangmo-o",

  "Jellicent",

  "Jigglypuff",

  "Jirachi",

  "Jolteon",

  "Joltik",

  "Jumpluff",

  "Jynx",

  "Kabuto",

  "Kabutops",

  "Kadabra",

  "Kakuna",

  "Kangaskhan",

  "Karrablast",

  "Kartana",

  "Kecleon",

  "Keldeo",

  "Kingdra",

  "Kingler",

  "Kirlia",

  "Klang",

  "Klefki",

  "Klink",

  "Klinklang",

  "Koffing",

  "Komala",

  "Kommo-o",

  "Krabby",

  "Kricketot",

  "Kricketune",

  "Krokorok",

  "Krookodile",

  "Kubfu",

  "Kyogre",

  "Kyurem",

  "Lairon",

  "Lampent",

  "Landorus",

  "Lanturn",

  "Lapras",

  "Larvesta",

  "Larvitar",

  "Latias",

  "Latios",

  "Leafeon",

  "Leavanny",

  "Ledian",

  "Ledyba",

  "Lickilicky",

  "Lickitung",

  "Liepard",

  "Lileep",

  "Lilligant",

  "Lillipup",

  "Linoone",

  "Litleo",

  "Litten",

  "Litwick",

  "Lombre",

  "Lopunny",

  "Lotad",

  "Loudred",

  "Lucario",

  "Ludicolo",

  "Lugia",

  "Lumineon",

  "Lunala",

  "Lunatone",

  "Lurantis",

  "Luvdisc",

  "Luxio",

  "Luxray",

  "Lycanroc",

  "Machamp",

  "Machoke",

  "Machop",

  "Magby",

  "Magcargo",

  "Magearna",

  "Magikarp",

  "Magmar",

  "Magmortar",

  "Magnemite",

  "Magneton",

  "Magnezone",

  "Makuhita",

  "Malamar",

  "Mamoswine",

  "Manaphy",

  "Mandibuzz",

  "Manectric",

  "Mankey",

  "Mantine",

  "Mantyke",

  "Maractus",

  "Mareanie",

  "Mareep",

  "Marill",

  "Marowak",

  "Marshadow",

  "Marshtomp",

  "Masquerain",

  "Mawile",

  "Medicham",

  "Meditite",

  "Meganium",

  "Melmetal",

  "Meloetta",

  "Meltan",

  "Meowstic",

  "Meowth",

  "Mesprit",

  "Metagross",

  "Metang",

  "Metapod",

  "Mew",

  "Mewtwo",

  "Mienfoo",

  "Mienshao",

  "Mightyena",

  "Milcery",

  "Milotic",

  "Miltank",

  "Mime Jr.",

  "Mimikyu",

  "Minccino",

  "Minior",

  "Minun",

  "Misdreavus",

  "Mismagius",

  "Moltres",

  "Monferno",

  "Morelull",

  "Morgrem",

  "Morpeko",

  "Mothim",

  "Mr. Mime",

  "Mr. Rime",

  "Mudbray",

  "Mudkip",

  "Mudsdale",

  "Muk",

  "Munchlax",

  "Munna",

  "Murkrow",

  "Musharna",

  "Naganadel",

  "Natu",

  "Necrozma",

  "Nickit",

  "Nidoking",

  "Nidoqueen",

  "Nidoran♀",

  "Nidoran♂",

  "Nidorina",

  "Nidorino",

  "Nihilego",

  "Nincada",

  "Ninetales",

  "Ninjask",

  "Noctowl",

  "Noibat",

  "Noivern",

  "Nosepass",

  "Numel",

  "Nuzleaf",

  "Obstagoon",

  "Octillery",

  "Oddish",

  "Omanyte",

  "Omastar",

  "Onix",

  "Oranguru",

  "Orbeetle",

  "Oricorio",

  "Oshawott",

  "Pachirisu",

  "Palkia",

  "Palossand",

  "Palpitoad",

  "Pancham",

  "Pangoro",

  "Panpour",

  "Pansage",

  "Pansear",

  "Paras",

  "Parasect",

  "Passimian",

  "Patrat",

  "Pawniard",

  "Pelipper",

  "Perrserker",

  "Persian",

  "Petilil",

  "Phanpy",

  "Phantump",

  "Pheromosa",

  "Phione",

  "Pichu",

  "Pidgeot",

  "Pidgeotto",

  "Pidgey",

  "Pidove",

  "Pignite",

  "Pikachu",

  "Pikipek",

  "Piloswine",

  "Pincurchin",

  "Pineco",

  "Pinsir",

  "Piplup",

  "Plusle",

  "Poipole",

  "Politoed",

  "Poliwag",

  "Poliwhirl",

  "Poliwrath",

  "Polteageist",

  "Ponyta",

  "Poochyena",

  "Popplio",

  "Porygon",

  "Porygon2",

  "Porygon-Z",

  "Primarina",

  "Primeape",

  "Prinplup",

  "Probopass",

  "Psyduck",

  "Pumpkaboo",

  "Pupitar",

  "Purrloin",

  "Purugly",

  "Pyroar",

  "Pyukumuku",

  "Quagsire",

  "Quilava",

  "Quilladin",

  "Qwilfish",

  "Raboot",

  "Raichu",

  "Raikou",

  "Ralts",

  "Rampardos",

  "Rapidash",

  "Raticate",

  "Rattata",

  "Rayquaza",

  "Regice",

  "Regidrago",

  "Regieleki",

  "Regigigas",

  "Regirock",

  "Registeel",

  "Relicanth",

  "Remoraid",

  "Reshiram",

  "Reuniclus",

  "Rhydon",

  "Rhyhorn",

  "Rhyperior",

  "Ribombee",

  "Rillaboom",

  "Riolu",

  "Rockruff",

  "Roggenrola",

  "Rolycoly",

  "Rookidee",

  "Roselia",

  "Roserade",

  "Rotom",

  "Rowlet",

  "Rufflet",

  "Runerigus",

  "Sableye",

  "Salamence",

  "Salandit",

  "Salazzle",

  "Samurott",

  "Sandaconda",

  "Sandile",

  "Sandshrew",

  "Sandslash",

  "Sandygast",

  "Sawk",

  "Sawsbuck",

  "Scatterbug",

  "Sceptile",

  "Scizor",

  "Scolipede",

  "Scorbunny",

  "Scrafty",

  "Scraggy",

  "Scyther",

  "Seadra",

  "Seaking",

  "Sealeo",

  "Seedot",

  "Seel",

  "Seismitoad",

  "Sentret",

  "Serperior",

  "Servine",

  "Seviper",

  "Sewaddle",

  "Sharpedo",

  "Shaymin",

  "Shedinja",

  "Shelgon",

  "Shellder",

  "Shellos",

  "Shelmet",

  "Shieldon",

  "Shiftry",

  "Shiinotic",

  "Shinx",

  "Shroomish",

  "Shuckle",

  "Shuppet",

  "Sigilyph",

  "Silcoon",

  "Silicobra",

  "Silvally",

  "Simipour",

  "Simisage",

  "Simisear",

  "Sinistea",

  "Sirfetch'd",

  "Sizzlipede",

  "Skarmory",

  "Skiddo",

  "Skiploom",

  "Skitty",

  "Skorupi",

  "Skrelp",

  "Skuntank",

  "Skwovet",

  "Slaking",

  "Slakoth",

  "Sliggoo",

  "Slowbro",

  "Slowking",

  "Slowpoke",

  "Slugma",

  "Slurpuff",

  "Smeargle",

  "Smoochum",

  "Sneasel",

  "Snivy",

  "Snom",

  "Snorlax",

  "Snorunt",

  "Snover",

  "Snubbull",

  "Sobble",

  "Solgaleo",

  "Solosis",

  "Solrock",

  "Spearow",

  "Spectrier",

  "Spewpa",

  "Spheal",

  "Spinarak",

  "Spinda",

  "Spiritomb",

  "Spoink",

  "Spritzee",

  "Squirtle",

  "Stakataka",

  "Stantler",

  "Staraptor",

  "Staravia",

  "Starly",

  "Starmie",

  "Staryu",

  "Steelix",

  "Steenee",

  "Stonjourner",

  "Stoutland",

  "Stufful",

  "Stunfisk",

  "Stunky",

  "Sudowoodo",

  "Suicune",

  "Sunflora",

  "Sunkern",

  "Surskit",

  "Swablu",

  "Swadloon",

  "Swalot",

  "Swampert",

  "Swanna",

  "Swellow",

  "Swinub",

  "Swirlix",

  "Swoobat",

  "Sylveon",

  "Taillow",

  "Talonflame",

  "Tangela",

  "Tangrowth",

  "Tapu Bulu",

  "Tapu Fini",

  "Tapu Koko",

  "Tapu Lele",

  "Tauros",

  "Teddiursa",

  "Tentacool",

  "Tentacruel",

  "Tepig",

  "Terrakion",

  "Thievul",

  "Throh",

  "Thundurus",

  "Thwackey",

  "Timburr",

  "Tirtouga",

  "Togedemaru",

  "Togekiss",

  "Togepi",

  "Togetic",

  "Torchic",

  "Torkoal",

  "Tornadus",

  "Torracat",

  "Torterra",

  "Totodile",

  "Toucannon",

  "Toxapex",

  "Toxel",

  "Toxicroak",

  "Toxtricity",

  "Tranquill",

  "Trapinch",

  "Treecko",

  "Trevenant",

  "Tropius",

  "Trubbish",

  "Trumbeak",

  "Tsareena",

  "Turtonator",

  "Turtwig",

  "Tympole",

  "Tynamo",

  "Typhlosion",

  "Tyranitar",

  "Tyrantrum",

  "Tyrogue",

  "Tyrunt",

  "Umbreon",

  "Unfezant",

  "Unown",

  "Ursaring",

  "Urshifu",

  "Uxie",

  "Vanillish",

  "Vanillite",

  "Vanilluxe",

  "Vaporeon",

  "Venipede",

  "Venomoth",

  "Venonat",

  "Venusaur",

  "Vespiquen",

  "Vibrava",

  "Victini",

  "Victreebel",

  "Vigoroth",

  "Vikavolt",

  "Vileplume",

  "Virizion",

  "Vivillon",

  "Volbeat",

  "Volcanion",

  "Volcarona",

  "Voltorb",

  "Vullaby",

  "Vulpix",

  "Wailmer",

  "Wailord",

  "Walrein",

  "Wartortle",

  "Watchog",

  "Weavile",

  "Weedle",

  "Weepinbell",

  "Weezing",

  "Whimsicott",

  "Whirlipede",

  "Whiscash",

  "Whismur",

  "Wigglytuff",

  "Wimpod",

  "Wingull",

  "Wishiwashi",

  "Wobbuffet",

  "Woobat",

  "Wooloo",

  "Wooper",

  "Wormadam",

  "Wurmple",

  "Wynaut",

  "Xatu",

  "Xerneas",

  "Xurkitree",

  "Yamask",

  "Yamper",

  "Yanma",

  "Yanmega",

  "Yungoos",

  "Yveltal",

  "Zacian",

  "Zamazenta",

  "Zangoose",

  "Zapdos",

  "Zarude",

  "Zebstrika",

  "Zekrom",

  "Zeraora",

  "Zigzagoon",

  "Zoroark",

  "Zorua",

  "Zubat",

  "Zweilous",

  "Zygarde",
];

function autocompleteMatch(input) {
  if (input === "") {
    return [];
  }

  var reg = new RegExp(input.toLowerCase());

  return search_terms
    .filter(function (term) {
      return (
        term.toLowerCase().match(reg) &&
        term.toLowerCase() !== input.toLowerCase()
      );
    })
    .sort(function (a, b) {
      // Prioritize items that start with the input sequence
      return a.toLowerCase().startsWith(input.toLowerCase()) ? -1 : 1;
    });
}

document.getElementById("q").onblur = function () {
  // Delay the hiding of results slightly to allow for a click on the results list
  setTimeout(function () {
    hideResults();
  }, 200);
};

function hideResults() {
  var resultDiv = document.getElementById("result");
  resultDiv.innerHTML = ""; // Clear the results
  resultDiv.style.opacity = "0"; // Hide the result div
}

function showResults(val) {
  res = document.getElementById("result");
  res.style.opacity = "100";
  res.innerHTML = "";
  let list = "";
  let terms = autocompleteMatch(val);

  // Limit the number of results to the first 5
  for (let i = 0; i < Math.min(terms.length, 5); i++) {
    // Add a click event listener to each list item
    list +=
      "<li onclick=\"updateInput('" + terms[i] + "')\">" + terms[i] + "</li>";
  }

  res.innerHTML = "<ul>" + list + "</ul>";
}

function refreshResults() {
  removeAllPokemon();
  getPokemonList()
    .then((pokemonList) => {
      renderPokemonList(pokemonList);
    })
    .catch((error) => {
      console.error("Error fetching initial Pokemon list:", error);
    });
}

let value1 = document.getElementById("value1");

let value2 = document.getElementById("value2");

const maxDifference = 20;

async function updateRange() {
  let currentValue = parseInt(singleRange.value, 10);
  let newValue = currentValue + maxDifference;

  // Ensure that the difference between the new value and current value is limited to a maximum of 60
  if (newValue > parseInt(singleRange.max, 10)) {
    singleRange.value = (
      parseInt(singleRange.max, 10) - maxDifference
    ).toString();
  }

  if (newValue > 1017) {
    newValue = 1017;
    currentValue -= maxDifference;
  }

  if (currentValue === 0) {
    currentValue = 1;
  }

  // Update other UI elements or perform other actions as needed
  // console.log(
  //   `Current Value: ${Math.floor(currentValue)}, New Value: ${Math.floor(
  //     newValue
  //   )}`
  // );
  value1.innerHTML = currentValue;
  value2.innerHTML = newValue;
  console.log(currentValue);
  console.log(newValue);

  removeAllPokemon();

  console.log(loadingSpinner);
  loadingSpinner.classList.toggle("spin");
  for (let i = currentValue; i <= newValue; i++) {
    pokemonNames.push(`https://pokeapi.co/api/v2/pokemon/${i}/`);
  }

  console.log(pokemonNames);

  results = pokemonNames;
  fetchAPI();
  pokemonNames = [];
}

async function pokemonClicked(event) {
  const pokemonWrapper = document.querySelectorAll(".pokemon__wrapper");

  let parent = event.target.parentNode;
  pokemonWrapper.forEach((item) => {
    item.classList.remove("clicked");
  });

  parent.classList.add("clicked");

  var text = parent.querySelector(".pokemon__id.pokemon__id");
  var pokemonId = text.textContent.trim().slice(1);
  let pokemonTypeWrapperDiv = selectedPokemon.querySelector(
    ".pokemon__type--wrapper"
  );

  let statsWrapper = selectedPokemon.querySelector(".stats__wrapper");

  if (statsWrapper) {
    statsWrapper.innerHTML = "";
  }

  if (pokemonTypeWrapperDiv) {
    pokemonTypeWrapperDiv.remove();
  }

  const data = await getPokemonData(pokemonId);
  renderSelectedPokemon(data);
}

function renderSelectedPokemon(data) {
  // Check if pokemon__name element already exists within selected__pokemon
  let pokemonNameDiv = selectedPokemon.querySelector(".pokemon__name");
  let pokemonImgDiv = selectedPokemon.querySelector(".pokemon__img--wrapper");
  let pokemonIDDiv = selectedPokemon.querySelector(".pokemon__id");
  let statsWrapper = selectedPokemon.querySelector(".stats__wrapper");
  let statDiv = selectedPokemon.querySelector(".stats__item");
  let typeNames = data.types.map((type) => type.type.name);

  const statLabels = ["HP", "ATK", "DEF", "SpA", "SpD", "SPD"];

  let pokemonTypeWrapperDiv = selectedPokemon.querySelector(
    ".pokemon__type--wrapper"
  );

  const pokemonImg = data.sprites.front_default;

  if (!pokemonNameDiv) {
    pokemonNameDiv = document.createElement("div");
    pokemonNameDiv.classList.add("pokemon__name");

    selectedPokemon.appendChild(pokemonNameDiv);
  }

  // Pokemon Name
  const pokemonName = data.name;
  const pokemonNameCapital =
    pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  pokemonNameDiv.innerHTML = `<h1 class="pokemon__header">${pokemonNameCapital}</h1>`;

  // Pokemon Img

  if (!pokemonImgDiv) {
    pokemonImgDiv = document.createElement("div");
    pokemonImgDiv.classList.add(
      "pokemon__img--wrapper",
      "pixel-corners--wrapper"
    );

    selectedPokemon.appendChild(pokemonImgDiv);
  }

  pokemonImgDiv.innerHTML = `<img class="pokemon__img pixel-corners" src="${pokemonImg}" />`;

  if (!pokemonIDDiv) {
    pokemonIDDiv = document.createElement("div");
    pokemonIDDiv.classList.add("pokemon__id");
  }
  // Pokemon ID
  const pokemonID = data.id;

  pokemonIDDiv.innerHTML = `<h1 class="pokemon__id">#${pokemonID}</h1>`;
  selectedPokemon.appendChild(pokemonIDDiv);

  // Pokemon Types

  if (!pokemonTypeWrapperDiv) {
    pokemonTypeWrapperDiv = document.createElement("div");
    pokemonTypeWrapperDiv.classList.add("pokemon__type--wrapper");
    typeNames.forEach((typeName) => {
      const typeVar = typeStyleMap[typeName] || ""; // Use typeStyleMap from your existing code
      pokemonTypeWrapperDiv.innerHTML += `<h1 class="type__style ${typeVar}">${typeName.toUpperCase()}</h1>`;
    });
  }

  selectedPokemon.appendChild(pokemonTypeWrapperDiv);

  // Stats

  if (!statsWrapper) {
    statsWrapper = document.createElement("div");
    statsWrapper.classList.add("stats__wrapper");
  }

  for (let i = 0; i < statLabels.length; i++) {
    statDiv = document.createElement("div");

    statDiv.classList.add(`stats__item`, statLabels[i].toLowerCase());
    statDiv.setAttribute("data-stat", statLabels[i]);
    statDiv.innerHTML = `${data.stats[i].base_stat}`;
    statsWrapper.appendChild(statDiv);
  }

  selectedPokemon.appendChild(statsWrapper);
}

async function fetchAPI() {
  const data = await Promise.all(
    pokemonNames.map((url) => fetch(url).then((response) => response.json()))
  );

  console.log(data);

  results = [];
  data.map((pokemonData) => {
    renderPokemon(pokemonData);
    results.push(pokemonData);
  });

  console.log(results);

  loadingSpinner.classList.toggle("spin");
}
// Function to update the input when a list item is clicked
function updateInput(value) {
  document.getElementById("q").value = value;
}

document.addEventListener("DOMContentLoaded", renderPokemonListOnLoad);
