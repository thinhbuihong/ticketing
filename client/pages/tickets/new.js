import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const NewTicket = () => {
	const [title, setTitle] = useState('')
	const [price, setPrice] = useState('');

	const { callRequest, errors } = useRequest({
		url: '/api/tickets',
		method: 'post',
		body: {
			title, price
		},
	}, ticket => {
		console.log(ticket);
		Router.push('/')
	})

	const onBlur = () => {
		const value = parseFloat(price);

		if (isNaN(value)) {
			return;
		}

		setPrice(value.toFixed(2));
	}

	const onSubmit = event => {
		event.preventDefault();

		callRequest();
	}

	return (
		<div>
			<h1>create a ticket</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label>Title</label>
					<input className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
				</div>

				<div className="form-group">
					<label>Price</label>
					<input className="form-control"
						onBlur={onBlur}
						value={price} onChange={e => setPrice(e.target.value)}
					/>
				</div>

				{errors}
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	)
}
export default NewTicket;