import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, config }, onSuccess) => {
	const [errors, setErrors] = useState(null);

	const callRequest = async (props = {}) => {
		try {
			setErrors(null)
			const response = await axios[method](url, { ...body, ...props }, config);

			if (onSuccess) {
				onSuccess(response.data);
			}

			return response.data;
		} catch (err) {
			setErrors(<div className="alert alert-danger">
				<h4>Ooops....</h4>
				<ul className="my-0">
					{err.response.data.errors.map(err => (
						<li key={err.message}>{err.message}</li>
					))}
				</ul>
			</div>)
		}
	}

	return {
		callRequest, errors
	}
}
export default useRequest;