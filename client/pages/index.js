import buildClient from "../api/buildClient";

const LandingPage = ({ currentUser }) => {
  return currentUser ?
    <h1>you are signed in</h1> :
    <h1>you are not signed in</h1>
}

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
  // kubectl get services -n ingress-nginx
}

export default LandingPage;