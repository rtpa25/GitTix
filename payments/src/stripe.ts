import Stripe from 'stripe';

export const stripe = new Stripe(
    'sk_test_51MEPE7KybqH6V1luBfmOMER9lARYxOpPhLtQS2XvyK6mzDZcz8id3KyBCfDb5a18ZhSbRzyk8w8hibiH5eNYORdm00hcOFgU6K',
    {
        apiVersion: '2022-11-15',
    }
);
