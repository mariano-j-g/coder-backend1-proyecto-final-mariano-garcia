const socket = io();

socket.on("showProducts", (products) => {
  const productContainer = document.querySelector("#products");
  productContainer.innerHTML = "";
  products.payload.docs.forEach((product) => {
    const title = document.createElement("li");
    title.innerHTML = product.title;
    const price = document.createElement("p");
    price.innerHTML = "Precio: " + product.price;
    const description = document.createElement("p");
    description.innerHTML = "Descripcion: " + product.description;
    const category = document.createElement("p");
    category.innerHTML = "Categoria: " + product.category;
    const div = document.createElement("div");
    const button = document.createElement("button");
    button.innerHTML = "Eliminar";
    button.addEventListener("click", () => {
      deleteProduct(product._id);
    });
    const buttonAddProductToCart = document.createElement("button");
    buttonAddProductToCart.innerHTML = "Agregar al carrito";
    buttonAddProductToCart.addEventListener("click", () => {
      addProductInCart(product._id);
    });
    div.classList.add("producto");
    div.append(
      title,
      description,
      category,
      price,
      button,
      buttonAddProductToCart
    );
    productContainer.appendChild(div);
  });
  const buttonsLine = document.querySelector("#buttons");
  buttonsLine.innerHTML = "";
  if (products.payload.hasPrevPage) {
    const btnAtras = document.createElement("button");
    btnAtras.innerHTML = "Atras";
    btnAtras.addEventListener("click", () => {
      const page = products.payload.page - 1;
      refreshPage(page);
    });
    buttonsLine.appendChild(btnAtras);
  }
  if (products.payload.hasNextPage) {
    const btnNext = document.createElement("button");
    btnNext.innerHTML = "Siguiente";
    btnNext.addEventListener("click", () => {
      const page = products.payload.page + 1;
      refreshPage(page);
    });
    buttonsLine.appendChild(btnNext);
  }
});

socket.on("error", (messaje) => {
  Swal.fire(messaje);
});

const addProduct = () => {
  const productToAdd = {
    title: String(document.querySelector("#addTitle").value),
    description: String(document.querySelector("#addDescription").value),
    code: String(document.querySelector("#addCode").value),
    price: Number(document.querySelector("#addPrice").value),
    stock: Number(document.querySelector("#addStock").value),
    category: String(document.querySelector("#addCategory").value),
  };
  socket.emit("addProductFromView", productToAdd);
  Swal.fire("El producto se agregó al final de la lista");
};

const deleteProduct = (productId) => {
  socket.emit("deleteProductFromView", productId);
};
const refreshPage = (page) => {
  socket.emit("refreshPage", page);
};
const addProductInCart = (productId) => {
  socket.emit("addProductInCart", productId);
};
