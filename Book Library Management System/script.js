// select the form
const form = document.querySelector("form");
//select all the inputs inside the form.
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const category = document.querySelector("#category");
const pages = document.querySelector("#pages");
//i select the tbody inside table to target it.
const tbody = document.querySelector("tbody");
const sort = document.querySelector("#sort");
let read = 0;
const readBooks = document.querySelector("#readBooks");
const unreadBooks = document.querySelector("#unreadBooks");
let unRead = 0;
const totalBooks = document.querySelector("#totalBooks");
let total = 0;
//i declared a variable to detect user edit.
let editIndex = null;
//2).i create an empty array at first.
const booksData = JSON.parse(localStorage.getItem("bookData")) || [];
//now to select search eleemnt
const search = document.querySelector("#search");
// 3).i made a reusable function rendering at global scope.
function rendering(booksArray) {
  tbody.innerHTML = "";
  booksArray.forEach((elem, index) => {
    tbody.innerHTML += `<tr>
                <td>${elem.title}</td>
                <td>${elem.author}</td>
                <td>${elem.category}</td>
                <td>${elem.pages}</td>
                <td>Available</td>
                <td>
                  <button class="toggle-btn" data-index="${index}">${elem.isRead ? "Read" : "Unread"}</button>
                </td>

                <td class="action">
                  <button class="edit-btn" onclick = "edit(${index})">Edit</button>
                  <button class="delete-btn" onclick = "del(${index})">Delete</button>
                </td>
              </tr>`;
  });
  totalBooks.textContent = booksData.length;
  read = booksData.filter((book) => book.isRead === true).length;
  unRead = booksData.length - read;

  readBooks.textContent = read;
  unreadBooks.textContent = unRead;
}
//Call this function at global if already have some data is stored.
rendering(booksData);
//now i add event listner on form
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (
    title.value.trim() === "" ||
    author.value.trim() === "" ||
    category.value.trim() === "" ||
    pages.value.trim() === ""
  )
    return;
  if (editIndex !== null) {
    booksData[editIndex].title = title.value;
    booksData[editIndex].author = author.value;
    booksData[editIndex].category = category.value;
    booksData[editIndex].pages = pages.value;
    editIndex = null;
  } else {
    booksData.push({
      title: title.value,
      author: author.value,
      category: category.value,
      pages: pages.value,
      isRead: false,
    });
  }
  localStorage.setItem("bookData", JSON.stringify(booksData));
  rendering(booksData);
  form.reset();
});

//i made a function for edit and delete
function edit(index) {
  editIndex = index;
  title.value = booksData[index].title;
  author.value = booksData[index].author;
  category.value = booksData[index].category;
  pages.value = booksData[index].pages;
}
function del(index) {
  booksData.splice(index, 1);
  localStorage.setItem("bookData", JSON.stringify(booksData));
  rendering(booksData);
}
tbody.addEventListener("click", (event) => {
  let bookIndex = event.target.dataset.index;
  booksData[bookIndex].isRead = !booksData[bookIndex].isRead;
  localStorage.setItem("bookData", JSON.stringify(booksData));
  rendering(booksData);
});

search.addEventListener("input", () => {
  const value = search.value.trim().toLowerCase();
  if (value === "") {
    rendering(booksData);
    return;
  }

  const filterArray = booksData.filter((elem) => {
    return (
      elem.title.toLowerCase().includes(value) ||
      elem.author.toLowerCase().includes(value) ||
      elem.category.toLowerCase().includes(value)
    );
  });
  if (filterArray.length === 0) {
    tbody.innerHTML = "<tr><td colspan='7'>Result not found</td></tr>";
  } else rendering(filterArray);
});
//Now write code for sorting for drop down menu
sort.addEventListener("change", () => {
  let value = sort.value;
  if (value == "") rendering(booksData);
  else if (value == "az") {
    booksData.sort((a, b) => a.title.localeCompare(b.title));
    rendering(booksData);
  } else {
    booksData.sort((a, b) => b.title.localeCompare(a.title));
    rendering(booksData);
  }
});

//now display the book data when user select read or unread?
const filter = document.querySelector("#filter");
filter.addEventListener("change", () => {
  let value = filter.value;
  if (value == "all") rendering(booksData);
  else if (value == "read") {
    const filterArray = booksData.filter((elem) => elem.isRead == true);
    rendering(filterArray);
  } else {
    const filterArray = booksData.filter((elem) => elem.isRead == false);
    rendering(filterArray);
  }
});
