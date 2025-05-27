import { useAuth } from "react-oidc-context";
import HomePage from "./HomePage/HomePage";
import './App.css';

function App() {
  const auth = useAuth();

  const clientId = "19q2r3ng1rpvvoedokt1acrmla";
  const logoutUri = "http://localhost:3000"; // Mets ici ton URL de prod
  const cognitoDomain = "https://eu-west-3g7ibpgbi9.auth.eu-west-3.amazoncognito.com";

  const signUpRedirect = () => {
    window.location.href = `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div className="center-screen loading">Chargement...</div>;
  }

  if (auth.error) {
    return <div className="center-screen error">Erreur : {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
        <div className="app-container">
          <HomePage />
        </div>
    );
  }

  return (
      <div className="center-screen">
        <div className="welcome-card">
          <h1>Bienvenue sur HydroTrack</h1>
          <p>Suivez votre consommation d’eau au quotidien, atteignez vos objectifs, et restez en pleine forme !</p>
          <p>Connectez-vous pour commencer à suivre votre hydratation.</p>
          <button onClick={() => auth.signinRedirect()}>Se connecter</button>
          <button onClick={signUpRedirect}>Créer un compte</button>
        </div>
      </div>
  );
}

export default App;
