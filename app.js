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

let cardToFlash = ''
// const stopFlashingCard = []
// const cardStopped = []

function flashCardColor(e) {
    // console.log(e)
    // console.log(e.slice(1))
    if (cardToFlash != '') {
        cardToFlash.classList.remove("card-flash")
    }
    // stopFlashingCard.push(document.getElementsByTagName("li"))
    // cardStopped = stopFlashingCard[0][0].classList.contains("card-flash")


    // cardStopped = stopFlashingCard[0].filter(hasCardClass)
    // cardStopped.classList.remove("card-flash")   


    // cardStopped.classList.remove("card-flash")
    // console.log(stopFlashingCard.classList)
    // console.log(stopFlashingCard.classList.remove("card-flash"))

    cardToFlash = document.getElementById(e.slice(1))
    // window.scrollTo(1000, 12700)
    // console.log(cardToFlash.classList)
    cardToFlash.classList.add("card-flash")
    // console.log(typeof(cardToFlash))
    // console.log(cardToFlash.classList)
    setTimeout(() => {
        // cardToFlash.removeAttribute("class", "card-flash")
        cardToFlash.classList.remove("card-flash")
    }, 10000);
    // // console.log(cardToFlash.classList)
}
// console.log(cardStopped)
// console.log(cardStopped.classList)

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
                flashCardColor("#pokemon" + searchedPokemon)                
                // alert("Pokemon >número< OK")
            } else {
                location.href = "#pokemon" + (pokemonsIdList.indexOf(searchedPokemon) + 1)
                flashCardColor("#pokemon" + searchedPokemon)
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