import { Router } from "express";
import { CartManager } from "../class/cartManager.js";

const router = Router();
const newCartManager = new CartManager();
router.get("/", async (req, res) => {
  const cartsInDatabase = await newCartManager.cartsInDatabase();
  res.json(cartsInDatabase);
});
router.post("/", async (req, res) => {
  const addCart = await newCartManager.addCart();
  res.json(addCart);
});
router.get("/:id", async (req, res) => {
  const cartId = req.params.id;
  const getCartById = await newCartManager.getCartById(cartId);
  res.json(getCartById);
});
router.post("/:idcart/:idproduct", async (req, res) => {
  const params = req.params;
  const addProductInCart = await newCartManager.addProductInCart(params);
  res.json(addProductInCart);
});
router.delete("/:idcart", async (req, res) => {
  const idcart = req.params.idcart;
  const addProductInCart = await newCartManager.clearCart(idcart);
  res.json(addProductInCart);
});
router.delete("/:idcart/:idproduct", async (req, res) => {
  const params = req.params;
  const addProductInCart = await newCartManager.deleteOneProductFronCart(
    params
  );
  res.json(addProductInCart);
});
router.put("/:idcart", async (req, res) => {
  const params = req.params;
  const body = req.body;
  const addProductInCart = await newCartManager.modificateCart(params, body);
  res.json(addProductInCart);
});
router.put("/:idcart/:idproduct", async (req, res) => {
  const params = req.params;
  const body = req.body;
  const addProductInCart =
    await newCartManager.modificateQuantityProductFromCart(params, body);
  res.json(addProductInCart);
});

export default router;
