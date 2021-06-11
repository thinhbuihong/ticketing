import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/useRequest";

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { callRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email, password,
    }
  }, () => Router.push('/'))

  const onSubmit = (event) => {
    event.preventDefault();

    callRequest();
  }

  return (<form onSubmit={onSubmit}>
    <h1>Sign in</h1>
    <div className="form-group">
      <label>Email address</label>
      <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
    </div>
    <div className="form-group">
      <label>Password</label>
      <input value={password} onChange={e => setPassword(e.target.value)} className="form-control" />
    </div>
    {errors}
    <button className="btn btn-primary">Sign in</button>
  </form>)
}