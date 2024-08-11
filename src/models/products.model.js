import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productStructure = new Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  stock: Number,
  category: String,
  thumbnails: Array,
});
productStructure.plugin(mongoosePaginate);
const productDb = model("productDb", productStructure);

export { productDb };
