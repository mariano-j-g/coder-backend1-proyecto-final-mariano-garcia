import { Router } from "express";
import { ProductManager } from "../class/productManager.js";

const newProductManager = new ProductManager();
const router = Router();

router.get("/", (req, res) => {
  res.render("main");
});
router.get("/productNoWebsocket", async (req, res) => {
  const products = await newProductManager.getProductsNoWebSocket();

  res.render("home", { products });
});

export default router;
