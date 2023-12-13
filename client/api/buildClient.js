import axios from 'axios';

const buildClient = ({ req }) => {
    try {
        if (typeof window === 'undefined') {
            // Server-side rendering (on the server)
            return axios.create({
                baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
                headers: req.headers
            });
        } else {
            // Client-side rendering (in the browser)
            return axios.create({
                baseURL: '/'
            });
        }
    } catch (error) {
        // Handle errors here
        console.log('Error creating axios instance:', error);
        throw error; 
    }
}

export default buildClient;
