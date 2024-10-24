import { useEffect, useState } from 'react';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

// Display an order and time left to pay for it
const OrderShow = ({ order }) => {
  // Update timer
  const [timeLeft, setTimeLeft] = useState(0);

  // set up request to make payment
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      Router.push('/orders');
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    // every 1000 mili-second
    const timerId = setInterval(findTimeLeft, 1000);

    // turn off the timer when we navigate away
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  // when time left is less than 0
  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51Q8Q6fJaUmbBgXNZW1a00FiFEGWat5hcGoB9ZuuVMaRFfbuwJDYU9C2plTZnJm4CS1x7HZX6QBp1Uf7IdP2Ed80o00kDdPmBMH'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
