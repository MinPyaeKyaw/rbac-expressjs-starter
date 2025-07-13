import { Router } from 'express';
import {
  cancelPaymentIntentController,
  confirmPaymentIntentController,
  createCustomerController,
  createPaymentIntentController,
  createPaymentMethodController,
  processRefundController,
  createStripeProductController,
  getStripeProductController,
  listStripeProductsController,
  updateStripeProductController,
  deleteStripeProductController,
  createStripePriceController,
  getStripePriceController,
  listStripePricesController,
  updateStripePriceController,
  createStripeProductForLocalProductController,
  createStripeSubscriptionController,
  getStripeSubscriptionController,
  listStripeSubscriptionsController,
  updateStripeSubscriptionController,
  cancelStripeSubscriptionController,
  createStripeInvoiceController,
  getStripeInvoiceController,
  listStripeInvoicesController,
  updateStripeInvoiceController,
  finalizeStripeInvoiceController,
  payStripeInvoiceController,
  voidStripeInvoiceController,
  sendStripeInvoiceController,
  createStripeInvoiceItemController,
  updateStripeInvoiceItemController,
  deleteStripeInvoiceItemController,
  handleStripeWebhookController,
} from './payment.controller';
import { validator } from './payment.validator';
import { validateRequest } from '../../middlewares/validation';

const router = Router();

router.post(
  '/payments/create-intent',
  validateRequest(validator.createPaymentIntent),
  createPaymentIntentController
);

router.post(
  '/payments/create-method',
  // validateRequest({ body: validator.createPaymentIntent }),
  createPaymentMethodController
);

router.post(
  '/payments/confirm',
  validateRequest(validator.confirmPaymentIntent),
  confirmPaymentIntentController
);

router.post(
  '/payments/:paymentIntentId/cancel',
  validateRequest(validator.paymentIntentId),
  cancelPaymentIntentController
);

router.post(
  '/payments/:paymentIntentId/refund',
  validateRequest(validator.processRefund),
  processRefundController
);

router.post(
  '/payments/customer',
  validateRequest(validator.createCustomer),
  createCustomerController
);

// Stripe Product Routes
router.post(
  '/stripe/products',
  validateRequest(validator.createStripeProduct),
  createStripeProductController
);

router.get('/stripe/products', listStripeProductsController);

router.get(
  '/stripe/products/:productId',
  validateRequest(validator.stripeProductId),
  getStripeProductController
);

router.put(
  '/stripe/products/:productId',
  validateRequest(validator.stripeProductId),
  updateStripeProductController
);

router.delete(
  '/stripe/products/:productId',
  validateRequest(validator.stripeProductId),
  deleteStripeProductController
);

// Stripe Price Routes
router.post(
  '/stripe/prices',
  validateRequest(validator.createStripePrice),
  createStripePriceController
);

router.get('/stripe/prices', listStripePricesController);

router.get(
  '/stripe/prices/:priceId',
  validateRequest(validator.stripePriceId),
  getStripePriceController
);

router.put(
  '/stripe/prices/:priceId',
  validateRequest(validator.stripePriceId),
  updateStripePriceController
);

// Integration route for local products
router.post(
  '/stripe/products/local-product',
  validateRequest(validator.createStripeProductForLocalProduct),
  createStripeProductForLocalProductController
);

// Stripe Subscription Routes
router.post(
  '/stripe/subscriptions',
  validateRequest(validator.createStripeSubscription),
  createStripeSubscriptionController
);
router.get(
  '/stripe/subscriptions/:subscriptionId',
  validateRequest(validator.stripeSubscriptionId),
  getStripeSubscriptionController
);
router.get('/stripe/subscriptions', listStripeSubscriptionsController);
router.put(
  '/stripe/subscriptions/:subscriptionId',
  validateRequest(validator.stripeSubscriptionId),
  validateRequest(validator.updateStripeSubscription),
  updateStripeSubscriptionController
);
router.delete(
  '/stripe/subscriptions/:subscriptionId',
  validateRequest(validator.stripeSubscriptionId),
  cancelStripeSubscriptionController
);

// Stripe Invoice Routes
router.post(
  '/stripe/invoices',
  validateRequest(validator.createStripeInvoice),
  createStripeInvoiceController
);
router.get(
  '/stripe/invoices/:invoiceId',
  validateRequest(validator.stripeInvoiceId),
  getStripeInvoiceController
);
router.get('/stripe/invoices', listStripeInvoicesController);
router.put(
  '/stripe/invoices/:invoiceId',
  validateRequest(validator.stripeInvoiceId),
  validateRequest(validator.updateStripeInvoice),
  updateStripeInvoiceController
);
router.post(
  '/stripe/invoices/:invoiceId/finalize',
  validateRequest(validator.stripeInvoiceId),
  finalizeStripeInvoiceController
);
router.post(
  '/stripe/invoices/:invoiceId/pay',
  validateRequest(validator.stripeInvoiceId),
  payStripeInvoiceController
);
router.post(
  '/stripe/invoices/:invoiceId/void',
  validateRequest(validator.stripeInvoiceId),
  voidStripeInvoiceController
);
router.post(
  '/stripe/invoices/:invoiceId/send',
  validateRequest(validator.stripeInvoiceId),
  sendStripeInvoiceController
);

// Stripe Invoice Item Routes
router.post(
  '/stripe/invoice-items',
  validateRequest(validator.createStripeInvoiceItem),
  createStripeInvoiceItemController
);
router.put(
  '/stripe/invoice-items/:itemId',
  validateRequest(validator.stripeInvoiceItemId),
  validateRequest(validator.updateStripeInvoiceItem),
  updateStripeInvoiceItemController
);
router.delete(
  '/stripe/invoice-items/:itemId',
  validateRequest(validator.stripeInvoiceItemId),
  deleteStripeInvoiceItemController
);

// Webhook route (no validation middleware, raw body needed for signature verification)
router.post('/webhook', handleStripeWebhookController);

export default router;
