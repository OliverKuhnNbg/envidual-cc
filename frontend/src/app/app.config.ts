import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

/*
 * ADR: Diagnostic Root Bootstrapping
 * Context: The application fails to mount when injecting standard HTTP providers, resulting in a blank screen.
 * Decision: Strip all custom error listeners and interceptors. Provide strictly the absolute minimum required providers (Zone.js detection and HttpClient) from official @angular packages.
 * Consequence: Isolates the runtime failure. If this configuration crashes, the root cause lies in a corrupted node_modules tree or missing polyfills, not in our application logic.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideHttpClient()],
};
