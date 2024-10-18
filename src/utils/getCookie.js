import SHA1 from "crypto-js/sha1";

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        let cookieValue = parts.pop().split(";").shift();
        const [id, key, token] = cookieValue.split('-');
        if (id && token) {
            const hashedToken = SHA1(token).toString();
            return { id, token: hashedToken };
        }
    }
    return null;

};

export default getCookie;