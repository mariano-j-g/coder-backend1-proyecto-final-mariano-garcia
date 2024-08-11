import mongoose, { Schema, model } from "mongoose";
const cartStructure = new Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "productDb",
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
});

const cartDb = model("cartDb", cartStructure);

export { cartDb };
