import { cartDb } from "../models/carts.model.js";
class CartManager {
  constructor() {}
  async showDataBase() {
    const cartInDataBase = await cartDb
      .find()
      .populate("products.product")
      .lean();
    return cartInDataBase;
  }

  async cartsInDatabase() {
    const cartsInDatabase = await this.showDataBase();
    if (cartsInDatabase.length) {
      return cartsInDatabase;
    } else
      return {
        messaje:
          "Se realizo la busqueda y no se encontró ningun carrito en la base de datos",
      };
  }
  async addCart() {
    await cartDb.create({ products: [] });
    return { messaje: "Se agregó correctamente el nuevo carrito." };
  }
  async getCartById(cartId) {
    try {
      const cartFinded = await cartDb
        .findById(cartId)
        .populate("products.product")
        .lean();
      if (cartFinded.products.length) {
        return cartFinded.products;
      }
      return {
        message:
          "Este carrito aun no tiene productos cargados dentro del mismo",
      };
    } catch {
      return {
        message:
          "El carrito con el id:" + cartId + " no existe en la base de datos",
      };
    }
  }
  async addProductInCart(params) {
    const cartsInDatabase = await this.showDataBase();
    const cartFinded = cartsInDatabase.find(
      (item) => item._id == params.idcart
    );
    if (cartFinded) {
      const productExistInCart = cartFinded.products.find(
        (item) => item.product._id == params.idproduct
      );
      if (productExistInCart) {
        productExistInCart.quantity = productExistInCart.quantity + 1;
        await cartDb.updateOne({ _id: params.idcart }, cartFinded);
        return {
          messaje:
            "Se agregó una unidad mas del producto con id:" +
            params.idproduct +
            " al carrito con id:" +
            params.idcart,
        };
      } else {
        const productInCart = {
          product: params.idproduct,
          quantity: 1,
        };
        cartFinded.products.push(productInCart);
        try {
          await cartDb.updateOne({ _id: params.idcart }, cartFinded);
          return {
            messaje:
              "Se agregó el producto con id:" +
              params.idproduct +
              " al carrito con id:" +
              params.idcart,
          };
        } catch {
          return {
            status: "error",
            messaje: "Problemas al agregar el producto en el carrito",
          };
        }
      }
    } else {
      return {
        status: "error",
        messaje: "Ese carrito no se encuentra en la base de datos",
      };
    }
  }
  async clearCart(idcart) {
    try {
      const cartFinded = await cartDb.findById(idcart);
      cartFinded.products = [];
      try {
        await cartDb.updateOne({ _id: idcart }, cartFinded);
        return {
          message:
            "Se han quitado todos los productos del carrito con el id:" +
            idcart,
        };
      } catch {
        return {
          message:
            "Este carrito no tiene productos cargados para ser eliminados del mismo",
        };
      }
    } catch {
      return {
        message:
          "El carrito con el id:" + idcart + " no existe en la base de datos",
      };
    }
  }

  async deleteOneProductFronCart(params) {
    const cartsInDatabase = await this.showDataBase();
    const cartFinded = cartsInDatabase.find(
      (item) => item._id == params.idcart
    );
    if (cartFinded) {
      const productExistInCart = cartFinded.products.filter(
        (product) => product.product !== params.idproduct
      );
      const cartModificated = { ...cartFinded, products: productExistInCart };
      await cartDb.updateOne({ _id: params.idcart }, cartModificated);
      return {
        messaje:
          "Se eliminaron todas las unidades del producto con id:" +
          params.idproduct +
          " del carrito con id:" +
          params.idcart,
      };
    } else {
      return {
        messaje: "Ese carrito no existe",
      };
    }
  }
  async modificateQuantityProductFromCart(params, body) {
    const cartsInDatabase = await this.showDataBase();
    const cartFinded = cartsInDatabase.find(
      (item) => item._id == params.idcart
    );
    if (cartFinded) {
      const productExistInCart = cartFinded.products.find(
        (item) => item.product._id == params.idproduct
      );
      if (productExistInCart) {
        productExistInCart.quantity = body.quantity;
        await cartDb.updateOne({ _id: params.idcart }, cartFinded);
        return {
          messaje: "Se modifico el quantity del producto",
        };
      } else {
        return {
          messaje:
            "Ese producto aun no existe en este carrito, por lo tanto no podes cambiar la cantidad",
        };
      }
    } else {
      return { messaje: "Ese carrito no existe" };
    }
  }

  async modificateCart(params, body) {
    const cartsInDatabase = await this.showDataBase();
    const cartFinded = cartsInDatabase.find(
      (item) => item._id == params.idcart
    );
    if (cartFinded) {
      const cartModificated = { ...cartFinded, products: body };
      await cartDb.updateOne({ _id: params.idcart }, cartModificated);
      return {
        messaje:
          "Se cambiaron todos los productos del carrito, por el arreglo de productos enviado por body",
      };
    } else {
      return { messaje: "Ese carrito no existe" };
    }
  }
}
export { CartManager };
