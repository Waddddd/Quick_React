import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/database';
import React, {useState, useEffect} from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Message } from 'rbx';
import CourseList from './components/CourseList';
import { addScheduleTimes } from './components/Course'

const firebaseConfig = {
  apiKey: "AIzaSyCFSLctaWmDbOn2KL4EVEehnCQzaL4pMc0",
  authDomain: "quickreact-ee9d7.firebaseapp.com",
  databaseURL: "https://quickreact-ee9d7.firebaseio.com",
  projectId: "quickreact-ee9d7",
  storageBucket: "",
  messagingSenderId: "672938207144",
  appId: "1:672938207144:web:b065041983477c18701f9d"
};

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const Banner = ({ user, title }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
    <Title>{ title || '[loading...]' }</Title>
  </React.Fragment>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const App = () => {
  const [schedule, setSchedule] = useState({ title: '', courses: [] });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    };
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return (
    <Container>
      <Banner title={ schedule.title } user={ user } />
      <CourseList courses={ schedule.courses } user={ user } />
    </Container>
  );
};

export default App;
export {db};