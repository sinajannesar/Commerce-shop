import Stripe from 'stripe';

// Debug: چک کنید متغیر load شده یا نه
console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('Key starts with sk_test:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'));

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});