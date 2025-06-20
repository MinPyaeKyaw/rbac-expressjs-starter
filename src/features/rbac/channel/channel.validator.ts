import Joi from 'joi';

const validator = {
  select: {
    query: Joi.object({
      keyword: Joi.string().allow('').optional(),
      size: Joi.number().required(),
      page: Joi.number().required(),
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
    }),
  },
  createMany: {
    body: Joi.object({
      channels: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
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
