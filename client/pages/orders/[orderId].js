import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const OrderShow = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState('');
	const { callRequest, errors } = useRequest({
		url: '/api/payments',
		method: 'post',
		body: {
			orderId: order.id,
		}
	}, payment => console.log(payment))

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date();
			setTimeLeft(Math.round(msLeft / 1000))
		};

		const timerId = setInterval(findTimeLeft, 1000);

		return () => {
			clearInterval(timerId)
		}
	}, [order])

	if (timeLeft < 0) {
		return <div>Order expires</div>
	}

	return <div>Time left to pay: {timeLeft} seconds
		<StripeCheckout
			token={token => {
				callRequest({ token: token.id })
				Router.push('/');
			}}
			stripeKey="pk_test_51J79rzICDOVuJZn5PFgEoMinebAwcwRFV1vqLZz02VQ2FuNyRAHGJX5gvWbBdDLvjuCeOvaVhl0ENRRBYMQJPB5k0085E5MUTs"
			amount={order.ticket.price * 1000}
			email={currentUser.email}
		/></div>;

	{ errors }
}

OrderShow.getInitialProps = async (context, client) => {
	const { orderId } = context.query;
	const { data } = await client.get(`/api/orders/${orderId}`);

	return { order: data };
}

export default OrderShow;