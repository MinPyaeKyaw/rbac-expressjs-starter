import Stripe from 'stripe';
import { AppError } from '../../utils/http';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function createPaymentIntentService(data: {
  amount: number;
  currency: string;
  paymentMethodTypes: string[];
  description?: string;
  metadata?: Record<string, string>;
  userId?: string;
  customerId?: string;
}): Promise<{
  paymentIntent: Stripe.PaymentIntent;
}> {
  try {
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      // payment_method_types: data.paymentMethodTypes,
      description: data.description,
      metadata: {
        ...data.metadata,
        userId: data.userId || '',
      },
      customer: data.customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return { paymentIntent };
  } catch (error: any) {
    throw new AppError(
      `Failed to create payment intent: ${error.message}`,
      400
    );
  }
}

export async function createPaymentMethodService(data: {
  type: 'card' | 'link'; // 'card'
  card?: { number: string; exp_month: number; exp_year: number; cvc: string }; // { number, exp_month, exp_year, cvc }
  billing_details?: { name: string; email: string; phone: string }; // optional
}): Promise<{
  paymentMethod: Stripe.PaymentMethod;
}> {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: data.type, // 'card'
      card: data.card, // { number, exp_month, exp_year, cvc }
      billing_details: data.billing_details, // optional
    });

    return { paymentMethod };
  } catch (error: any) {
    throw new AppError(
      `Failed to create payment method: ${error.message}`,
      400
    );
  }
}

export async function confirmPaymentIntentService(
  paymentIntentId: string,
  paymentMethodId?: string
): Promise<{ paymentIntent: Stripe.PaymentIntent }> {
  try {
    // Confirm payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    // Get the latest payment intent to access charges
    const updatedPaymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ['charges'],
      }
    );

    return { paymentIntent };
  } catch (error: any) {
    throw new AppError(
      `Failed to confirm payment intent: ${error.message}`,
      400
    );
  }
}

export async function cancelPaymentIntentService(
  paymentIntentId: string
): Promise<{
  paymentIntent: Stripe.PaymentIntent;
}> {
  try {
    // Cancel payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

    return { paymentIntent };
  } catch (error: any) {
    throw new AppError(
      `Failed to cancel payment intent: ${error.message}`,
      400
    );
  }
}

export async function processRefundService(
  paymentIntentId: string,
  amount?: number,
  reason?: string
): Promise<{ refund: Stripe.Refund }> {
  try {
    // Get payment intent to verify it exists and is succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new AppError('Payment must be succeeded to process refund', 400);
    }

    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
      reason: reason as any,
    });

    return { refund };
  } catch (error: any) {
    throw new AppError(`Failed to process refund: ${error.message}`, 400);
  }
}

export async function createCustomerService(
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  try {
    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });

    return customer;
  } catch (error: any) {
    throw new AppError(
      `Failed to create or get customer: ${error.message}`,
      400
    );
  }
}

// Stripe Product Interfaces
export interface CreateStripeProductData {
  name: string;
  description?: string;
  active?: boolean;
  metadata?: Record<string, string>;
  images?: string[];
  package_dimensions?: {
    height: number;
    length: number;
    weight: number;
    width: number;
  };
}

export interface CreateStripePriceData {
  productId: string;
  unitAmount: number;
  currency: string;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    intervalCount?: number;
  };
  active?: boolean;
  metadata?: Record<string, string>;
}

// Stripe Product Services
export async function createStripeProductService(
  data: CreateStripeProductData
): Promise<Stripe.Product> {
  try {
    const product = await stripe.products.create({
      name: data.name,
      description: data.description,
      active: data.active ?? true,
      metadata: data.metadata,
      images: data.images,
      package_dimensions: data.package_dimensions,
    });

    return product;
  } catch (error: any) {
    throw new AppError(
      `Failed to create Stripe product: ${error.message}`,
      400
    );
  }
}

export async function getStripeProductService(
  productId: string
): Promise<Stripe.Product> {
  try {
    const product = await stripe.products.retrieve(productId);
    return product;
  } catch (error: any) {
    throw new AppError(
      `Failed to retrieve Stripe product: ${error.message}`,
      400
    );
  }
}

export async function listStripeProductsService(
  params: {
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
    active?: boolean;
  } = {}
): Promise<Stripe.ApiList<Stripe.Product>> {
  try {
    const products = await stripe.products.list({
      limit: params.limit || 10,
      starting_after: params.startingAfter,
      ending_before: params.endingBefore,
      active: params.active,
    });

    return products;
  } catch (error: any) {
    throw new AppError(`Failed to list Stripe products: ${error.message}`, 400);
  }
}

export async function updateStripeProductService(
  productId: string,
  data: Partial<CreateStripeProductData>
): Promise<Stripe.Product> {
  try {
    const product = await stripe.products.update(productId, {
      name: data.name,
      description: data.description,
      active: data.active,
      metadata: data.metadata,
      images: data.images,
      package_dimensions: data.package_dimensions,
    });

    return product;
  } catch (error: any) {
    throw new AppError(
      `Failed to update Stripe product: ${error.message}`,
      400
    );
  }
}

export async function deleteStripeProductService(
  productId: string
): Promise<Stripe.DeletedProduct> {
  try {
    const product = await stripe.products.del(productId);
    return product;
  } catch (error: any) {
    throw new AppError(
      `Failed to delete Stripe product: ${error.message}`,
      400
    );
  }
}

// Stripe Price Services
export async function createStripePriceService(
  data: CreateStripePriceData
): Promise<Stripe.Price> {
  try {
    const priceData: Stripe.PriceCreateParams = {
      product: data.productId,
      unit_amount: data.unitAmount,
      currency: data.currency,
      active: data.active ?? true,
      metadata: data.metadata,
    };

    if (data.recurring) {
      priceData.recurring = {
        interval: data.recurring.interval,
        interval_count: data.recurring.intervalCount,
      };
    }

    const price = await stripe.prices.create(priceData);
    return price;
  } catch (error: any) {
    throw new AppError(`Failed to create Stripe price: ${error.message}`, 400);
  }
}

export async function getStripePriceService(
  priceId: string
): Promise<Stripe.Price> {
  try {
    const price = await stripe.prices.retrieve(priceId);
    return price;
  } catch (error: any) {
    throw new AppError(
      `Failed to retrieve Stripe price: ${error.message}`,
      400
    );
  }
}

export async function listStripePricesService(
  params: {
    productId?: string;
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
    active?: boolean;
  } = {}
): Promise<Stripe.ApiList<Stripe.Price>> {
  try {
    const prices = await stripe.prices.list({
      product: params.productId,
      limit: params.limit || 10,
      starting_after: params.startingAfter,
      ending_before: params.endingBefore,
      active: params.active,
    });

    return prices;
  } catch (error: any) {
    throw new AppError(`Failed to list Stripe prices: ${error.message}`, 400);
  }
}

export async function updateStripePriceService(
  priceId: string,
  data: {
    active?: boolean;
    metadata?: Record<string, string>;
  }
): Promise<Stripe.Price> {
  try {
    const price = await stripe.prices.update(priceId, {
      active: data.active,
      metadata: data.metadata,
    });

    return price;
  } catch (error: any) {
    throw new AppError(`Failed to update Stripe price: ${error.message}`, 400);
  }
}

// Integration service to link local products with Stripe products
export async function createStripeProductForLocalProductService(data: {
  localProductId: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  metadata?: Record<string, string>;
}): Promise<{
  stripeProduct: Stripe.Product;
  stripePrice: Stripe.Price;
}> {
  try {
    // Create Stripe product
    const stripeProduct = await createStripeProductService({
      name: data.name,
      description: data.description,
      metadata: {
        ...data.metadata,
        localProductId: data.localProductId,
      },
    });

    // Create Stripe price for the product
    const stripePrice = await createStripePriceService({
      productId: stripeProduct.id,
      unitAmount: Math.round(data.price * 100), // Convert to cents
      currency: data.currency || 'usd',
      metadata: {
        localProductId: data.localProductId,
      },
    });

    return { stripeProduct, stripePrice };
  } catch (error: any) {
    throw new AppError(
      `Failed to create Stripe product for local product: ${error.message}`,
      400
    );
  }
}

// Stripe Subscription Services
export interface CreateStripeSubscriptionData {
  customerId: string;
  priceId: string;
  trialPeriodDays?: number;
  metadata?: Record<string, string>;
  cancelAtPeriodEnd?: boolean;
}

export async function createStripeSubscriptionService(
  data: CreateStripeSubscriptionData
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: data.customerId,
      items: [{ price: data.priceId }],
      trial_period_days: data.trialPeriodDays,
      metadata: data.metadata,
      cancel_at_period_end: data.cancelAtPeriodEnd,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
  } catch (error: any) {
    throw new AppError(
      `Failed to create Stripe subscription: ${error.message}`,
      400
    );
  }
}

export async function getStripeSubscriptionService(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error: any) {
    throw new AppError(
      `Failed to retrieve Stripe subscription: ${error.message}`,
      400
    );
  }
}

export async function listStripeSubscriptionsService(
  params: {
    customerId?: string;
    status?: string;
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
  } = {}
): Promise<Stripe.ApiList<Stripe.Subscription>> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: params.customerId,
      status: params.status as any,
      limit: params.limit || 10,
      starting_after: params.startingAfter,
      ending_before: params.endingBefore,
    });
    return subscriptions;
  } catch (error: any) {
    throw new AppError(
      `Failed to list Stripe subscriptions: ${error.message}`,
      400
    );
  }
}

export async function updateStripeSubscriptionService(
  subscriptionId: string,
  data: {
    cancelAtPeriodEnd?: boolean;
    metadata?: Record<string, string>;
    priceId?: string;
  }
): Promise<Stripe.Subscription> {
  try {
    const updateData: Stripe.SubscriptionUpdateParams = {
      cancel_at_period_end: data.cancelAtPeriodEnd,
      metadata: data.metadata,
    };
    if (data.priceId) {
      updateData.items = [{ id: undefined, price: data.priceId }];
    }
    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      updateData
    );
    return subscription;
  } catch (error: any) {
    throw new AppError(
      `Failed to update Stripe subscription: ${error.message}`,
      400
    );
  }
}

export async function cancelStripeSubscriptionService(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error: any) {
    throw new AppError(
      `Failed to cancel Stripe subscription: ${error.message}`,
      400
    );
  }
}

// Stripe Invoice Services
export interface CreateStripeInvoiceData {
  customerId: string;
  subscriptionId?: string;
  description?: string;
  metadata?: Record<string, string>;
  dueDate?: number;
  autoAdvance?: boolean;
}

export interface CreateStripeInvoiceItemData {
  customerId: string;
  invoiceId?: string;
  priceId?: string;
  amount?: number;
  currency?: string;
  description?: string;
  quantity?: number;
  metadata?: Record<string, string>;
}

export async function createStripeInvoiceService(
  data: CreateStripeInvoiceData
): Promise<Stripe.Invoice> {
  try {
    const invoice = await stripe.invoices.create({
      customer: data.customerId,
      subscription: data.subscriptionId,
      description: data.description,
      metadata: data.metadata,
      due_date: data.dueDate,
      auto_advance: data.autoAdvance,
    });
    return invoice;
  } catch (error: any) {
    throw new AppError(
      `Failed to create Stripe invoice: ${error.message}`,
      400
    );
  }
}

export async function getStripeInvoiceService(
  invoiceId: string
): Promise<Stripe.Invoice> {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return invoice;
  } catch (error: any) {
    throw new AppError(
      `Failed to retrieve Stripe invoice: ${error.message}`,
      400
    );
  }
}

export async function listStripeInvoicesService(
  params: {
    customerId?: string;
    subscriptionId?: string;
    status?: string;
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
  } = {}
): Promise<Stripe.ApiList<Stripe.Invoice>> {
  try {
    const invoices = await stripe.invoices.list({
      customer: params.customerId,
      subscription: params.subscriptionId,
      status: params.status as any,
      limit: params.limit || 10,
      starting_after: params.startingAfter,
      ending_before: params.endingBefore,
    });
    return invoices;
  } catch (error: any) {
    throw new AppError(`Failed to list Stripe invoices: ${error.message}`, 400);
  }
}

export async function updateStripeInvoiceService(
  invoiceId: string,
  data: {
    description?: string;
    metadata?: Record<string, string>;
    dueDate?: number;
    autoAdvance?: boolean;
  }
): Promise<Stripe.Invoice> {
  try {
    const invoice = await stripe.invoices.update(invoiceId, {
      description: data.description,
      metadata: data.metadata,
      due_date: data.dueDate,
      auto_advance: data.autoAdvance,
    });
    return invoice;
  } catch (error: any) {
    throw new AppError(
      `Failed to update Stripe invoice: ${error.message}`,
      400
    );
  }
}

export async function finalizeStripeInvoiceService(
  invoiceId: string
): Promise<Stripe.Invoice> {
  try {
    const invoice = await stripe.invoices.finalizeInvoice(invoiceId);
    return invoice;
  } catch (error: any) {
    throw new AppError(
      `Failed to finalize Stripe invoice: ${error.message}`,
      400
    );
  }
}

export async function payStripeInvoiceService(
  invoiceId: string
): Promise<Stripe.Invoice> {
  try {
    const invoice = await stripe.invoices.pay(invoiceId);
    return invoice;
  } catch (error: any) {
    throw new AppError(`Failed to pay Stripe invoice: ${error.message}`, 400);
  }
}

export async function voidStripeInvoiceService(
  invoiceId: string
): Promise<Stripe.Invoice> {
  try {
    const invoice = await stripe.invoices.voidInvoice(invoiceId);
    return invoice;
  } catch (error: any) {
    throw new AppError(`Failed to void Stripe invoice: ${error.message}`, 400);
  }
}

export async function sendStripeInvoiceService(
  invoiceId: string
): Promise<Stripe.Invoice> {
  try {
    const invoice = await stripe.invoices.sendInvoice(invoiceId);
    return invoice;
  } catch (error: any) {
    throw new AppError(`Failed to send Stripe invoice: ${error.message}`, 400);
  }
}

export async function createStripeInvoiceItemService(
  data: CreateStripeInvoiceItemData
): Promise<Stripe.InvoiceItem> {
  try {
    const invoiceItemData: Stripe.InvoiceItemCreateParams = {
      customer: data.customerId,
      amount: data.amount,
      currency: data.currency || 'usd',
      description: data.description,
      quantity: data.quantity,
      metadata: data.metadata,
    };

    if (data.invoiceId) {
      invoiceItemData.invoice = data.invoiceId;
    }

    const invoiceItem = await stripe.invoiceItems.create(invoiceItemData);
    return invoiceItem;
  } catch (error: any) {
    throw new AppError(
      `Failed to create Stripe invoice item: ${error.message}`,
      400
    );
  }
}

export async function updateStripeInvoiceItemService(
  itemId: string,
  data: {
    amount?: number;
    description?: string;
    quantity?: number;
    metadata?: Record<string, string>;
  }
): Promise<Stripe.InvoiceItem> {
  try {
    const invoiceItem = await stripe.invoiceItems.update(itemId, {
      amount: data.amount,
      description: data.description,
      quantity: data.quantity,
      metadata: data.metadata,
    });
    return invoiceItem;
  } catch (error: any) {
    throw new AppError(
      `Failed to update Stripe invoice item: ${error.message}`,
      400
    );
  }
}

export async function deleteStripeInvoiceItemService(
  itemId: string
): Promise<Stripe.DeletedInvoiceItem> {
  try {
    const invoiceItem = await stripe.invoiceItems.del(itemId);
    return invoiceItem;
  } catch (error: any) {
    throw new AppError(
      `Failed to delete Stripe invoice item: ${error.message}`,
      400
    );
  }
}

// Stripe Webhook Services
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

export async function handleStripeWebhookService(
  event: StripeWebhookEvent
): Promise<{
  success: boolean;
  message: string;
  eventType: string;
}> {
  try {
    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        await handleSubscriptionTrialWillEnd(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return {
      success: true,
      message: `Webhook processed successfully for event: ${event.type}`,
      eventType: event.type,
    };
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    throw new AppError(`Webhook processing failed: ${error.message}`, 400);
  }
}

async function handleSubscriptionTrialWillEnd(
  subscription: Stripe.Subscription
): Promise<void> {
  try {
    const customer = await stripe.customers.retrieve(
      subscription.customer as string
    );
    const product = await stripe.products.retrieve(
      subscription.items.data[0].price.product as string
    );

    const emailData = {
      to: (customer as Stripe.Customer).email!,
      subject: 'Your Trial Period is Ending Soon',
      template: 'trial-ending',
      data: {
        customerName: (customer as Stripe.Customer).name || 'Valued Customer',
        productName: product.name,
        trialEndDate: new Date(
          subscription.trial_end! * 1000
        ).toLocaleDateString(),
        subscriptionId: subscription.id,
        amount: (subscription.items.data[0].price.unit_amount! / 100).toFixed(
          2
        ),
        currency: subscription.currency.toUpperCase(),
      },
    };

    await sendEmailNotification(emailData);
    console.log(`Trial ending notification sent to ${emailData.to}`);
  } catch (error: any) {
    console.error('Error sending trial ending notification:', error);
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  try {
    const customer = await stripe.customers.retrieve(
      subscription.customer as string
    );
    const product = await stripe.products.retrieve(
      subscription.items.data[0].price.product as string
    );

    const emailData = {
      to: (customer as Stripe.Customer).email!,
      subject: 'Your Subscription Has Been Cancelled',
      template: 'subscription-cancelled',
      data: {
        customerName: (customer as Stripe.Customer).name || 'Valued Customer',
        productName: product.name,
        cancellationDate: new Date(
          subscription.canceled_at! * 1000
        ).toLocaleDateString(),
        subscriptionId: subscription.id,
        endDate: new Date(
          (subscription as any).current_period_end * 1000
        ).toLocaleDateString(),
      },
    };

    await sendEmailNotification(emailData);
    console.log(
      `Subscription cancellation notification sent to ${emailData.to}`
    );
  } catch (error: any) {
    console.error(
      'Error sending subscription cancellation notification:',
      error
    );
  }
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<void> {
  try {
    const customer = await stripe.customers.retrieve(
      invoice.customer as string
    );
    const subscription = (invoice as any).subscription
      ? await stripe.subscriptions.retrieve(
          (invoice as any).subscription as string
        )
      : null;
    const product = subscription
      ? await stripe.products.retrieve(
          subscription.items.data[0].price.product as string
        )
      : null;

    const emailData = {
      to: (customer as Stripe.Customer).email!,
      subject: 'Payment Successful - Thank You!',
      template: 'payment-successful',
      data: {
        customerName: (customer as Stripe.Customer).name || 'Valued Customer',
        productName: product?.name || 'Service',
        invoiceId: invoice.id,
        amount: (invoice.amount_paid / 100).toFixed(2),
        currency: invoice.currency.toUpperCase(),
        paymentDate: new Date(invoice.created * 1000).toLocaleDateString(),
        receiptUrl: (invoice as any).receipt_url,
        subscriptionId: subscription?.id,
        nextBillingDate: subscription
          ? new Date(
              (subscription as any).current_period_end * 1000
            ).toLocaleDateString()
          : null,
      },
    };

    await sendEmailNotification(emailData);
    console.log(`Payment success notification sent to ${emailData.to}`);
  } catch (error: any) {
    console.error('Error sending payment success notification:', error);
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  try {
    const customer = await stripe.customers.retrieve(
      invoice.customer as string
    );
    const subscription = (invoice as any).subscription
      ? await stripe.subscriptions.retrieve(
          (invoice as any).subscription as string
        )
      : null;
    const product = subscription
      ? await stripe.products.retrieve(
          subscription.items.data[0].price.product as string
        )
      : null;

    const emailData = {
      to: (customer as Stripe.Customer).email!,
      subject: 'Payment Failed - Action Required',
      template: 'payment-failed',
      data: {
        customerName: (customer as Stripe.Customer).name || 'Valued Customer',
        productName: product?.name || 'Service',
        invoiceId: invoice.id,
        amount: (invoice.amount_due / 100).toFixed(2),
        currency: invoice.currency.toUpperCase(),
        failureDate: new Date(invoice.created * 1000).toLocaleDateString(),
        subscriptionId: subscription?.id,
        nextRetryDate: invoice.next_payment_attempt
          ? new Date(invoice.next_payment_attempt * 1000).toLocaleDateString()
          : null,
      },
    };

    await sendEmailNotification(emailData);
    console.log(`Payment failure notification sent to ${emailData.to}`);
  } catch (error: any) {
    console.error('Error sending payment failure notification:', error);
  }
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  try {
    // Handle specific subscription updates like plan changes
    if (subscription.status === 'past_due') {
      const customer = await stripe.customers.retrieve(
        subscription.customer as string
      );
      const product = await stripe.products.retrieve(
        subscription.items.data[0].price.product as string
      );

      const emailData = {
        to: (customer as Stripe.Customer).email!,
        subject: 'Subscription Payment Overdue',
        template: 'subscription-past-due',
        data: {
          customerName: (customer as Stripe.Customer).name || 'Valued Customer',
          productName: product.name,
          subscriptionId: subscription.id,
          dueDate: new Date(
            (subscription as any).current_period_end * 1000
          ).toLocaleDateString(),
        },
      };

      await sendEmailNotification(emailData);
      console.log(`Past due notification sent to ${emailData.to}`);
    }
  } catch (error: any) {
    console.error('Error sending subscription update notification:', error);
  }
}

async function sendEmailNotification(emailData: {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}): Promise<void> {
  try {
    // Import the email service
    const sendEmail = (await import('../../utils/node-mailer')).default;

    // Create email content based on template
    const emailContent = generateEmailContent(
      emailData.template,
      emailData.data
    );

    await sendEmail({
      to: emailData.to,
      subject: emailData.subject,
      html: emailContent,
    });
  } catch (error: any) {
    console.error('Error sending email notification:', error);
    throw new Error(`Failed to send email notification: ${error.message}`);
  }
}

function generateEmailContent(
  template: string,
  data: Record<string, any>
): string {
  switch (template) {
    case 'trial-ending':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Trial Period is Ending Soon</h2>
          <p>Dear ${data.customerName},</p>
          <p>Your trial period for <strong>${data.productName}</strong> will end on <strong>${data.trialEndDate}</strong>.</p>
          <p>To continue enjoying our services, please ensure your payment method is up to date.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Subscription Details:</h3>
            <p><strong>Product:</strong> ${data.productName}</p>
            <p><strong>Amount:</strong> $${data.amount} ${data.currency}</p>
            <p><strong>Subscription ID:</strong> ${data.subscriptionId}</p>
          </div>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>Your Team</p>
        </div>
      `;

    case 'subscription-cancelled':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Subscription Cancelled</h2>
          <p>Dear ${data.customerName},</p>
          <p>Your subscription for <strong>${data.productName}</strong> has been cancelled as requested.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Cancellation Details:</h3>
            <p><strong>Product:</strong> ${data.productName}</p>
            <p><strong>Cancellation Date:</strong> ${data.cancellationDate}</p>
            <p><strong>Access Until:</strong> ${data.endDate}</p>
            <p><strong>Subscription ID:</strong> ${data.subscriptionId}</p>
          </div>
          <p>You will continue to have access to our services until <strong>${data.endDate}</strong>.</p>
          <p>If you change your mind, you can reactivate your subscription at any time.</p>
          <p>Best regards,<br>Your Team</p>
        </div>
      `;

    case 'payment-successful':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Payment Successful!</h2>
          <p>Dear ${data.customerName},</p>
          <p>Thank you for your payment of <strong>$${data.amount} ${data.currency}</strong> for <strong>${data.productName}</strong>.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Payment Details:</h3>
            <p><strong>Amount:</strong> $${data.amount} ${data.currency}</p>
            <p><strong>Date:</strong> ${data.paymentDate}</p>
            <p><strong>Invoice ID:</strong> ${data.invoiceId}</p>
            ${data.receiptUrl ? `<p><strong>Receipt:</strong> <a href="${data.receiptUrl}">View Receipt</a></p>` : ''}
            ${data.nextBillingDate ? `<p><strong>Next Billing Date:</strong> ${data.nextBillingDate}</p>` : ''}
          </div>
          <p>Your subscription is now active and you have full access to our services.</p>
          <p>Best regards,<br>Your Team</p>
        </div>
      `;

    case 'payment-failed':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Payment Failed</h2>
          <p>Dear ${data.customerName},</p>
          <p>We were unable to process your payment of <strong>$${data.amount} ${data.currency}</strong> for <strong>${data.productName}</strong>.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Payment Details:</h3>
            <p><strong>Amount:</strong> $${data.amount} ${data.currency}</p>
            <p><strong>Date:</strong> ${data.failureDate}</p>
            <p><strong>Invoice ID:</strong> ${data.invoiceId}</p>
            ${data.nextRetryDate ? `<p><strong>Next Retry:</strong> ${data.nextRetryDate}</p>` : ''}
          </div>
          <p>Please update your payment method to avoid any service interruptions.</p>
          <p>If you need assistance, please contact our support team.</p>
          <p>Best regards,<br>Your Team</p>
        </div>
      `;

    case 'subscription-past-due':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffc107;">Payment Overdue</h2>
          <p>Dear ${data.customerName},</p>
          <p>Your payment for <strong>${data.productName}</strong> is overdue.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Subscription Details:</h3>
            <p><strong>Product:</strong> ${data.productName}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
            <p><strong>Subscription ID:</strong> ${data.subscriptionId}</p>
          </div>
          <p>Please update your payment method to restore access to our services.</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br>Your Team</p>
        </div>
      `;

    default:
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Notification</h2>
          <p>This is an automated notification from our system.</p>
        </div>
      `;
  }
}
