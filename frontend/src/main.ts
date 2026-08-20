import 'zone.js'; // ZWINGEND ALS ERSTES LADEN
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

/*
 * ADR: Explicit Polyfill Inclusion for Zone.js
 * Context: The application crashed with NG0908 because the execution context lacked the Zone.js polyfill required by provideZoneChangeDetection.
 * Decision: Explicitly import 'zone.js' at the application entry point rather than relying on abstract builder configurations (angular.json polyfill arrays).
 * Consequence: Guarantees that asynchronous browser APIs are monkey-patched before Angular attempts to bootstrap, eliminating fatal runtime rendering failures and stabilizing the Vite dev environment.
 */
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
