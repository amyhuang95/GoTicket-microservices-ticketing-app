import axios from 'axios';

export default ({ req }) => {
  // If we are on the server - use ingress-nginx name space to make request
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  }
  // If we are on the browser (client) - use base url to make request
  else {
    return axios.create({
      baseURL: '/',
    });
  }
};
