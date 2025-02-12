import Joi from "joi";

const schema = {
  createCategory: {
    name: Joi.string().required().min(2).max(255),
    description: Joi.string().min(10).optional(),
  },
  updateCategory: {
    name: Joi.string().min(2).max(255),
    description: Joi.string().min(10),
  },

};

export default schema;
