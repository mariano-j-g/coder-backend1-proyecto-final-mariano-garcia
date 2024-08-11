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
        messaje: "Carro inaxistente",
      };
  }
  async addCart() {
    await cartDb.create({ products: [] });
    return { messaje: "Nuevo carro agregado" };
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
        message: "Carro vacio",
      };
    } catch {
      return {
        message: "Carro id:" + cartId + " no existe",
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
            "Se agrego producto id:" +
            params.idproduct +
            " al carro id:" +
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
              "Se agrega producto id:" +
              params.idproduct +
              " al carro id:" +
              params.idcart,
          };
        } catch {
          return {
            status: "error",
            messaje: "no se pudo agregar producto",
          };
        }
      }
    } else {
      return {
        status: "error",
        messaje: "Carro inexistente",
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
          message: "Productos eliminados de carro id:" + idcart,
        };
      } catch {
        return {
          message: "Carro sin productos que eliminar",
        };
      }
    } catch {
      return {
        message: "Carro id:" + idcart + " no existe",
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
          "Unidades eliminadas del producto id:" +
          params.idproduct +
          " del carro id:" +
          params.idcart,
      };
    } else {
      return {
        messaje: "Carro no existe",
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
          messaje: "Producto no existe en este carro",
        };
      }
    } else {
      return { messaje: "carro inexistente" };
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
        messaje: "Productos del carro modificados",
      };
    } else {
      return { messaje: "Carro inexistente" };
    }
  }
}
export { CartManager };
