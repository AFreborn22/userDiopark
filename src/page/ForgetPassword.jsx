import { useState, useEffect } from 'react';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('https://dioparkapp-production.up.railway.app/api/password/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            // Menangani respons dari backend
            if (response.ok) {
                setSuccessMessage(data.message);
                setErrorMessage('');
            } else {
                setErrorMessage(data.message || 'Gagal mengirim link reset kata sandi. Silakan coba lagi.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error during forgot password:', error.message);
            setErrorMessage('Gagal mengirim link reset kata sandi. Silakan coba lagi.');
            setSuccessMessage('');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let successTimeout, errorTimeout;
        if (successMessage) {
            successTimeout = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        }
        if (errorMessage) {
            errorTimeout = setTimeout(() => {
                setErrorMessage('');
            }, 3000);
        }
        return () => {
            clearTimeout(successTimeout);
            clearTimeout(errorTimeout);
        };
    }, [successMessage, errorMessage]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-500 to-gray-800">
            <div className="max-w-lg w-full mt-10 mb-10 py-10 px-10 bg-white shadow-md rounded-md" style={{ maxWidth: 'calc(55vw - -85px)', borderRadius: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Masukkan Email Anda
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 py-3 rounded relative" role="alert">
                            <p className="text-sm text-red-700 text-center">{errorMessage}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 px-4 py-3 rounded relative" role="alert">
                            <p className="text-sm text-center text-green-700">{successMessage}</p>
                        </div>
                    )}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white mt-5 px-4 py-2 rounded-md hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Mengirim...' : 'Kirim Link Reset Kata Sandi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
