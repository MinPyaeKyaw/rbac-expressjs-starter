import Joi from 'joi';

export const validator = {
  /**
   * Validate create payment intent request
   */
  createPaymentIntent: {
    body: Joi.object({
      amount: Joi.number().positive().required().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be positive',
        'any.required': 'Amount is required',
      }),
      currency: Joi.string().lowercase().default('usd').messages({
        'string.base': 'Currency must be a string',
      }),
      paymentMethodTypes: Joi.array()
        .items(Joi.string())
        .default(['card'])
        .messages({
          'array.base': 'Payment method types must be an array',
        }),
      description: Joi.string().optional().messages({
        'string.base': 'Description must be a string',
      }),
      metadata: Joi.object().optional().messages({
        'object.base': 'Metadata must be an object',
      }),
      customerId: Joi.string().optional().messages({
        'string.base': 'Customer ID must be a string',
      }),
    }),
  },

  /**
   * Validate confirm payment intent request
   */
  confirmPaymentIntent: {
    body: Joi.object({
      paymentIntentId: Joi.string().required().messages({
        'string.base': 'Payment intent ID must be a string',
        'any.required': 'Payment intent ID is required',
      }),
      paymentMethodId: Joi.string().optional().messages({
        'string.base': 'Payment method ID must be a string',
      }),
    }),
  },

  /**
   * Validate payment intent ID parameter
   */
  paymentIntentId: {
    params: Joi.object({
      paymentIntentId: Joi.string().required().messages({
        'string.base': 'Payment intent ID must be a string',
        'any.required': 'Payment intent ID is required',
      }),
    }),
  },

  /**
   * Validate refund request
   */
  processRefund: {
    params: Joi.object({
      paymentIntentId: Joi.string().required().messages({
        'string.base': 'Payment intent ID must be a string',
        'any.required': 'Payment intent ID is required',
      }),
    }),
    body: Joi.object({
      amount: Joi.number().positive().optional().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be positive',
      }),
      reason: Joi.string()
        .valid('duplicate', 'fraudulent', 'requested_by_customer')
        .optional()
        .messages({
          'string.base': 'Reason must be a string',
          'any.only':
            'Reason must be one of: duplicate, fraudulent, requested_by_customer',
        }),
    }),
  },

  /**
   * Validate user payments query parameters
   */
  getUserPayments: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must be at most 100',
    }),
    offset: Joi.number().integer().min(0).default(0).messages({
      'number.base': 'Offset must be a number',
      'number.integer': 'Offset must be an integer',
      'number.min': 'Offset must be at least 0',
    }),
  }),

  /**
   * Validate create customer request
   */
  createCustomer: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
      }),
      name: Joi.string().optional().messages({
        'string.base': 'Name must be a string',
      }),
    }),
  },

  /**
   * Validate customer ID parameter
   */
  customerId: Joi.object({
    customerId: Joi.string().required().messages({
      'string.base': 'Customer ID must be a string',
      'any.required': 'Customer ID is required',
    }),
  }),

  /**
   * Validate create Stripe product request
   */
  createStripeProduct: {
    body: Joi.object({
      name: Joi.string().required().messages({
        'string.base': 'Product name must be a string',
        'any.required': 'Product name is required',
      }),
      description: Joi.string().optional().messages({
        'string.base': 'Description must be a string',
      }),
      active: Joi.boolean().optional().messages({
        'boolean.base': 'Active must be a boolean',
      }),
      metadata: Joi.object().optional().messages({
        'object.base': 'Metadata must be an object',
      }),
      images: Joi.array().items(Joi.string().uri()).optional().messages({
        'array.base': 'Images must be an array',
        'string.uri': 'Image URLs must be valid URIs',
      }),
      package_dimensions: Joi.object({
        height: Joi.number().positive().required(),
        length: Joi.number().positive().required(),
        weight: Joi.number().positive().required(),
        width: Joi.number().positive().required(),
      })
        .optional()
        .messages({
          'object.base': 'Package dimensions must be an object',
        }),
    }),
  },

  /**
   * Validate Stripe product ID parameter
   */
  stripeProductId: {
    params: Joi.object({
      productId: Joi.string().required().messages({
        'string.base': 'Product ID must be a string',
        'any.required': 'Product ID is required',
      }),
    }),
  },

  /**
   * Validate create Stripe price request
   */
  createStripePrice: {
    body: Joi.object({
      productId: Joi.string().required().messages({
        'string.base': 'Product ID must be a string',
        'any.required': 'Product ID is required',
      }),
      unitAmount: Joi.number().positive().required().messages({
        'number.base': 'Unit amount must be a number',
        'number.positive': 'Unit amount must be positive',
        'any.required': 'Unit amount is required',
      }),
      currency: Joi.string().lowercase().default('usd').messages({
        'string.base': 'Currency must be a string',
      }),
      recurring: Joi.object({
        interval: Joi.string().valid('day', 'week', 'month', 'year').required(),
        intervalCount: Joi.number().integer().positive().optional(),
      })
        .optional()
        .messages({
          'object.base': 'Recurring must be an object',
        }),
      active: Joi.boolean().optional().messages({
        'boolean.base': 'Active must be a boolean',
      }),
      metadata: Joi.object().optional().messages({
        'object.base': 'Metadata must be an object',
      }),
    }),
  },

  /**
   * Validate Stripe price ID parameter
   */
  stripePriceId: {
    params: Joi.object({
      priceId: Joi.string().required().messages({
        'string.base': 'Price ID must be a string',
        'any.required': 'Price ID is required',
      }),
    }),
  },

  /**
   * Validate create Stripe product for local product request
   */
  createStripeProductForLocalProduct: {
    body: Joi.object({
      localProductId: Joi.string().required().messages({
        'string.base': 'Local product ID must be a string',
        'any.required': 'Local product ID is required',
      }),
      name: Joi.string().required().messages({
        'string.base': 'Product name must be a string',
        'any.required': 'Product name is required',
      }),
      description: Joi.string().optional().messages({
        'string.base': 'Description must be a string',
      }),
      price: Joi.number().positive().required().messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be positive',
        'any.required': 'Price is required',
      }),
      currency: Joi.string().lowercase().default('usd').messages({
        'string.base': 'Currency must be a string',
      }),
      metadata: Joi.object().optional().messages({
        'object.base': 'Metadata must be an object',
      }),
    }),
  },

  /**
   * Validate create Stripe subscription request
   */
  createStripeSubscription: {
    body: Joi.object({
      customerId: Joi.string().required().messages({
        'string.base': 'Customer ID must be a string',
        'any.required': 'Customer ID is required',
      }),
      priceId: Joi.string().required().messages({
        'string.base': 'Price ID must be a string',
        'any.required': 'Price ID is required',
      }),
      trialPeriodDays: Joi.number().integer().min(0).optional().messages({
        'number.base': 'Trial period days must be a number',
        'number.integer': 'Trial period days must be an integer',
        'number.min': 'Trial period days must be at least 0',
      }),
      metadata: Joi.object().optional().messages({
        'object.base': 'Metadata must be an object',
      }),
      cancelAtPeriodEnd: Joi.boolean().optional().messages({
        'boolean.base': 'Cancel at period end must be a boolean',
      }),
    }),
  },

  /**
   * Validate update Stripe subscription request
   */
  updateStripeSubscription: {
    body: Joi.object({
      cancelAtPeriodEnd: Joi.boolean().optional().messages({
        'boolean.base': 'Cancel at period end must be a boolean',
      }),
      metadata: Joi.object().optional().messages({
        'object.base': 'Metadata must be an object',
      }),
      priceId: Joi.string().optional().messages({
        'string.base': 'Price ID must be a string',
      }),
    }),
  },

  /**
   * Validate Stripe subscription ID parameter
   */
  stripeSubscriptionId: {
    params: Joi.object({
      subscriptionId: Joi.string().required().messages({
        'string.base': 'Subscription ID must be a string',
        'any.required': 'Subscription ID is required',
      }),
    }),
  },

  /**
   * Validate create Stripe invoice request
   */
  createStripeInvoice: {
    body: Joi.object({
      customerId: Joi.string().required().messages({
        'string.base': 'Customer ID must be a string',
        'any.required': 'Customer ID is required',
      }),
      subscriptionId: Joi.string().optional().messages({
        'string.base': 'Subscription ID must be a string',
      }),
      description: Joi.string().optional().messages({
        'string.base': 'Description must be a string',
      }),
      metadata: Joi.object().optional().messages({
        'object.base': 'Metadata must be an object',
      }),
      dueDate: Joi.number().integer().min(0).optional().messages({
        'number.base': 'Due date must be a number',
        'number.integer': 'Due date must be an integer',
        'number.min': 'Due date must be at least 0',
      }),
      autoAdvance: Joi.boolean().optional().messages({
        'boolean.base': 'Auto advance must be a boolean',
      }),
    }),
  },

  /**
   * Validate update Stripe invoice request
   */
  updateStripeInvoice: {
    body: Joi.object({
      description: Joi.string().optional().messages({
        'string.base': 'Description must be a string',
      }),
      metadata: Joi.object().optional().messages({
        'object.base': 'Metadata must be an object',
      }),
      dueDate: Joi.number().integer().min(0).optional().messages({
        'number.base': 'Due date must be a number',
        'number.integer': 'Due date must be an integer',
        'number.min': 'Due date must be at least 0',
      }),
      autoAdvance: Joi.boolean().optional().messages({
        'boolean.base': 'Auto advance must be a boolean',
      }),
    }),
  },

  /**
   * Validate Stripe invoice ID parameter
   */
  stripeInvoiceId: {
    params: Joi.object({
      invoiceId: Joi.string().required().messages({
        'string.base': 'Invoice ID must be a string',
        'any.required': 'Invoice ID is required',
      }),
    }),
  },

  /**
   * Validate create Stripe invoice item request
   */
  createStripeInvoiceItem: {
    body: Joi.object({
      customerId: Joi.string().required().messages({
        'string.base': 'Customer ID must be a string',
        'any.required': 'Customer ID is required',
      }),
      invoiceId: Joi.string().optional().messages({
        'string.base': 'Invoice ID must be a string',
      }),
      priceId: Joi.string().optional().messages({
        'string.base': 'Price ID must be a string',
      }),
      amount: Joi.number().positive().optional().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be positive',
      }),
      currency: Joi.string().lowercase().default('usd').messages({
        'string.base': 'Currency must be a string',
      }),
      description: Joi.string().optional().messages({
        'string.base': 'Description must be a string',
      }),
      quantity: Joi.number().positive().optional().messages({
        'number.base': 'Quantity must be a number',
        'number.positive': 'Quantity must be positive',
      }),
      metadata: Joi.object().optional().messages({
        'object.base': 'Metadata must be an object',
      }),
    }),
  },

  /**
   * Validate update Stripe invoice item request
   */
  updateStripeInvoiceItem: {
    body: Joi.object({
      amount: Joi.number().positive().optional().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be positive',
      }),
      description: Joi.string().optional().messages({
        'string.base': 'Description must be a string',
      }),
      quantity: Joi.number().positive().optional().messages({
        'number.base': 'Quantity must be a number',
        'number.positive': 'Quantity must be positive',
      }),
      metadata: Joi.object().optional().messages({
        'object.base': 'Metadata must be an object',
      }),
    }),
  },

  /**
   * Validate Stripe invoice item ID parameter
   */
  stripeInvoiceItemId: {
    params: Joi.object({
      itemId: Joi.string().required().messages({
        'string.base': 'Invoice item ID must be a string',
        'any.required': 'Invoice item ID is required',
      }),
    }),
  },
};

// Webhook validation (minimal validation since Stripe handles the main validation)
export const webhookValidation = {
  body: Joi.object({
    // Stripe webhook events have a specific structure
    id: Joi.string().required(),
    type: Joi.string().required(),
    data: Joi.object({
      object: Joi.any().required(),
    }).required(),
    created: Joi.number().required(),
  }).unknown(true), // Allow additional properties from Stripe
};
