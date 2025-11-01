import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function DecksScreen() {
    const location = useLocation();
    const userId = location.state?.userId;
    const [decks, setDecks] = useState([]);
    const [error, setError] = useState('');

            useEffect(() => {
                const fetchDecks = async () => {
                    try {
                        const response = await fetch(`http://localhost:3000/api/deck/all`);
                        const data = await response.json();
                        if (response.ok) setDecks(data);
                        else setError('Error loading decks');
                    } catch (err) {
                        setError('Failed to fetch decks');
                    }
                };
                fetchDecks();
            }, []);

            if (!userId) return <p className="text-center text-gray-500">No user ID provided</p>;

            return (
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Decks</h1>

                    {error && <p className="text-red-600 mb-4">{error}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                        {decks.map(deck => (
                            <div
                                key={deck._id}
                                className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
                                onClick={() => console.log(`Clicked deck ${deck._id}`)}
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{deck.title}</h2>
                                <p className="text-gray-600">{deck.description}</p>
                                <p className="text-gray-600">User: {deck.userId}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
