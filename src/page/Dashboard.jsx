import { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faBolt, faSync, faUserCircle, faFileLines, faCar, faMotorcycle, faTicket, faTimes } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../assets/img/main_bg.jpg';
import Footer from '../components/Footer';
import { Link, useHistory } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { getCookie, getUserFromCookie, isUserDataComplete } from '../utils/cookieUtils'; // Import fungsi dari utils

function Dashboard() {
    const history = useHistory();
    const [scanning, setScanning] = useState(false);
    const [cameraImage, setCameraImage] = useState(null);
    const [isBackCamera, setIsBackCamera] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [scanData, setScanData] = useState(null);
    const [requestBody, setRequestBody] = useState(null);
    const [serverResponse, setServerResponse] = useState(null);
    const [ticket, setTicket] = useState(() => JSON.parse(localStorage.getItem('ticket')));
    const [showTicketPopup, setShowTicketPopup] = useState(false);
    const videoRef = useRef(null);
    const [motorParkingCount, setMotorParkingCount] = useState(0);
    const [carParkingCount, setCarParkingCount] = useState(0);
    const [showParkingQuota, setShowParkingQuota] = useState(true);
    const [isScannedIn, setIsScannedIn] = useState(() => localStorage.getItem('isScannedIn') === 'true');
    const [blokParkir, setBlokParkir] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = getCookie('token');
        if (!token) {
            history.push('/');
        } else {
            const savedUserData = getUserFromCookie();
            if (savedUserData) {
                setUserData(savedUserData);
            }
        }
    }, [history]);

    useEffect(() => {
        fetchParkingQuota();
        const savedBlokParkir = localStorage.getItem('blokParkir');
        if (savedBlokParkir) {
            setBlokParkir(savedBlokParkir);
        }
    }, []);

    const fetchParkingQuota = async () => {
        try {
            const token = getCookie('token');
            const motorResponse = await fetch('https://dioparkapp-production.up.railway.app/api/main/motor', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const motorData = await motorResponse.json();
            const motorCount = motorData.jumlahParkirTersedia;
            setMotorParkingCount(motorCount);

            const carResponse = await fetch('https://dioparkapp-production.up.railway.app/api/main/mobil', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const carData = await carResponse.json();
            const carCount = carData.jumlahParkirTersedia;
            setCarParkingCount(carCount);
        } catch (error) {
            console.error('Error fetching parking quota:', error);
        }
    };

    const pushDataToServer = async (data, endpoint) => {
        if (isSending) return;
        setIsSending(true);
        const token = getCookie('token');

        try {
            const response = await fetch(`https://dioparkapp-production.up.railway.app/api/diopark/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log('Response from API:', result);
            setServerResponse(result);
            if (response.ok) {
                console.log('Data berhasil dikirim ke server:', result);
                setAlertSeverity('success');
                setAlertMessage(endpoint === 'scan-masuk' ? 'Selamat Datang' : 'Sampai Jumpa');
                if (endpoint === 'scan-masuk') {
                    setIsScannedIn(true);
                    localStorage.setItem('isScannedIn', 'true');
                    fetchTicket();
                    setBlokParkir(result.transaksi.blok_parkir);
                    localStorage.setItem('blokParkir', result.transaksi.blok_parkir);
                } else if (endpoint === 'scan-keluar') {
                    setIsScannedIn(false);
                    localStorage.setItem('isScannedIn', 'false');
                    localStorage.removeItem('ticket');
                    localStorage.removeItem('blokParkir');
                    setTicket(null);
                }
            } else {
                console.error('Gagal mengirim data ke server:', result);
                setAlertSeverity('error');
                setAlertMessage(`Scan Gagal: ${result.error || 'Itu bukan QR Diopark'} (Kode: ${response.status})`);
            }
            setShowAlert(true);
        } catch (error) {
            console.error('Error saat mengirim data ke server:', error);
            setServerResponse(error.message);
            setAlertSeverity('error');
            setAlertMessage(`Scan Gagal: ${error.message} (Kode: ${error.status || 'Unknown'})`);
            setShowAlert(true);
        } finally {
            setIsSending(false);
        }
    };

    const fetchTicket = async () => {
        const token = getCookie('token');

        try {
            const response = await fetch('https://dioparkapp-production.up.railway.app/api/show/ticket', {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            setTicket(result.ticket);
            localStorage.setItem('ticket', JSON.stringify(result.ticket));
        } catch (error) {
            console.error('Error fetching ticket:', error);
        }
    };

    useEffect(() => {
        const startCamera = () => {
            const facingMode = isBackCamera ? 'environment' : 'user';
            const constraints = {
                video: {
                    facingMode: { exact: facingMode },
                    width: { max: 320 },
                    height: { max: 240 }
                }
            };
            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    const qrScanner = new QrScanner(videoRef.current, result => {
                        setScanning(false);
                        if (result) {
                            console.log('QR Data:', result);
                            try {
                                const qrData = JSON.parse(result);
                                setScanData(qrData);
                                const endpoint = isScannedIn ? 'scan-keluar' : 'scan-masuk';
                                pushDataToServer(qrData, endpoint);
                            } catch (error) {
                                setAlertSeverity('error');
                                setAlertMessage('Scan Gagal: Itu bukan QR Diopark');
                                setShowAlert(true);
                            }
                        }
                    });
                    qrScanner.start();
                })
                .catch(error => {
                    console.error('Failed to start camera:', error);
                    setScanning(false);
                });
        };

        const { current: videoNode } = videoRef;
        if (scanning || cameraImage) {
            setShowParkingQuota(false);
        } else {
            setShowParkingQuota(true);
        }

        if (scanning && videoNode) {
            startCamera();
        }
        return () => {
            if (videoNode && videoNode.srcObject) {
                const stream = videoNode.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoNode.srcObject = null;
            }
        };
    }, [scanning, isBackCamera, cameraImage]);

    const toggleTorch = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const videoTracks = stream.getVideoTracks();
            videoTracks.forEach(track => {
                if (track.getCapabilities().torch) {
                    track.applyConstraints({
                        advanced: [{ torch: !track.getSettings().torch }]
                    });
                }
            });
        }
    };

    const flipCamera = () => {
        setIsBackCamera(!isBackCamera);
    };

    const handleScanButtonClick = () => {
        console.log('Checking user data before scanning:', userData);
        if (!userData || !isUserDataComplete(userData)) {
            setAlertSeverity('warning');
            setAlertMessage('Lengkapi Data Terlebih Dahulu');
            setShowAlert(true);
            return;
        }

        if (isMobile()) {
            setScanning(true);
        } else {
            setAlertSeverity('error');
            setAlertMessage('Perangkat tidak mendukung untuk scanning');
            setShowAlert(true);
        }
    };

    const TutupAlert = () => {
        setTimeout(() => {
            setShowAlert(false);
            setScanData(null);
            setRequestBody(null);
            setServerResponse(null);
        }, 2000);
    };

    const isMobile = () => {
        const userAgent = navigator.userAgent;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    };

    useEffect(() => {
        if (showAlert) {
            TutupAlert();
        }
    }, [showAlert]);

    const scanBox = () => (
        <div className="max-w-md w-full py-10 px-6 bg-white bg-opacity-50 shadow-md lg:max-w-lg lg:mx-auto relative mt-5" style={{ borderRadius: '20px', maxWidth: 'calc(55vw - -85px)', margin: '0 10px' }}>
            <h2 className="text-2xl text-center font-semibold mb-4">
                Parkir lebih mudah dengan DioPark, Tinggal scan aja dibawah ini
            </h2>
            {!scanning && !cameraImage && (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <button onClick={handleScanButtonClick} className={`px-4 py-2 rounded-md hover:bg-${isScannedIn ? 'red' : 'green'}-600 bg-${isScannedIn ? 'red' : 'green'}-500 text-white`}>
                        <FontAwesomeIcon icon={faQrcode} className="mr-2" />
                        {isScannedIn ? 'Scan Keluar' : 'Scan Masuk'}
                    </button>
                </div>
            )}
            {(scanning || cameraImage) && (
                <div className="relative">
                    <video ref={videoRef} className="w-full rounded-md" />
                    <button onClick={() => { setScanning(false); setCameraImage(null); }} className="absolute top-2 right-2 text-red-500">
                        <FontAwesomeIcon icon={faTimes} size="2x" />
                    </button>
                    <button onClick={toggleTorch} className="absolute top-2 left-2 text-yellow-500">
                        <FontAwesomeIcon icon={faBolt} size="2x" />
                    </button>
                    <button onClick={flipCamera} className="absolute top-2 right-10 text-blue-500">
                        <FontAwesomeIcon icon={faSync} size="2x" />
                    </button>
                </div>
            )}
        </div>
    );

    const renderTicket = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-10 relative">
                <button onClick={() => setShowTicketPopup(false)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-20">
                    <FontAwesomeIcon icon={faTimes} size="2x" />
                </button>
                {isScannedIn && ticket ? (
                    <div className="text-center relative mt-4">
                        <div className="bg-[url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/584938/bg_15.png')] bg-cover text-center p-4 text-white rounded-t-lg relative">
                            <div className="bg-black bg-opacity-40 absolute inset-0 rounded-t-lg"></div>
                            <div className="relative z-10">
                                <div className="text-2xl font-bold">DioPark</div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="mb-2">
                                <p className="text-gray-600">Nama</p>
                                <h4 className="text-lg">{ticket.pengguna.nama}</h4>
                            </div>
                            <div className="flex justify-between mb-2">
                                <div className="text-left">
                                    <p className="text-gray-600">ID</p>
                                    <h4 className="text-lg">{ticket.id_parkir}</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-600">Nomor Polisi</p>
                                    <h4 className="text-lg">{ticket.pengguna.nomor_polisi}</h4>
                                </div>
                            </div>
                            <div className="flex justify-between mb-2">
                                <div className="text-left">
                                    <p className="text-gray-600">Lokasi Parkir</p>
                                    <h4 className="text-lg">{blokParkir}</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-600">Kendaraan</p>
                                    <h4 className="text-lg">{ticket.pengguna.detail_kendaraan}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-b-lg text-sm text-gray-700 italic">
                            Penting : Silahkan tunjukan tiket terlebih dahulu kepada petugas ketika anda ingin keluar ya
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Ups!</h2>
                        <p className="text-lg">Anda sedang tidak memiliki tiket masuk.</p>
                        <button onClick={() => setShowTicketPopup(false)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                            <FontAwesomeIcon icon={faTimes} size="2x" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Link to="/userprofile" className="absolute top-4 left-4 flex flex-col items-center">
                <div className="bg-white bg-opacity-50 rounded-lg p-2 flex flex-col items-center cursor-pointer">
                    <FontAwesomeIcon icon={faUserCircle} size="2x" />
                    <p className='font-semibold mt-1' style={{ fontSize: '13px' }}>Profile</p>
                </div>
            </Link>

            <div className="absolute top-4 right-4 flex items-center">
                <button onClick={() => setShowTicketPopup(true)} className="bg-white bg-opacity-50 rounded-lg p-2 cursor-pointer flex flex-col items-center mr-2">
                    <FontAwesomeIcon icon={faTicket} size="2x" />
                    <p className='font-semibold' style={{ fontSize: '13px' }}>Tiket</p>
                </button>
                <Link to="/history" className="bg-white bg-opacity-50 rounded-lg p-2 cursor-pointer flex flex-col items-center">
                    <FontAwesomeIcon icon={faFileLines} size="2x" />
                    <p className='font-semibold' style={{ fontSize: '13px' }}>Riwayat</p>
                </Link>
            </div>
            {showParkingQuota && (
                <div className="absolute top-36 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-50 p-4 rounded-md flex justify-between w-max">
                    <div className="flex items-center px-4">
                        <FontAwesomeIcon icon={faCar} size="1x" className="mr-2" />
                        <span className="text-l font-semibold">: {carParkingCount} Tersedia</span>
                    </div>
                    <div className="flex items-center px-4">
                        <FontAwesomeIcon icon={faMotorcycle} size="1x" className="mr-2" />
                        <span className="text-l font-semibold">: {motorParkingCount} Tersedia</span>
                    </div>
                </div>
            )}

            {scanBox()}

            {showAlert && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg max-w-lg">
                        <Alert severity={alertSeverity}>
                            <AlertTitle>{alertSeverity === 'error' ? 'Scan Gagal' : alertSeverity === 'warning' ? 'Peringatan' : 'Scan Berhasil'}</AlertTitle>
                            <p>{alertMessage}</p>
                        </Alert>
                    </div>
                </div>
            )}
            {showTicketPopup && renderTicket()}
            <Footer />
        </div>
    );
}

export default Dashboard;
