// select the form
const form = document.querySelector("form");
//select all the inputs inside the form.
const controls = document.querySelector(".controls");

const submitBtn = document.querySelector("#submitBtn");
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
//i declared a variable to detect user edit.
let editBookId = null;
//2).i create an empty array at first.
let booksData = JSON.parse(localStorage.getItem("bookData")) || [];
//now to select search eleemnt
const search = document.querySelector("#search");
// 3).i made a reusable function rendering at global scope.
function rendering(booksArray) {
  tbody.innerHTML = "";
  let row = "";
  booksArray.forEach((elem, index) => {
    row += `<tr>
                <td>${elem.title}</td>
                <td>${elem.author}</td>
                <td>${elem.category}</td>
                <td>${elem.pages}</td>
                <td>Available</td>
                <td>
                  <button class="toggle-btn" data-id="${elem.id}">${elem.isRead ? "Read" : "Unread"}</button>
                </td>

                <td class="action">
                  <button class="edit-btn" data-id = ${elem.id} >Edit</button>
                  <button class="delete-btn" data-id = ${elem.id}>Delete</button>
                </td>
              </tr>`;
  });
  tbody.innerHTML = row;
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
  if (editBookId !== null) {
    let book = booksData.find((elem) => elem.id === editBookId);
    book.title = title.value;
    book.author = author.value;
    book.category = category.value;
    book.pages = pages.value;
    editBookId = null;
    submitBtn.textContent = "Add Book";
  } else {
    booksData.push({
      id: Date.now(),
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
function edit(book) {
  editBookId = Number(book.id);
  title.value = book.title;
  author.value = book.author;
  category.value = book.category;
  pages.value = book.pages;
  submitBtn.textContent = "Update Book";
}
function del(book) {
  const isConfirm = confirm("Are you sure you want to Delete this item?");
  if (isConfirm) {
    booksData = booksData.filter((elem) => elem.id !== book.id);
    localStorage.setItem("bookData", JSON.stringify(booksData));
    rendering(booksData);
  }
}
tbody.addEventListener("click", (event) => {
  //if user clicks other than element inside tbody  which have no data-id,that is why it return undefined,!undefined=true,reuturn statement run and function ends.
  if (!event.target.dataset.id) return;
  let bookId = Number(event.target.dataset.id); //Otherwise it will return NAN.If .find() does not find a matching item in the array, it returns undefined,

  let book = booksData.find((elem) => elem.id === bookId);
  if (!book) return; //if all things works well but anyone is not matching ,it returns
  if (event.target.classList.contains("toggle-btn")) {
    book.isRead = !book.isRead;
    localStorage.setItem("bookData", JSON.stringify(booksData));
    rendering(booksData);
    return;
  }
  if (event.target.classList.contains("edit-btn")) {
    edit(book);
    return;
  }
  if (event.target.classList.contains("delete-btn")) {
    del(book);
    return;
  }
});

search.addEventListener("input", () => {
  const value = search.value.trim().toLowerCase();
  if (value === "") {
    rendering(booksData); //if search box is empty.
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

function updateUI() {
  let result = [...booksData];
  // Search
  if (search.value.trim() !== "") {
    // Filter result by search
    const value = search.value.trim().toLowerCase();
    result = booksData.filter((elem) => {
      return (
        elem.title.toLowerCase().includes(value) ||
        elem.author.toLowerCase().includes(value) ||
        elem.category.toLowerCase().includes(value)
      );
    });
    if (result.length === 0){
      tbody.innerHTML = "<tr><td colspan='7'>Result not found</td></tr>";
      return;
    }
      
  }

  // Read/Unread filter
  if (filter.value !== "all") {
    // Filter result by read/unread
    if (filter.value === "read") result = result.filter((elem) => elem.isRead == true);
    else result = result.filter((elem) => elem.isRead == false);
  }

  // Sort
  if (sort.value === "az")
    // Sort A-Z
    result.sort((a, b) => a.title.localeCompare(b.title));

  if (sort.value === "za")
    // Sort Z-A
    result.sort((a, b) => b.title.localeCompare(a.title));

  rendering(result);
}

search.addEventListener("input", updateUI);
filter.addEventListener("change", updateUI);
sort.addEventListener("change", updateUI);
