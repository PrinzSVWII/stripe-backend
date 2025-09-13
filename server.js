require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15', // update to your targeted Stripe version
});

app.use(express.json());
app.use(cors()); // Allow all origins by default

// Make sure this route is present
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    // Basic input validation
    if (
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    // Log the error, but return a generic message to the client
    console.error(err);
    res.status(500).json({ error: 'An error occurred, please try again.' });
  }
});

// Optional: Root route for health check
app.get('/', (req, res) => {
  res.send('Server is running ✅');
});

// Make sure the port is set to process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));