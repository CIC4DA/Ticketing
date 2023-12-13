import buildClient from '../api/buildClient';

const landingPage = ({ currentUser }) => {
    return (
        currentUser ?  
        <div>
            <h1 className='text-xl font-bold'>You are signed in</h1>
        </div>  : 
        <div>
            <h1 className='text-xl font-bold'>You are Not signed in</h1>
        </div>
    )
};

// getInitialProps, if we want to fetch some data during server side rendering process, we can use this function
// here context === {req,res}
landingPage.getInitialProps = async (context) => {
    //URL is made to reach out to ingress-nginx, Watch videos from 230
    const client = buildClient(context);
    try {
        const { data } = await client.get('/api/users/currentUser');
        return data;
    } catch (error) {
        console.error('Error fetching currentUser:', error.message);
        return { currentUser: null };
    }
};

export default landingPage;