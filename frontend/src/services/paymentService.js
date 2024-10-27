import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51LmhGsHQanXHoJn0wBK5v2yQyHFdQ4KlSXSXZobDhxFPCrhVwWtCwWXvNIxjOQdi65riR24NEgQyY6Ck1UZkPqq800jtbOgNU8');

async function handlePayment(courseId, price) {
  const response = await fetch('/api/payment/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: price + 5, currency: 'eur', courseId })
  });

  const { clientSecret } = await response.json();
  const stripe = await stripePromise;

  const { error } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement),
      billing_details: { name: user.name }
    }
  });

  if (error) {
    console.error(error.message);
  } else {
    console.log('Payment successful, waiting for course completion');
  }
}
