import { Router } from "express";
import { ProductManager } from "../class/productManager.js";
const router = Router();
const newProductManager = new ProductManager();
router.get("/", async (req, res) => {
  const { limit, page, sort, category } = req.query;
  const products = await newProductManager.getProducts(
    limit,
    page,
    sort,
    category
  );
  return res.json(products);
});
router.get("/:productId", async (req, res) => {
  const productId = req.params.productId;
  const productFinded = await newProductManager.getProductById(productId);
  res.json(productFinded);
});
router.post("/", async (req, res) => {
  const body = req.body;
  const addProduct = await newProductManager.addProduct(body);
  res.json(addProduct);
});
router.put("/:productId", async (req, res) => {
  const body = req.body;
  const productId = req.params.productId;
  const modifyProduct = await newProductManager.modifyProduct(productId, body);
  res.json(modifyProduct);
});
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  const deleteProduct = await newProductManager.deleteProduct(productId);
  res.json(deleteProduct);
});

export default router;
