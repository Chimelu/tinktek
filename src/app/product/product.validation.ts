import Joi from "joi";

const schema = {
  createProduct: {
    id: Joi.string().uuid(),
    categoryId: Joi.string().uuid().required(),
    name: Joi.string().required().min(2).max(255),
    description: Joi.string().required().min(10),
    price: Joi.number().precision(2).positive().required(),
    stockQuantity: Joi.number().integer().min(0).default(0),
    images: Joi.array().items(Joi.string().uri()).min(1),
    shopId: Joi.string().uuid().required(),
  },

  // updateProduct: {
  //   vendorId: Joi.string().uuid(),
  //   categoryId: Joi.string().uuid(),
  //   name: Joi.string().min(2).max(255),
  //   description: Joi.string().min(10),
  //   price: Joi.number().precision(2).positive(),
  //   stockQuantity: Joi.number().integer().min(0),
  //   images: Joi.array().items(Joi.string().uri()).min(1),
  // },

  getProductById: {
    id: Joi.string().uuid().required(),
  },

  getProductsByVendor: {
    vendorId: Joi.string().uuid().required(),
  },

  getProductsByCategory: {
    categoryId: Joi.string().uuid().required(),
  },

  deleteProduct: {
    id: Joi.string().uuid().required(),
  },

  // Optional: For bulk operations
  bulkCreateProducts: {
    products: Joi.array()
      .items(
        Joi.object({
          vendorId: Joi.string().uuid().required(),
          categoryId: Joi.string().uuid().required(),
          name: Joi.string().required().min(2).max(255),
          description: Joi.string().required().min(10),
          price: Joi.number().precision(2).positive().required(),
          stockQuantity: Joi.number().integer().min(0).default(0),
          images: Joi.array().items(Joi.string().uri()).min(1).required(),
        })
      )
      .min(1)
      .required(),
  },

  // Optional: For filtering/searching products
  queryProducts: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string()
      .valid("price", "createdAt", "name")
      .default("createdAt"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    categoryId: Joi.string().uuid(),
    vendorId: Joi.string().uuid(),
    searchTerm: Joi.string().min(2),
    inStock: Joi.boolean(),
  },
};

export default schema;
