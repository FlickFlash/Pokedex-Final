const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`

const generatePokemonPromises = () => Array(905).fill().map((_, index) =>
    fetch(getPokemonUrl(index + 1)).then(response => response.json()))


const pokemonsIdList = []
const generateHTML = pokemons => pokemons.reduce((accumulator, { types, id, species }) => {
        const elementTypes = types.map(typeInfo => typeInfo.type.name)
        if (id <= 898) {
            accumulator += `
            <li class="card ${elementTypes[0]}" id="pokemon${id}">
            <img class="card-image" alt="${species.name}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" />
                <h2 class="card-title">${id}. ${species.name}
                <p class="card-subtitle">${elementTypes.join(' | ')}</p>
            </li>`
            pokemonsIdList.push(species.name)
            return accumulator
        } else {
            accumulator += `
            <li class="card ${elementTypes[0]}" id="pokemon${id}">
            <img class="card-image" alt="${species.name}" src="./img/imgpokemon${id}.png" />
                <h2 class="card-title">${id}. ${species.name}
                <p class="card-subtitle">${elementTypes.join(' | ')}</p>
            </li>`
            pokemonsIdList.push(species.name)
            return accumulator
        }
    }, '')


const insertPokemonsIntoPage = pokemons => {
    const ul = document.querySelector('[data-js="pokedex"]')
    ul.innerHTML = pokemons
}

const spinner = document.getElementById("loadingSpinner")

const removeSpinner = () => setTimeout(() => {
    spinner.remove()
}, 0);

const searchingPokemonsBlock = document.getElementById("searchBlock")
let searchingPokemonsInput = document.createElement("input")
searchingPokemonsInput.type = "text"
searchingPokemonsInput.placeholder = "Nome ou número do Pokémon..."
searchingPokemonsInput.id = "searchPokemon"


const searchingPokemonsButton = document.createElement("button")
searchingPokemonsButton.onclick = scrollToPokemon
searchingPokemonsButton.innerText = "BUSCAR"

function appendSearch() {
    searchingPokemonsBlock.appendChild(searchingPokemonsInput)
    searchingPokemonsBlock.appendChild(searchingPokemonsButton)
}

const pokemonPromises = generatePokemonPromises()

function scrollToPokemon() {
    // alert("clicou")
    // console.log("clicou")
    const searchedPokemon = searchingPokemonsInput.value.toLowerCase()
    function numberOrName() {
        const numberCondition = (searchedPokemon >= 1 && searchedPokemon <= 904)
        const nameCondition = (pokemonsIdList.includes(searchedPokemon))
        if (numberCondition || nameCondition) {
            if (numberCondition) {
                location.href = "#pokemon" + searchedPokemon
                // alert("Pokemon >número< OK")
            } else {
                location.href = "#pokemon" + (pokemonsIdList.indexOf(searchedPokemon) + 1)
                // alert("Pokemon >nome< OK")
            }
        } else {
            alert('Pokémon não encontrado! 😪')

        }
    }
    numberOrName()
}

Promise.all(pokemonPromises)
    .then(generateHTML)
    .then(insertPokemonsIntoPage)
    .then(removeSpinner)
    .then(appendSearch)