import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        
        try {
            // This is where you'll connect to your backend API
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful login
                console.log('Login successful:', data);
                navigate('/decks', { state: { userId: data.userId}})
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">AnkiClone</h1>
                    <p className="text-gray-600">Sign in to continue learning</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="passwordCheck"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Re-enter Password
                        </label>
                        <input
                            id="passwordCheck"
                            type="password"
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition
                                ${passwordCheck && password !== passwordCheck
                                    ? "border-red-500 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-indigo-500"
                                }`}
                            placeholder="Re-enter password"
                            required
                        />
                        {passwordCheck && password !== passwordCheck && (
                            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating an account...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}