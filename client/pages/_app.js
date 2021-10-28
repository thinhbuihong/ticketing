import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/header';
// add global style

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return <div>
    <Header currentUser={currentUser} />
    <div className="container">
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  </div>

}

// context = {AppTree,Component,router,ctx}
AppComponent.getInitialProps = async (context) => {
  const client = buildClient(context.ctx);//ctx = {req,res}

  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx, client, data.currentUser);
  }

  return {
    pageProps,
    ...data,
  }
}

export default AppComponent;