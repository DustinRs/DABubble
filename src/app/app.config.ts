import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'dabubble-60ed0',
          appId: '1:79801300719:web:8f50ad1cbd70115d200d1a',
          storageBucket: 'gs://dabubble-60ed0.appspot.com',
          apiKey: 'AIzaSyAIwClpcwdQgB7xCWwrwC6ZuAPAymcTeHY',
          authDomain: 'dabubble-60ed0.firebaseapp.com',
          messagingSenderId: '79801300719',
        })
      )

    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
