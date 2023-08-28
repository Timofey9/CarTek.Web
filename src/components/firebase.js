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

    return getToken(messaging, {
        vapidKey: `BDK-Y_OdQPQv8mvFrUQCddzb9iXQ7VHfpMMCH4Y1CnVdq_QggosLsKCIJBJey6PHRsIJBi7jr9Tqknzpo10nhRU` })
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
                if (localUser) {
                    if (!isTokenSentToServer(currentToken)) {

                        ApiService.saveDeviceToken({
                            token: currentToken,
                            userId: localUser.identity.id,
                            isDriver: localUser.isDriver
                        });
                        setTokenSentToServer(currentToken);
                    }
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

// используем localStorage для отметки того,
// что пользователь уже подписался на уведомления
function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
}

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });