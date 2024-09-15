import buildClient from '../api/build-client';

// Generate components with provided data
const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

// Fetch data during server-side rendering process
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const response = await client.get('/api/users/currentuser');
  return response.data;
};

export default LandingPage;
