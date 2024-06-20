import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    title: { type: "string", required: true },

    // this field store reference to user who has created this category
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || model("Category", CategorySchema);

export default Category;
