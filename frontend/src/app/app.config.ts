import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

// Register the German locale data synchronously before the app boots
registerLocaleData(localeDe, 'de-DE');

/*
 * ADR: Diagnostic Root Bootstrapping
 * Context: The application fails to mount when injecting standard HTTP providers, resulting in a blank screen.
 * Decision: Strip all custom error listeners and interceptors. Provide strictly the absolute minimum required providers (Zone.js detection and HttpClient) from official @angular packages.
 * Consequence: Isolates the runtime failure. If this configuration crashes, the root cause lies in a corrupted node_modules tree or missing polyfills, not in our application logic.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'de-DE' },
  ],
};
