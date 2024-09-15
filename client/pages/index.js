import buildClient from '../api/build-client';

// Generate components with provided data
const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing Page</h1>;
};

// Fetch data during server-side rendering process
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const response = await client.get('/api/users/currentuser');
  return response.data;
};

export default LandingPage;
