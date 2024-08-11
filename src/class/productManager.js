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
      messaje: "No se pudo acceder a la base de datos",
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
        messaje: "No se pudo acceder a la base de datos",
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
          messaje:
            "Se realizo la busqueda y no se encontró ningun producto en la base de datos",
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
        messaje:
          "El producto con el id:" +
          productId +
          " no se encuentra en la base de datos",
      };
    }
  }
  async addProduct(body) {
    const { title, description, code, price, stock, category } = body;
    if (title && description && code && price && stock && category) {
      if (typeof title !== "string") {
        return {
          status: "error",
          messaje: "El campo title debe ser un texto (string)",
        };
      }
      if (typeof description !== "string") {
        return {
          status: "error",
          messaje: "El campo description debe ser un texto (string)",
        };
      }
      if (typeof code !== "string") {
        return {
          status: "error",
          messaje: "El campo code debe ser un texto (string)",
        };
      }
      if (typeof price !== "number") {
        return {
          status: "error",
          messaje: "El campo price debe ser un número (Number)",
        };
      }
      if (typeof stock !== "number") {
        return {
          status: "error",
          messaje: "El campo stock debe ser un número (Number)",
        };
      }
      if (typeof category !== "string") {
        return {
          status: "error",
          messaje: "El campo category debe ser un texto (string)",
        };
      }
      if (body.thumbnails) {
        if (!Array.isArray(body.thumbnails)) {
          return {
            status: "error",
            messaje:
              "El campo thumbnails debe ser un arreglo de strings (array)",
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
        messaje: "Se agregó correctamente el producto.",
      };
    } else {
      return {
        messaje: "Es requisito que complete todos los campos",
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
            messaje: "El campo title debe ser un texto (string)",
          };
        }
        if (typeof description !== "string") {
          return {
            status: "error",
            messaje: "El campo description debe ser un texto (string)",
          };
        }
        if (typeof code !== "string") {
          return {
            status: "error",
            messaje: "El campo code debe ser un texto (string)",
          };
        }
        if (typeof price !== "number") {
          return {
            status: "error",
            messaje: "El campo price debe ser un número (Number)",
          };
        }
        if (typeof stock !== "number") {
          return {
            status: "error",
            messaje: "El campo stock debe ser un número (Number)",
          };
        }
        if (typeof category !== "string") {
          return {
            status: "error",
            messaje: "El campo category debe ser un texto (string)",
          };
        }
        if (body.thumbnails) {
          if (!Array.isArray(body.thumbnails)) {
            return {
              status: "error",
              messaje:
                "El campo thumbnails debe ser un arreglo de strings (array)",
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
            messaje: "Se modificó correctamente el producto.",
          };
        } catch {
          return {
            status: "error",
            messaje: "Error al querer modificar un producto",
          };
        }
      }
    }
    return {
      status: "error",
      messaje:
        "El producto a modificar con el id:" +
        productId +
        " no se encuentra en la base de datos",
    };
  }
  async deleteProduct(productId) {
    try {
      await productDb.deleteOne({ _id: productId });
      return { status: "succes", messaje: "Se borro el producto con éxito" };
    } catch {
      return {
        status: "error",
        messaje:
          "El producto con el id: " +
          productId +
          " no se encuentra en la base de datos",
      };
    }
  }
}

export { ProductManager };
