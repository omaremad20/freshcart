import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch , withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './core/interceptors/interceptors/error.interceptor';


export const appConfig: ApplicationConfig = {
  providers:
    [
    provideZoneChangeDetection({ eventCoalescing: true })
    , provideRouter(routes , withViewTransitions())
    , provideClientHydration(withEventReplay())
    , provideHttpClient(withFetch() , withInterceptorsFromDi() , withInterceptors([errorInterceptor]))
    , importProvidersFrom(BrowserAnimationsModule , NgxSpinnerModule) ,
    provideToastr(),
  ]
};
