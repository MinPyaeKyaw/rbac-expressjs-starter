import Joi from 'joi';

const validator = {
  select: {
    query: Joi.object({
      keyword: Joi.string().allow('').optional(),
      size: Joi.number().optional(),
      page: Joi.number().optional(),
      sort: Joi.string().optional(),
      order: Joi.string().valid('asc', 'desc').optional(),
    }),
  },
  detail: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  create: {
    body: Joi.object({
      name: Joi.string().required(),
      category_id: Joi.string().required(),
      price: Joi.number().required(),
    }),
  },
  createMany: {
    body: Joi.object({
      products: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          category_id: Joi.string().required(),
          price: Joi.number().required(),
        })
      ),
    }),
  },
  update: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      category_id: Joi.string().required(),
    }),
  },
  delete: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  deleteMany: {
    body: Joi.object({
      ids: Joi.array().items(Joi.string().required()),
    }),
  },
} as const;

export default validator;
