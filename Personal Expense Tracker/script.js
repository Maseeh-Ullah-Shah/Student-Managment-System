const form = document.querySelector("form"); //I select the form tag to attach an addeventlistner to this to handle the form .
const description = document.querySelector("#description");
const amount = document.querySelector("#amount");
const category = document.querySelector("#category");
const type = document.querySelector("#type");
const date = document.querySelector("#date");

const submitBtn = document.querySelector("#submitBtn");
//Next i select the element where we onsert the elenents dynamically.
const tbody = document.querySelector("tbody");
// I select these elements for update states
const totalIncome = document.querySelector("#totalIncome");
const totalExpense = document.querySelector("#totalExpense");
const balance = document.querySelector("#balance");
const totalTransactions = document.querySelector("#totalTransactions");

// At last i select this element for calculating the sorting codition
const search = document.querySelector("#search");
const filter = document.querySelector("#filter");
const sort = document.querySelector("#sort");
//i select the reset button
const resetBtn = document.querySelector("#resetBtn");
// I declare an empty array to store personal info.
let transactions =
  JSON.parse(localStorage.getItem("personalTransaction")) || [];
//To attach an event listner to form.
let editTransactionId = null;
function renderTransaction(transactionArray) {
  tbody.innerHTML = "";
  let html = "";
  transactionArray.forEach((element) => {
    html += `<tr>
            <td>${element.description}</td>
            <td>$${element.amount}</td>
            <td>${element.category}</td>
            <td>
              <span class="${element.type}">${element.type}</span>
            </td>
            <td>${element.date}</td>
            <td>
              <button class="edit-btn" data-id="${element.id}">Edit</button>
              <button class="delete-btn" data-id="${element.id}">Delete</button>
            </td>
          </tr>`;
  });

  tbody.innerHTML = html;
  updateStates();
}

renderTransaction(transactions); // I call this function globally  if data is already stored in the aray.
// To avoid repetation of local storage i create a seaparate function for this i only call this funtion and stores the data in local storage.
function saveTransaction() {
  localStorage.setItem("personalTransaction", JSON.stringify(transactions));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (
    description.value.trim() === "" ||
    amount.value.trim() === "" ||
    category.value.trim() === "" ||
    type.value.trim() === "" ||
    date.value.trim() === ""
  )
    return;
  if (editTransactionId !== null) {
    const transaction = transactions.find(
      (elem) => elem.id === editTransactionId,
    );
    transaction.description = description.value;
    transaction.amount = Number(amount.value); //remember this must be converted into number otherwise in total expense result will show exxtra zero before a number.
    transaction.category = category.value;
    transaction.type = type.value;
    transaction.date = date.value;
    editTransactionId = null;
    submitBtn.textContent = "Add Transaction";
    saveTransaction();
    renderTransaction(transactions);
    form.reset();
    return;
  }
  transactions.push({
    id: Date.now(),
    description: description.value,
    amount: Number(amount.value),
    category: category.value,
    type: type.value,
    date: date.value,
  });
  saveTransaction();
  renderTransaction(transactions);
  form.reset();
});
function edit(id) {
  editTransactionId = id;
  const transaction = transactions.find((elem) => elem.id === id);
  description.value = transaction.description;
  amount.value = transaction.amount;
  category.value = transaction.category;
  type.value = transaction.type;
  date.value = transaction.date;
  submitBtn.textContent = "Update Transaction";
}
function del(id) {
  const isConfirm = confirm("Are you sure you want to delete this item?");
  if (isConfirm) {
    transactions = transactions.filter((elem) => elem.id !== id);
    saveTransaction();
  }
  renderTransaction(transactions);
}
function handleEvent(event) {
  const id = event.target.dataset.id;
  if (!id) return;
  let value = Number(id);
  if (event.target.classList.contains("edit-btn")) edit(value);
  if (event.target.classList.contains("delete-btn")) del(value);
}
tbody.addEventListener("click", handleEvent);

function updateStates() {
  const totaltransaction = transactions.length;
  totalTransactions.textContent = totaltransaction;
  //to find total income
  const totalincome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  totalIncome.textContent = totalincome;
  const totalexpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);
  totalExpense.textContent = totalexpense;

  balance.textContent = totalincome - totalexpense;
}
//function for sorting.
function sorting() {
  let result = [...transactions];
  let searchValue = search.value.trim().toLowerCase();
  let filterValue = filter.value;
  let sortValue = sort.value;
  if (searchValue) {
    result = result.filter((transaction) => {
      return (
        transaction.description.toLowerCase().includes(searchValue) ||
        transaction.category.toLowerCase().includes(searchValue)
      );
    });
  }
  if (filterValue !== "all") {
    if (filterValue === "income")
      result = result.filter((transaction) => transaction.type === "income");
    else if (filterValue === "expense")
      result = result.filter((transaction) => transaction.type === "expense");
  }
  if (sortValue) {
    switch (sortValue) {
      case "az":
        result.sort((a, b) => a.description.localeCompare(b.description));
        break;
      case "za":
        result.sort((a, b) => b.description.localeCompare(a.description));
        break;
      case "high":
        result.sort((a, b) => b.amount - a.amount);
        break;
      case "low":
        result.sort((a, b) => a.amount - b.amount);
        break;
      case "new":
        result.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "old":
        result.sort((a, b) => a.date.localeCompare(b.date));
        break;
      default:
        break;
    }
  }
  if (result.length === 0) {
    tbody.innerHTML = `<tr>
      <td colspan="6">No transactions found</td>
    </tr>`;
    return;
  }
  renderTransaction(result);
}
search.addEventListener("input", sorting);
filter.addEventListener("change", sorting);
sort.addEventListener("change", sorting);

function resetbtn() {
  if (search.value) search.value = "";
  if (filter.value !== "all") filter.value = "all";
  if (sort.value) sort.value = "";
  if (type.value) type.value = "";
  if (date.value) date.value = "";
  if (description.value) description.value = "";
  if (amount.value) amount.value = "";
  if (category.value) category.value = "";
  if (editTransactionId !== null) {
    editTransactionId = null;
    submitBtn.textContent = "Add Transaction";
  }
  renderTransaction(transactions);
}
resetBtn.addEventListener("click", resetbtn);
