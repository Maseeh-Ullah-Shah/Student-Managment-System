const form = document.querySelector("form");
const productName = document.querySelector("#productName");
const category = document.querySelector("#category");
const supplier = document.querySelector("#supplier");
const price = document.querySelector("#price");
const stock = document.querySelector("#stock");

const tbody = document.querySelector("tbody");

const submitBtn = document.querySelector("#submitBtn");
let products = JSON.parse(localStorage.getItem("salesData")) || [];
let editSalesId = null;
function renderProduct(product) {
  tbody.innerHTML = "";
  let row = "";
  product.forEach((element) => {
    let status;
    if (element.stock === 0) status = "Out of Stock";
    else if (element.stock > 0 && element.stock <= 10) status = "Low Stock";
    else status = "InStock";
    row += `<tr>
            <td>${element.productName}</td>
            <td>${element.category}</td>
            <td>${element.supplier}</td>
            <td>$${element.price}</td>
            <td>${element.stock}</td>
            <td>
              <span class="status in-stock">${status}</span>
            </td>

            <td>
              <button class="sell-btn" data-id="${element.id}" ${element.stock === 0 ? "disabled" : ""}>Sell</button>
              <button class="restock-btn" data-id="${element.id}">+10 Stock</button>
              <button class="edit-btn" data-id="${element.id}">Edit</button>
              <button class="delete-btn" data-id="${element.id}">Delete</button>
            </td>
          </tr>`;
  });
  tbody.innerHTML = row;
  updateStates(products);
}
renderProduct(products);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (editSalesId !== null) {
    const product = products.find((elem) => elem.id === editSalesId);
    product.productName = productName.value;
    product.category = category.value;
    product.supplier = supplier.value;
    product.price = Number(price.value);
    product.stock = Number(stock.value);
    submitBtn.textContent = "Add Product";
    editSalesId = null;
    localStorage.setItem("salesData", JSON.stringify(products));
    form.reset();
    renderProduct(products);
    return;
  }
  products.push({
    id: Date.now(),
    productName: productName.value,
    category: category.value,
    supplier: supplier.value,
    price: Number(price.value),
    stock: Number(stock.value),
    status: false,
  });
  console.log(products);
  localStorage.setItem("salesData", JSON.stringify(products));
  renderProduct(products);
  form.reset();
});

function edit(id) {
  editSalesId = id;
  const product = products.find((elem) => elem.id === id);
  productName.value = product.productName;
  category.value = product.category;
  supplier.value = product.supplier;
  price.value = product.price;
  stock.value = product.stock;
  submitBtn.textContent = "Update Product";
}
function del(id) {
  products = products.filter((elem) => elem.id !== id);
  localStorage.setItem("salesData", JSON.stringify(products));
  renderProduct(products);
  return;
}
function restock(id) {
  const product = products.find((elem) => elem.id === id);
  product.stock = product.stock + 10;
  localStorage.setItem("salesData", JSON.stringify(products));
  renderProduct(products);
}
function sell(id) {
  const product = products.find((elem) => elem.id === id);
  if (product.stock > 0) {
    product.stock--;
    localStorage.setItem("salesData", JSON.stringify(products));
    renderProduct(products);
  }
}
function updateStates() {
  const totalProducts = document.querySelector("#totalProducts");
  const inStock = document.querySelector("#inStock");
  const lowStock = document.querySelector("#lowStock");
  const OutOfStock = document.querySelector("#outOfStock");
  const inventoryValue = document.querySelector("#inventoryValue");

  const total = products.length;
  totalProducts.textContent = total;
  const inventory = products.reduce((acc, product) => {
    return acc + product.price * product.stock;
  }, 0);
  inventoryValue.innerHTML = `$${inventory}`;
  const instock = products.filter((product) => product.stock >= 10).length;
  inStock.textContent = instock;
  const lowstock = products.filter((product) => product.stock >= 1 && product.stock <= 10).length;
  lowStock.textContent = lowstock;
  const outofstock = products.filter((product) => product.stock === 0).length;
  OutOfStock.textContent = outofstock;
  //for status instock,ouofstock,lowstock
  const status = document.querySelector(".status");
}

tbody.addEventListener("click", (event) => {
  let value = event.target.dataset.id;
  if (value === undefined) return;
  let id = Number(value);
  if (event.target.classList.contains("edit-btn")) edit(id);

  if (event.target.classList.contains("delete-btn")) del(id);

  if (event.target.classList.contains("restock-btn")) restock(id);

  if (event.target.classList.contains("sell-btn")) sell(id);
});

const search = document.querySelector("#search");
const filter = document.querySelector("#filter");
const sort = document.querySelector("#sort");
//Update UI function
function updateUi(event) {
  let result = [...products];
  let searchvalue = search.value.trim().toLowerCase();
  let filterValue = filter.value;
  let sortValue = sort.value;
  if (searchvalue) {
    result = result.filter((product) => {
      return (
        product.productName.toLowerCase().includes(searchvalue) ||
        product.category.toLowerCase().includes(searchvalue) ||
        product.supplier.toLowerCase().includes(searchvalue)
      );
    });
  }
  if (filterValue !== "all") {
    if (filterValue === "instock")
      result = result.filter((product) => product.stock >= 10);
    else if (filterValue === "lowstock")
      result = result.filter(
        (product) => product.stock >= 1 && product.stock < 10,
      );
    else if (filterValue === "outofstock")
      result = result.filter((product) => product.stock === 0);
  }
  if (sortValue) {
    if (sortValue === "az")
      result.sort((a, b) => a.productName.localeCompare(b.productName));
    else if (sortValue === "za")
      result.sort((a, b) => b.productName.localeCompare(a.productName));
    else if (sortValue === "highprice")
      result.sort((a, b) => b.price - a.price);
    else if (sortValue === "lowprice") result.sort((a, b) => a.price - b.price);
    else if (sortValue === "highstock")
      result.sort((a, b) => b.stock - a.stock);
    else if (sortValue === "lowstock") result.sort((a, b) => a.stock - b.stock);
  }
  renderProduct(result);
}

search.addEventListener("input", updateUi);
filter.addEventListener("change", updateUi);
sort.addEventListener("change", updateUi);
