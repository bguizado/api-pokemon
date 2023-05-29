let page = 1;

const fetchPokemon = async (page) => {
  const limit = 9;
  const offset = (page - 1) * limit;
  const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
  const response = await fetch(url);
  const data = await response.json();
  const dataResults = data.results.map((pokemon) => {
    const id = pokemon.url.split("/").at(6);
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
    return {
      ...pokemon,
      id,
      image,
    };
  });
  return dataResults;
};

const documentReady = async () => {
  const nextPage = document.getElementById("nextPage");
  const currentPage = document.getElementById("currentPage");
  const prevPage = document.getElementById("prevPage");

  nextPage.addEventListener("click", async () => {
    const pokemons = await fetchPokemon(++page);
    renderPokemons(pokemons);
    currentPage.innerHTML = page;
  });

  prevPage.addEventListener("click", async () => {
    const pokemons = await fetchPokemon(--page);
    renderPokemons(pokemons);
    currentPage.innerHTML = page;
  });

  const pokemons = await fetchPokemon();
  renderPokemons(pokemons);
};

document.addEventListener("DOMContentLoaded", documentReady);

const renderPokemons = (pokemons) => {
  const pokemonsList = document.getElementById("pokemonsList");

  let elements = "";

  pokemons.forEach((pokemon) => {
    elements += `
    <article class="pokemons-item">
      <img src='${pokemon.image}' width='100' height='100'/>
      <h2> #${pokemon.id} ${pokemon.name} </h2>
    </article>    
    `;
  });

  const showModal = (pokemon) => {
    const modal = document.querySelector(".modal");
    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const modalCloseBtn = document.getElementById("modal-close");

    modalImg.src = pokemon.image;
    modalTitle.textContent = `#${pokemon.id} ${pokemon.name}`;

    modal.classList.add("modal-show");
    modalCloseBtn.addEventListener("click", () => {
      modal.classList.remove("modal-show");
    });
  };

  pokemonsList.addEventListener("click", (event) => {
    const clickedPokemon = event.target.closest(".pokemons-item");
    if (clickedPokemon) {
      const index = Array.from(pokemonsList.children).indexOf(clickedPokemon);
      const selectedPokemon = pokemons[index];
      showModal(selectedPokemon);
    }
  });

  pokemonsList.innerHTML = elements;
};
