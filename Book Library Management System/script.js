const form = document.querySelector("form");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const category = document.querySelector("#category");
const pages = document.querySelector("#pages");

const tbody = document.querySelector("tbody");

const search = document.querySelector("#search");
const filter = document.querySelector("#filter");
const sort = document.querySelector("#sort");

const totalBooks = document.querySelector("#totalBooks");
const read = document.querySelector("#readBooks");
const unread = document.querySelector("#unreadBooks");

let booksData = JSON.parse(localStorage.getItem("booksInfo")) || []; //state

let editBookId = null;
function renderBooks(bookArray) {
  tbody.innerHTML = "";
  let row = "";
  bookArray.forEach((element) => {
    row += `<tr>
                <td>${element.title}</td>
                <td>${element.author}</td>
                <td>${element.category}</td>
                <td>${element.pages}</td>
                <td>Available</td>

                <td>
                  <button class="toggle-btn" data-id="${element.id}">${element.isRead ? "Read" : "Unread"}</button>
                </td>

                <td class="action">
                  <button class="edit-btn" data-id="${element.id}">Edit</button>
                  <button class="delete-btn" data-id="${element.id}">Delete</button>
                </td>
              </tr>`;
  });
  tbody.innerHTML = row;
  updateStates();
}
renderBooks(booksData);

//update stats
function updateStates(){
  const total = booksData.length;
  const readBooks = booksData.filter((book)=>book.isRead === true).length;
  const unreadBooks = total - readBooks;

  totalBooks.textContent = total;
  read.textContent = readBooks;
  unread.textContent = unreadBooks;
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (
    title.value.trim() === "" ||
    author.value.trim() === "" ||
    category.value.trim() === "" ||
    pages.value.trim() === ""
  )
    return;
  if (editBookId !== null) {
    const book = booksData.find((elem) => elem.id === editBookId);
    book.title = title.value;
    book.author = author.value;
    book.category = category.value;
    book.pages = pages.value;
    editBookId = null;
    localStorage.setItem("booksInfo", JSON.stringify(booksData));
    renderBooks(booksData);
    form.reset(); //to clear the form for next input
    return;
  }
  booksData.push({
    id: Date.now(),
    title: title.value,
    author: author.value,
    category: category.value,
    pages: pages.value,
    isRead: false,
  });
  localStorage.setItem("booksInfo", JSON.stringify(booksData));
  renderBooks(booksData);
  form.reset(); //to clear the form for next input
});
function toggleButton(bookId) {
  console.log(bookId);
  const book = booksData.find((elem) => elem.id === bookId);
  book.isRead = !book.isRead;
  localStorage.setItem("booksInfo", JSON.stringify(booksData));
  renderBooks(booksData);
}
const submit = document.querySelector("#submitBtn");
console.log(submit);
function edit(bookId) {
  editBookId = bookId;
  const book = booksData.find((elem) => elem.id === bookId);
  title.value = book.title;
  author.value = book.author;
  category.value = book.category;
  pages.value = book.pages;
  submit.textContent = "Update Book";
}
function del(bookId) {
  // const book = booksData.find((elem) => elem.id === bookId);
  booksData = booksData.filter((elem) => elem.id !== bookId);
  localStorage.setItem("booksInfo", JSON.stringify(booksData));
  renderBooks(booksData);
}
tbody.addEventListener("click", (event) => {
  if (event.target.dataset.id === undefined) return;

  let id = Number(event.target.dataset.id);
  if (event.target.classList.contains("toggle-btn")) toggleButton(id);
  if (event.target.classList.contains("edit-btn")) {
    edit(id);
    return;
  }
  if (event.target.classList.contains("delete-btn")) {
    del(id);
    return;
  }
});
function sorting() {
  let result = [...booksData];
  //declare variables
  const searchValue = search.value.trim().toLowerCase();
  const filterValue= filter.value;
  const sortValue = sort.value;
  //search
  if(searchValue){
    result = result.filter((book)=>{
      return(
        book.title.toLowerCase().includes(searchValue) ||
        book.author.toLowerCase().includes(searchValue) ||
        book.category.toLowerCase().includes(searchValue)
      );
    });
  }
  //filter
  if(filterValue !== "all")
  {
    if(filterValue === "read"){
      result = result.filter((book)=>book.isRead === true);
    }
    else
      result = result.filter((book)=>book.isRead === false);
  }
  //sort
    if(sortValue === "az"){
      result.sort((a,b)=>a.title.localeCompare(b.title));
    }
    else
      result.sort((a,b)=>b.title.localeCompare(a.title));
renderBooks(result);
}
search.addEventListener("input", sorting);
filter.addEventListener("change", sorting);
sort.addEventListener("change", sorting);
