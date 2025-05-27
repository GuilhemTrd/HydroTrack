// App.js

import { useAuth } from "react-oidc-context";
import HomePage from "./HomePage/HomePage";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "19q2r3ng1rpvvoedokt1acrmla";
    const logoutUri = "http://localhost:3000";
    const cognitoDomain = "https://eu-west-3g7ibpgbi9.auth.eu-west-3.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <HomePage />
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
}

export default App;