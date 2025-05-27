import React, { useState } from 'react';
import './HomePage.css';
import axios from 'axios';
import {useAuth} from "react-oidc-context";

const HomePage = () => {
    const [hydrationData, setHydrationData] = useState([]);
    const [notification, setNotification] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const auth = useAuth();

    const getHistoryHydratation = async () => {
        setLoading(true);
        setError(null);
        const userId = auth.user?.profile?.sub;

        try {
            const response = await axios.get('https://cdkqfkwkm7.execute-api.eu-west-3.amazonaws.com/api/get-daily-hydration', {
                params: {
                    userId: userId,
                }
            });

            const data = Array.isArray(response.data.body) ? response.data.body : [];
            setHydrationData(data);
        } catch (err) {
            setError("Erreur lors de la récupération de l'historique. Veuillez réessayer.");
            console.error('Error fetching hydration data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddWater = async (amount) => {
        const userId = auth.user?.profile?.sub;
        const date = new Date().toISOString();

        if (!userId) {
            setError("Utilisateur non authentifié.");
            return;
        }

        setHydrationData([
            ...hydrationData,
            {
                quantity: amount,
                date: date,
                userId: userId,
            },
        ]);

        setNotification(`Bravo ! Vous avez bu ${amount} ml d'eau.`);

        try {
            await axios.post(
                'https://cdkqfkwkm7.execute-api.eu-west-3.amazonaws.com/api/add-drink',
                {
                    userId: userId,
                    quantity: amount,
                    datetime: date,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

        } catch (err) {
            console.error('Erreur lors de l’enregistrement de la boisson :', err);
            setError("Une erreur est survenue lors de l'enregistrement. Vérifiez votre connexion.");
        }
    };

    const totalWaterConsumed = hydrationData.reduce((acc, current) => acc + current.quantity, 0);

    return (
        <div className="home-page">
            <header className="navbar">
                <div className="logo">
                    <h1>HydroTrack</h1>
                </div>
                <button className="logout-button" onClick={() => auth.removeUser()}>Se déconnecter</button>
            </header>

            <main>
                <div className="intro">
                    <p>Suivez votre hydratation quotidienne et atteignez vos objectifs !</p>
                    <p>Choisissez la quantité d'eau que vous avez bu :</p>
                </div>

                <div className="button-group">
                    <button className="water-button" onClick={() => handleAddWater(250)} disabled={loading}>
                        🥤 Verre (250 ml)
                    </button>
                    <button className="water-button" onClick={() => handleAddWater(500)} disabled={loading}>
                        🍶 Bouteille (500 ml)
                    </button>
                    <button className="water-button" onClick={() => handleAddWater(1000)} disabled={loading}>
                        🏺 Grande bouteille (1000 ml)
                    </button>
                </div>

                <div className="progress-section">
                    <h2>Progrès</h2>
                    <p>Total d'eau bue aujourd'hui : {totalWaterConsumed} ml</p>

                    <button
                        className="show-history-button"
                        onClick={() => {
                            setShowHistory(!showHistory);
                            if (!showHistory) getHistoryHydratation();
                        }}
                    >
                        {showHistory ? 'Masquer l’historique' : 'Afficher l’historique'}
                    </button>

                    {showHistory && (
                        <div className="history">
                            <h3>Historique de l'hydratation</h3>
                            {loading && <div className="loading">Chargement...</div>}
                            {notification && <div className="notification">{notification}</div>}

                            <ul>
                                {hydrationData.map((data, index) => (
                                    <li key={index}>
                                        <strong>{data.quantity} ml</strong> – {new Date(data.date).toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>

            <footer>
                <p>
                    HydroTrack – Suivi de votre hydratation. <br />
                    Toujours prendre soin de votre santé !
                </p>
            </footer>
        </div>
    );
};

export default HomePage;
