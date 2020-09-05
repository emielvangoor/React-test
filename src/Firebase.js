import * as firebase from "firebase/app";
import "firebase/firestore";

import Config from "./Config";

firebase.initializeApp(Config.firebase);

export const db = firebase.firestore();
