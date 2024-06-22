export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
}

export function getUserFromCookie() {
    const userCookie = getCookie('user');
    if (userCookie) {
        return JSON.parse(decodeURIComponent(userCookie));
    }
    return null;
}

export function isUserDataComplete(user) {
    console.log('User data being checked:', user);
    const { nama, username, email, nomor_telp, nomor_polisi, detail_kendaraan } = user;
    return nama && username && email && nomor_telp && nomor_polisi && detail_kendaraan;
}
