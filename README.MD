# Request-handler

An Angular interceptor implementation. Uses a two token process to keep a user authenticated.

Created for an internal project, it's generic enough to work with your general refresher token implementation.


## Installation

To install this library, run:

```bash
$ npm install request-handler --save
```

## Consuming your library

The implementation can be imported via the following method:

```bash
$ npm install request-handler
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { RequestHandlerModule } from 'request-handler';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    RequestHandlerModule.forRoot({
      clientAccessTokenName: 'string',  // The key for the access token in storage.
      clientRefreshTokenName: 'string', // The key for the refresh token in storage. 
      serverAccessTokenName: 'string',  // The header value the access token is stored in
      serverRefreshTokenName: 'string', // The header value the refresh token is stored in.
      refreshUrl: 'string' // Endpoint to be hit to refresh the access token when it expires.
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [george phillips](mailto:george.phillips@blackswan.com)
