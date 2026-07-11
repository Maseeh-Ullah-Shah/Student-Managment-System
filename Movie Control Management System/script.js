const form = document.querySelector("form");
const movieTitle = document.querySelector("#title");
const director = document.querySelector("#director");
const genre = document.querySelector("#genre");
const year = document.querySelector("#year");
const rating = document.querySelector("#rating");
const status = document.querySelector("#status");

const tbody = document.querySelector("tbody");
const submitBtn = document.querySelector("#submitBtn");

const favoritebtn = document.querySelector(".favorite-btn");
let movies = JSON.parse(localStorage.getItem("moviesObject")) || [];
let editMovieId = null;
function renderMovies(moviesArray) {
  tbody.innerHTML = "";
  let row = "";
  moviesArray.forEach((movie) => {
    row += `<tr>
            <td>${movie.title}</td>
            <td>${movie.director}</td>
            <td>${movie.genre}</td>
            <td>${movie.year}</td>
            <td>${movie.rating}</td>

            <td>
              <button class="status-btn" data-id="${movie.id}">${movie.status}</button>
            </td>

            <td>
              <button class="favorite-btn" data-id="${movie.id}">${movie.isFavorite ? "⭐" : "☆"}</button>
            </td>

            <td class="actions">
              <button class="edit-btn" data-id="${movie.id}">Edit</button>

              <button class="delete-btn" data-id="${movie.id}">Delete</button>
            </td>
          </tr>`;
  });
  tbody.innerHTML = row;
  updateStates();
}
renderMovies(movies);
form.addEventListener("submit", () => {
  event.preventDefault();
  if (
    movieTitle.value.trim() === "" ||
    director.value.trim() === "" ||
    genre.value === "" ||
    year.value.trim() === "" ||
    rating.value === "" ||
    status.value === ""
  )
    return;
  if (editMovieId !== null) {
    const movie = movies.find((elem) => elem.id === editMovieId);
    movie.title = movieTitle.value;
    movie.director = director.value;
    movie.genre = genre.value;
    movie.year = year.value;
    movie.rating = rating.value;
    movie.status = status.value;
    editMovieId = null;
    localStorage.setItem("moviesObject", JSON.stringify(movies));
    form.reset();
    submitBtn.textContent = "Add Movie";
    renderMovies(movies);
    return;
  }
  movies.push({
    id: Date.now(),
    title: movieTitle.value,
    director: director.value,
    genre: genre.value,
    year: year.value,
    rating: rating.value,
    status: status.value,
    isFavorite: false,
  });
  localStorage.setItem("moviesObject", JSON.stringify(movies));
  renderMovies(movies);
  form.reset();
});
function edit(id) {
  const movie = movies.find((elem) => elem.id === id);
  movieTitle.value = movie.title;
  director.value = movie.director;
  genre.value = movie.genre;
  year.value = movie.year;
  rating.value = movie.rating;
  status.value = movie.status;
  submitBtn.textContent = "Update Movie";
}
function del(id) {
  movies = movies.filter((movie) => movie.id !== id);
  localStorage.setItem("moviesObject", JSON.stringify(movies));
  renderMovies(movies);
}
function favoriteBtn(id) {
  const movie = movies.find((elem) => elem.id === id);
  movie.isFavorite = !movie.isFavorite;
  localStorage.setItem("moviesObject", JSON.stringify(movies));
  renderMovies(movies);
}
function changeStatus(id) {
  const movie = movies.find((elem) => elem.id === id);
  if (!movie) return;
  if (movie.status === "watched") {
    movie.status = "watching";
  } else if (movie.status === "watching") {
    movie.status = "wishlist";
  } else {
    movie.status = "watched";
  }
  localStorage.setItem("moviesObject", JSON.stringify(movies));
  renderMovies(movies);
}
function updateStates() {
  const totalMovies = document.querySelector("#totalMovies");
  const watchedMovies = document.querySelector("#watchedMovies");
  const watchingMovies = document.querySelector("#watchingMovies");
  const wishlistMovies = document.querySelector("#wishlistMovies");
  const fovoriteMovies = document.querySelector("#favoriteMovies");

  const total = movies.length;
  totalMovies.textContent = total;
  const watched = movies.filter((elem) => elem.status === "watched").length;
  watchedMovies.textContent = watched;
  const watching = movies.filter((elem) => elem.status === "watching").length;
  watchingMovies.textContent = watching;
  const wishlisht = movies.filter((elem) => elem.status === "wishlist").length;
  wishlistMovies.textContent = wishlisht;
  const favorite = movies.filter((elem) => elem.isFavorite === true).length;
  fovoriteMovies.textContent = favorite;
}

function handleEvent(event) {
  let value = event.target.dataset.id;
  if (value === undefined) return;
  let id = Number(value);
  if (event.target.classList.contains("edit-btn")) {
    editMovieId = id;
    edit(id);
  }
  if (event.target.classList.contains("delete-btn")) del(id);

  if (event.target.classList.contains("favorite-btn")) favoriteBtn(id);
  if (event.target.classList.contains("status-btn")) changeStatus(id);
}
//use event delegation technique to attach event on parent element
tbody.addEventListener("click", handleEvent);

const search = document.querySelector("#search");
const sort = document.querySelector("#sort");
const filter = document.querySelector("#filter");

function sorting() {
  let result = [...movies];
  const searchValue = search.value.trim().toLowerCase();
  const filterValue = filter.value;
  const sortValue = sort.value;
  if (searchValue) {
    result = result.filter((elem) => {
      return (
        elem.title.toLowerCase().includes(searchValue) ||
        elem.director.toLowerCase().includes(searchValue) ||
        elem.genre.toLowerCase().includes(searchValue)
      );
    });
  }
  if (filterValue !== "all") {
    if (filterValue === "watched")
      result = result.filter((elem) => elem.status === "watched");
    else if (filterValue === "watching")
      result = result.filter((elem) => elem.status === "watching");
    else if (filterValue === "wishlist")
      result = result.filter((elem) => elem.status === "wishlist");
    else result = result.filter((elem) => elem.isFavorite);
  }
  if (sortValue) {
    if (sortValue === "az")
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortValue === "za")
      result = result.sort((a, b) => b.title.localeCompare(a.title));
    else if (sortValue === "high")
      result = result.sort((a, b) => b.rating - a.rating);
    else if (sortValue === "low")
      result = result.sort((a, b) => a.rating - b.rating);
    else if (sortValue === "new")
      result = result.sort((a, b) => b.year - a.year);
    else if (sortValue === "old")
      result = result.sort((a, b) => a.year - b.year);
  }
  if (result.length === 0) {
    tbody.innerHTML = '<tr><td colspan = "8">Result Not Found</td></tr>';
    return;
  }
  renderMovies(result);
}

sort.addEventListener("change", sorting);
search.addEventListener("input", sorting);
filter.addEventListener("change", sorting);
