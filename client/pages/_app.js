import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/header';
// add global style

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return <div>
    <Header currentUser={currentUser} />
    <Component {...pageProps} />
  </div>

}

// {AppTree,component,router,ctx}
AppComponent.getInitialProps = async (context) => {
  const client = buildClient(context.ctx);

  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx);
  }

  return {
    pageProps,
    ...data,
  }
}

export default AppComponent;