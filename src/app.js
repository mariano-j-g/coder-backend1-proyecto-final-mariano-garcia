import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import productsRoutes from "./routes/productsRoutes.js";
import cartsRoutes from "./routes/cartsRoutes.js";
import realtimeproducts from "./routes/realtimeProductsRoutes.js";
import mainRoutes from "./routes/mainRoutes.js";
import cartsViewRoutes from "./routes/cartsViewRoutes.js";
import __dirname from "./utils.js";
import { CartManager } from "./class/cartManager.js";
import { ProductManager } from "./class/productManager.js";
const app = express();
const PORT = 8080;

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/realtimeproducts", realtimeproducts);
app.use("/carts", cartsViewRoutes);
app.use("/", mainRoutes);

const runServer = app.listen(
  PORT,
  console.log("Server on:http://localhost:" + PORT)
);
const newProductManager = new ProductManager();
const newCartManager = new CartManager();
const websocketServer = new Server(runServer);
const connectToDataBase = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://nicocabrera8:Y0BrFdDBQ23amtUR@backendcoderhouse1.nvbxjk0.mongodb.net/?retryWrites=true&w=majority&appName=BackendCoderhouse1",
        { dbName: "Products" }
      )
      .then(console.log("conexion con base de datos ok"));
  } catch {
    return {
      messaje: "Error en conexion con base de datos",
    };
  }
};
connectToDataBase();

websocketServer.on("connection", async (socket) => {
  /*console.log("Cliente conectado");
  console.log({
    id: socket.id,
    "Números de clientes conectados": websocketServer.engine.clientsCount,
  });*/
  const products = await newProductManager.showDataBase();
  websocketServer.emit("showProducts", products);

  socket.on("addProductFromView", async (productToAdd) => {
    const productAdd = await newProductManager.addProduct(productToAdd);
    const products = await newProductManager.showDataBase();
    if (productAdd.messaje === "Se agregó correctamente el producto.") {
      websocketServer.emit("showProducts", products);
    } else {
      websocketServer.emit("error", productAdd.messaje);
    }
  });
  socket.on("deleteProductFromView", async (productId) => {
    const deleteProduct = await newProductManager.deleteProduct(productId);
    const products = await newProductManager.showDataBase();
    if (deleteProduct.messaje === "Se borro el producto con éxito") {
      websocketServer.emit("showProducts", products);
    } else {
      websocketServer.emit("error", deleteProduct.messaje);
    }
  });
  socket.on("refreshPage", async (page) => {
    const products = await newProductManager.showDataBase(undefined, page);
    websocketServer.emit("showProducts", products);
  });
  socket.on("addProductInCart", async (productId) => {
    const carts = await newCartManager.showDataBase();
    const numberOfCart = carts[0]._id.toString();
    const params = { idcart: numberOfCart, idproduct: productId };
    const result = await newCartManager.addProductInCart(params);
    if (result.status === "error") {
      websocketServer.emit("error", result.messaje);
    }
  });
});
