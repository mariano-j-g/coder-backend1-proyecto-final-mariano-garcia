import { productDb } from "../models/products.model.js";
class ProductManager {
  constructor() {}
  async getProductsNoWebSocket() {
    try {
      const productsInDataBaseWithPaginate = await productDb.find().lean();
      return { status: "succes", payload: productsInDataBaseWithPaginate };
    } catch {}
    return {
      status: "error",
      messaje: "No se puede acceder",
    };
  }
  async showDataBase(limit = 10, page = 1, sort, category) {
    if (sort) {
      sort === "asc" ? (sort = { price: 1 }) : { price: -1 };
    } else {
      sort = {};
    }
    const queryCategory = category ? { category: category } : {};
    try {
      const productsInDataBaseWithPaginate = await productDb.paginate(
        queryCategory,
        { limit, page, sort }
      );

      return { status: "succes", payload: productsInDataBaseWithPaginate };
    } catch {
      return {
        status: "error",
        messaje: "No se puede acceder",
      };
    }
  }
  async getProducts(limit, page, sort, category) {
    const productsInDataBase = await this.showDataBase(
      limit,
      page,
      sort,
      category
    );
    if (productsInDataBase.status === "succes") {
      if (productsInDataBase.payload.docs.length) {
        return productsInDataBase;
      } else
        return {
          status: "error",
          messaje: "Busqueda sin resutados",
        };
    } else {
      return productsInDataBase;
    }
  }
  async getProductById(productId) {
    try {
      const productFinded = await productDb.findById(productId);
      return productFinded;
    } catch {
      return {
        status: "error",
        messaje: "Procucto id:" + productId + " no se encuentra",
      };
    }
  }
  async addProduct(body) {
    const { title, description, code, price, stock, category } = body;
    if (title && description && code && price && stock && category) {
      if (typeof title !== "string") {
        return {
          status: "error",
          messaje: "Debe ser texto",
        };
      }
      if (typeof description !== "string") {
        return {
          status: "error",
          messaje: "Debe ser texto",
        };
      }
      if (typeof code !== "string") {
        return {
          status: "error",
          messaje: "Debe ser texto",
        };
      }
      if (typeof price !== "number") {
        return {
          status: "error",
          messaje: "Debe ser un numero",
        };
      }
      if (typeof stock !== "number") {
        return {
          status: "error",
          messaje: "Debe ser un numero",
        };
      }
      if (typeof category !== "string") {
        return {
          status: "error",
          messaje: "Debe ser un texto",
        };
      }
      if (body.thumbnails) {
        if (!Array.isArray(body.thumbnails)) {
          return {
            status: "error",
            messaje: "Debe ser array",
          };
        }
      }
      const newProductWithId = {
        ...body,
        status: true,
      };
      await productDb.create(newProductWithId);

      return {
        status: "succes",
        messaje: "Producto agregado",
      };
    } else {
      return {
        messaje: "Completar todos los campos",
      };
    }
  }
  async modifyProduct(productId, body) {
    const productsInDataBase = await this.showDataBase();
    console.log(productsInDataBase);

    const result = productsInDataBase.payload.docs.find(
      (item) => item._id == productId
    );
    if (result) {
      const { title, description, code, price, stock, category } = body;
      if (title && description && code && price && stock && category) {
        if (typeof title !== "string") {
          return {
            status: "error",
            messaje: "Debe ser un texto",
          };
        }
        if (typeof description !== "string") {
          return {
            status: "error",
            messaje: "Debe sr un texto",
          };
        }
        if (typeof code !== "string") {
          return {
            status: "error",
            messaje: "Debe ser un texto",
          };
        }
        if (typeof price !== "number") {
          return {
            status: "error",
            messaje: "Debe ser un numero",
          };
        }
        if (typeof stock !== "number") {
          return {
            status: "error",
            messaje: "Este campo debe ser un numero",
          };
        }
        if (typeof category !== "string") {
          return {
            status: "error",
            messaje: "Este campo debe ser un texto",
          };
        }
        if (body.thumbnails) {
          if (!Array.isArray(body.thumbnails)) {
            return {
              status: "error",
              messaje: "debe ser un array",
            };
          }
        }
        if (body.status === false) {
          result.status = false;
        }
        if (body.thumbnails) {
          result.thumbnails = body.thumbnails;
        }
        try {
          await productDb.updateOne(
            { _id: productId },
            {
              $set: {
                title: title,
                description: description,
                code: code,
                price: price,
                stock: stock,
                category: category,
                status: result.status,
                thumbnails: result.thumbnails,
              },
            }
          );
          return {
            status: "succes",
            messaje: "Producto modificado.",
          };
        } catch {
          return {
            status: "error",
            messaje: "No se pudo modificar producto",
          };
        }
      }
    }
    return {
      status: "error",
      messaje: "El producto id:" + productId + " no se encuentra",
    };
  }
  async deleteProduct(productId) {
    try {
      await productDb.deleteOne({ _id: productId });
      return { status: "succes", messaje: "Producto eliminado" };
    } catch {
      return {
        status: "error",
        messaje: "Producto id: " + productId + " no se encuentra",
      };
    }
  }
}

export { ProductManager };
