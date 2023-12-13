import buildClient from '../api/buildClient';
import '../styles/tailwind.css';

const MyApp = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Navbar {currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  )
}

// Here we are not working in a page.
// This is a Custom App Component, hence have different method
// here context === {Component, ctx: {req,res}}
MyApp.getInitialProps = async (appContext) => {
  //URL is made to reach out to ingress-nginx, Watch videos from 230
  const client = buildClient(appContext.ctx);
  try {
      const { data } = await client.get('/api/users/currentUser');

      // to send this data to individual pages getInitialProps
      let pageProps = {};
      if(appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
      }

      return {
        pageProps,
        ...data
      };
  } catch (error) {
      console.error('Error fetching currentUser:', error.message);
      return { currentUser: null };
  }
};

export default MyApp;