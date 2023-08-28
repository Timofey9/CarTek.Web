 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import ApiService from "../services/cartekApiService";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-BmtYusLNMfM131Cn9C0rDugk2qfexOU",
    authDomain: "cartek-d466b.firebaseapp.com",
    projectId: "cartek-d466b",
    storageBucket: "cartek-d466b.appspot.com",
    messagingSenderId: "55858631608",
    appId: "1:55858631608:web:279dc592f60b0a1357754d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export const requestForToken = () => {

    let localUser = JSON.parse(localStorage.getItem("user"));

    return getToken(messaging, { vapidKey: `aY94hIBbP3Zn6a3Tb0Q0sYuJ0fFdasCgsXuIYjadQF8` })
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
                if (localUser) {
                    ApiService.saveDeviceToken({
                        userId: localUser.identity.id,
                        token: currentToken,
                        isDriver: localUser.isDriver
                    });
                }
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
};


// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });