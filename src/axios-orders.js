import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-bd745.firebaseio.com/'
});

export default instance;