/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from "@sentry/angular";

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


Sentry.init({
  dsn: "https://1cad26add61b72e3aeae805878e3e3d0@o4507288437784576.ingest.de.sentry.io/4507289322324048",
  integrations: [],
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
