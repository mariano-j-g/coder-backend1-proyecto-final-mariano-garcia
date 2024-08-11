import { Router } from "express";
import { CartManager } from "../class/cartManager.js";

const newCartManager = new CartManager();
const router = Router();

router.get("/", async (req, res) => {
  const cartsInDatabase = await newCartManager.showDataBase();
  res.render("allCartView", { cartsInDatabase });
});

router.get("/:cartId", async (req, res) => {
  const cartId = req.params.cartId;
  const cart = await newCartManager.getCartById(cartId);
  res.render("cartView", { cart });
});

export default router;
