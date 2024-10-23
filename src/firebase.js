import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCNZRHQqmbLIun1N3tll25xEKjtHMlQlT8",
    authDomain: "netflix-clone-e9f19.firebaseapp.com",
    projectId: "netflix-clone-e9f19",
    storageBucket: "netflix-clone-e9f19.appspot.com",
    messagingSenderId: "73802775364",
    appId: "1:73802775364:web:b07d73541c72c9ca2b3511"
  };

  const firebaseApp = initializeApp(firebaseConfig)
  const db = getFirestore(firebaseApp)
  const auth = getAuth(firebaseApp)

  export { auth }
  export default db