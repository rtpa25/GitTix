import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyATysjvSVm1c_-sbZYvUyK8HwwV9mp1J20',
    authDomain: 'ticketing-d58e2.firebaseapp.com',
    projectId: 'ticketing-d58e2',
    storageBucket: 'ticketing-d58e2.appspot.com',
    messagingSenderId: '923145500070',
    appId: '1:923145500070:web:ad678951965bf4650d0b67',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
