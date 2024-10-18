
const getCookie = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; login=`);
    if (parts.length === 2) {
        let cookieValue = parts.pop().split(";").shift();
        const [id, key] = cookieValue.split('-');
        if (id) {
            return id
        }
    }
    return null;

};

export default getCookie;