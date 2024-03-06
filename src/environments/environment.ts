/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //apiURL: 'https://selux-backend.herokuapp.com/api',
  apiURL: 'http://localhost:4100/api',

  firebaseConfig: {
    apiKey: "AIzaSyB-453yQHdTshJuNbfQEAoOa1S4FlOs1V4",
    authDomain: "rioolaansluitingen.firebaseapp.com",
    databaseURL: "https://rioolaansluitingen.firebaseio.com",
    projectId: "rioolaansluitingen",
    storageBucket: "rioolaansluitingen.appspot.com",
    messagingSenderId: "109025393554",
    appId: "1:109025393554:web:2b5c6b6837ae193a0d9f4b",
  },
};


