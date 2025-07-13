import { NextFunction, Request, Response } from 'express';
import {
  cancelPaymentIntentService,
  confirmPaymentIntentService,
  createCustomerService,
  createPaymentIntentService,
  createPaymentMethodService,
  processRefundService,
  createStripeProductService,
  getStripeProductService,
  listStripeProductsService,
  updateStripeProductService,
  deleteStripeProductService,
  createStripePriceService,
  getStripePriceService,
  listStripePricesService,
  updateStripePriceService,
  createStripeProductForLocalProductService,
  createStripeSubscriptionService,
  getStripeSubscriptionService,
  listStripeSubscriptionsService,
  updateStripeSubscriptionService,
  cancelStripeSubscriptionService,
  createStripeInvoiceService,
  getStripeInvoiceService,
  listStripeInvoicesService,
  updateStripeInvoiceService,
  finalizeStripeInvoiceService,
  payStripeInvoiceService,
  voidStripeInvoiceService,
  sendStripeInvoiceService,
  createStripeInvoiceItemService,
  updateStripeInvoiceItemService,
  deleteStripeInvoiceItemService,
} from './payment.service';
import { responseData, AppError } from '../../utils/http';
import { handleStripeWebhookService } from './payment.service';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function createPaymentIntentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await createPaymentIntentService({
      amount: req.body.amount,
      currency: req.body.currency,
      paymentMethodTypes: req.body.paymentMethodTypes,
      description: req.body.description,
      metadata: req.body.metadata,
      userId: req.body.user.id,
      customerId: req.body.customerId,
    });

    responseData({
      res,
      status: 200,
      message: 'Payment method created successfully',
      data: {
        paymentIntent: result.paymentIntent,
      },
    });
  } catch (error: any) {
    next(error);
  }
}

export async function createPaymentMethodController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await createPaymentMethodService({
      type: req.body.type ? 'card' : 'link',
      card: req.body.card,
      billing_details: req.body.billing_details,
    });

    responseData({
      res,
      status: 200,
      message: 'Payment method created successfully',
      data: result.paymentMethod,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function confirmPaymentIntentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    const result = await confirmPaymentIntentService(
      paymentIntentId,
      paymentMethodId
    );

    responseData({
      res,
      status: 200,
      message: 'Payment intent confirmed successfully',
      data: {
        paymentIntent: result.paymentIntent,
      },
    });
  } catch (error: any) {
    next(error);
  }
}

export async function cancelPaymentIntentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { paymentIntentId } = req.params;

    const result = await cancelPaymentIntentService(paymentIntentId);

    responseData({
      res,
      status: 200,
      message: 'Payment intent canceled successfully',
      data: {
        paymentIntentId: result.paymentIntent,
      },
    });
  } catch (error: any) {
    next(error);
  }
}

export async function processRefundController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { paymentIntentId } = req.params;
    const { amount, reason } = req.body;

    const result = await processRefundService(paymentIntentId, amount, reason);

    responseData({
      res,
      status: 200,
      message: 'Refund processed successfully',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function createCustomerController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, name } = req.body;

    const customer = await createCustomerService(email, name);

    responseData({
      res,
      status: 200,
      message: 'Customer created successfully',
      data: {
        customerId: customer.id,
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (error: any) {
    next(error);
  }
}

// Stripe Product Controllers
export async function createStripeProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await createStripeProductService(req.body);

    responseData({
      res,
      status: 200,
      message: 'Stripe product created successfully',
      data: product,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getStripeProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;
    const product = await getStripeProductService(productId);

    responseData({
      res,
      status: 200,
      message: 'Stripe product retrieved successfully',
      data: product,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function listStripeProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { limit, startingAfter, endingBefore, active } = req.query;
    const products = await listStripeProductsService({
      limit: limit ? parseInt(limit as string) : undefined,
      startingAfter: startingAfter as string,
      endingBefore: endingBefore as string,
      active: active === 'true',
    });

    responseData({
      res,
      status: 200,
      message: 'Stripe products retrieved successfully',
      data: products,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function updateStripeProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;
    const product = await updateStripeProductService(productId, req.body);

    responseData({
      res,
      status: 200,
      message: 'Stripe product updated successfully',
      data: product,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function deleteStripeProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;
    const product = await deleteStripeProductService(productId);

    responseData({
      res,
      status: 200,
      message: 'Stripe product deleted successfully',
      data: product,
    });
  } catch (error: any) {
    next(error);
  }
}

// Stripe Price Controllers
export async function createStripePriceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const price = await createStripePriceService(req.body);

    responseData({
      res,
      status: 200,
      message: 'Stripe price created successfully',
      data: price,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getStripePriceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { priceId } = req.params;
    const price = await getStripePriceService(priceId);

    responseData({
      res,
      status: 200,
      message: 'Stripe price retrieved successfully',
      data: price,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function listStripePricesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId, limit, startingAfter, endingBefore, active } = req.query;
    const prices = await listStripePricesService({
      productId: productId as string,
      limit: limit ? parseInt(limit as string) : undefined,
      startingAfter: startingAfter as string,
      endingBefore: endingBefore as string,
      active: active === 'true',
    });

    responseData({
      res,
      status: 200,
      message: 'Stripe prices retrieved successfully',
      data: prices,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function updateStripePriceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { priceId } = req.params;
    const price = await updateStripePriceService(priceId, req.body);

    responseData({
      res,
      status: 200,
      message: 'Stripe price updated successfully',
      data: price,
    });
  } catch (error: any) {
    next(error);
  }
}

// Integration controller for local products
export async function createStripeProductForLocalProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await createStripeProductForLocalProductService(req.body);

    responseData({
      res,
      status: 200,
      message: 'Stripe product created for local product successfully',
      data: {
        stripeProduct: result.stripeProduct,
        stripePrice: result.stripePrice,
      },
    });
  } catch (error: any) {
    next(error);
  }
}

// Stripe Subscription Controllers
export async function createStripeSubscriptionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const subscription = await createStripeSubscriptionService(req.body);
    responseData({
      res,
      status: 200,
      message: 'Stripe subscription created successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStripeSubscriptionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { subscriptionId } = req.params;
    const subscription = await getStripeSubscriptionService(subscriptionId);
    responseData({
      res,
      status: 200,
      message: 'Stripe subscription retrieved successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export async function listStripeSubscriptionsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { customerId, status, limit, startingAfter, endingBefore } =
      req.query;
    const subscriptions = await listStripeSubscriptionsService({
      customerId: customerId as string,
      status: status as string,
      limit: limit ? parseInt(limit as string) : undefined,
      startingAfter: startingAfter as string,
      endingBefore: endingBefore as string,
    });
    responseData({
      res,
      status: 200,
      message: 'Stripe subscriptions retrieved successfully',
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStripeSubscriptionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { subscriptionId } = req.params;
    const subscription = await updateStripeSubscriptionService(
      subscriptionId,
      req.body
    );
    responseData({
      res,
      status: 200,
      message: 'Stripe subscription updated successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelStripeSubscriptionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { subscriptionId } = req.params;
    const subscription = await cancelStripeSubscriptionService(subscriptionId);
    responseData({
      res,
      status: 200,
      message: 'Stripe subscription canceled successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
}

// Stripe Invoice Controllers
export async function createStripeInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const invoice = await createStripeInvoiceService(req.body);
    responseData({
      res,
      status: 200,
      message: 'Stripe invoice created successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStripeInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { invoiceId } = req.params;
    const invoice = await getStripeInvoiceService(invoiceId);
    responseData({
      res,
      status: 200,
      message: 'Stripe invoice retrieved successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
}

export async function listStripeInvoicesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      customerId,
      subscriptionId,
      status,
      limit,
      startingAfter,
      endingBefore,
    } = req.query;
    const invoices = await listStripeInvoicesService({
      customerId: customerId as string,
      subscriptionId: subscriptionId as string,
      status: status as string,
      limit: limit ? parseInt(limit as string) : undefined,
      startingAfter: startingAfter as string,
      endingBefore: endingBefore as string,
    });
    responseData({
      res,
      status: 200,
      message: 'Stripe invoices retrieved successfully',
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStripeInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { invoiceId } = req.params;
    const invoice = await updateStripeInvoiceService(invoiceId, req.body);
    responseData({
      res,
      status: 200,
      message: 'Stripe invoice updated successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
}

export async function finalizeStripeInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { invoiceId } = req.params;
    const invoice = await finalizeStripeInvoiceService(invoiceId);
    responseData({
      res,
      status: 200,
      message: 'Stripe invoice finalized successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
}

export async function payStripeInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { invoiceId } = req.params;
    const invoice = await payStripeInvoiceService(invoiceId);
    responseData({
      res,
      status: 200,
      message: 'Stripe invoice paid successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
}

export async function voidStripeInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { invoiceId } = req.params;
    const invoice = await voidStripeInvoiceService(invoiceId);
    responseData({
      res,
      status: 200,
      message: 'Stripe invoice voided successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendStripeInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { invoiceId } = req.params;
    const invoice = await sendStripeInvoiceService(invoiceId);
    responseData({
      res,
      status: 200,
      message: 'Stripe invoice sent successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
}

// Stripe Invoice Item Controllers
export async function createStripeInvoiceItemController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const invoiceItem = await createStripeInvoiceItemService(req.body);
    responseData({
      res,
      status: 200,
      message: 'Stripe invoice item created successfully',
      data: invoiceItem,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStripeInvoiceItemController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { itemId } = req.params;
    const invoiceItem = await updateStripeInvoiceItemService(itemId, req.body);
    responseData({
      res,
      status: 200,
      message: 'Stripe invoice item updated successfully',
      data: invoiceItem,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteStripeInvoiceItemController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { itemId } = req.params;
    const invoiceItem = await deleteStripeInvoiceItemService(itemId);
    responseData({
      res,
      status: 200,
      message: 'Stripe invoice item deleted successfully',
      data: invoiceItem,
    });
  } catch (error) {
    next(error);
  }
}

// Stripe Webhook Controller
export async function handleStripeWebhookController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      throw new AppError('Webhook secret not configured', 500);
    }

    let event: any;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      throw new AppError('Invalid webhook signature', 400);
    }

    // Process the webhook event
    const result = await handleStripeWebhookService(event);

    res.status(200).json({
      success: true,
      message: result.message,
      eventType: result.eventType,
    });
  } catch (error: any) {
    console.error('Webhook processing error:', error);

    if (error instanceof AppError) {
      res.status(Number(error.status)).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
