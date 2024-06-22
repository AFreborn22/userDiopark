import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function UpdatePassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        // Dapatkan token dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            setErrorMessage('Token tidak tersedia. Pastikan URL yang Anda gunakan benar.');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Kata sandi tidak cocok. Silakan coba lagi.');
            setSuccessMessage('');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://dioparkapp-production.up.railway.app/api/password/reset-password?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Kata sandi berhasil diperbarui.');
                setErrorMessage('');
                setPassword('');
                setConfirmPassword('');
            } else {
                setErrorMessage(data.message || 'Gagal memperbarui kata sandi. Silakan coba lagi.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error during updating password:', error.message);
            setErrorMessage('Gagal memperbarui kata sandi. Silakan coba lagi.');
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
                <h2 className="text-2xl text-center font-semibold mb-1 text-gray-800">Perbarui Kata Sandi</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Kata Sandi Baru
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                onClick={toggleShowPassword}
                                className="absolute top-3 right-2 text-gray-600 focus:outline-none"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Konfirmasi Kata Sandi Baru
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                            <button
                                type="button"
                                onClick={toggleShowConfirmPassword}
                                className="absolute top-3 right-2 text-gray-600 focus:outline-none"
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
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
                        >
                            {isLoading ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdatePassword;