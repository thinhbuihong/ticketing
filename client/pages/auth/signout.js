import router from 'next/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';

const Signout = () => {
  const { callRequest } = useRequest({
    url: '/api/users/signout',
    method: 'get',
    body: {}
  }, () => router.push('/'))

  useEffect(() => {
    callRequest();
  }, [])

  return <div>Signing you out</div>
}

export default Signout;