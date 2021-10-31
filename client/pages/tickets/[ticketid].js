import Router from 'next/router';
import useRequest from "../../hooks/useRequest";

const TicketShow = ({ ticket }) => {
	const { callRequest, errors } = useRequest({
		url: '/api/orders',
		method: 'post',
		body: {
			ticketId: ticket.id
		},
	}, order => {
		console.log(order);
		//1 la url trong pages, 2 la url chinh xac
		Router.push('/orders/[orderId]', `/orders/${order.id}`);
	})
	return <div>
		<h1>{ticket.title}</h1>
		<h4>Price: {ticket.price}</h4>
		{errors}

		<button onClick={() => callRequest()} className="btn btn-primary">Purchase</button>
	</div>
}

TicketShow.getInitialProps = async (context, client) => {
	const { ticketid } = context.query;
	const { data } = await client.get(`/api/tickets/${ticketid}`);

	return { ticket: data };
}

export default TicketShow;