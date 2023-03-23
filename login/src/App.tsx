import './App.css'
import StyledFirebaseAuth from './StyledFirebaseAuth'
import { GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import  * as firebaseui  from 'firebaseui'
import firebase from "firebase/compat/app";
import * as config from './config';
import AnonymousAuthProvider = firebaseui.auth.AnonymousAuthProvider;

function getCallbackUrl() {
  const params = (new URL(window.location.href)).searchParams;
  const encoded = params.get("cb");
  if(!encoded) {
    console.error("unable to get encoded callback");
    return;
  }
  const cb = atob(encoded);
  if(!cb) {
    console.error("unable to decode callback");
  }
  return cb;
}

export default function App() {
  const callback = getCallbackUrl();
  console.log("Callback URL: " + callback);
  console.log("Build info: " + config.BUILD_INFO);
  const app = firebase.initializeApp(config.FIREBASE_CONFIG);

  const c = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult: firebase.auth.UserCredential, redirectUrl: string) : boolean {
        if(!authResult) {
          alert("invalid authResult");
        }

        const userJson = authResult.user?.toJSON();
        if(!userJson) {
          alert("Invalid userJson");
        }

        const loginData = {
          user: userJson
        }
        const json = JSON.stringify(loginData);
        const d = encodeURIComponent(btoa(json));

        window.location.assign(`${callback}?d=${d}`);

        return false;
      },
      // signInFailure callback must be provided to handle merge conflicts which
      // occur when an existing credential is linked to an anonymous user.
      signInFailure: function(error: firebaseui.auth.AuthUIError) {
        console.error(`Error: ${error.code}\nMessage: ${error.message}`);
      }
    },
    autoUpgradeAnonymousUsers: false,
    signInSuccessUrl: 'https://yahoo.com',
    signInFlow: 'popup',
    signInOptions: [
      GithubAuthProvider.PROVIDER_ID,
      GoogleAuthProvider.PROVIDER_ID,
      AnonymousAuthProvider.PROVIDER_ID
    ],
    // TODO: Add TOS and Privacy Policy
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function() {
      window.location.assign('<your-privacy-policy-url>');
    }
  };

  return (
    <div className="App">
      <StyledFirebaseAuth uiConfig={c} firebaseAuth={firebase.auth(app)} />
    </div>
  )
}
