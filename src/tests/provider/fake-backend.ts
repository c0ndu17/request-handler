import { Http, Headers, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { validToken } from '../constants';

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
  backend.connections.subscribe((connection: MockConnection) => {
    /**
     * Simulate response time
     */
      if (connection.request.url.substring(0, 7) === 'test://' && connection.request.method === RequestMethod.Post) {

        const headers = new Headers({
          'X-Access-Token': validToken,
        });
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              status: 200,
              headers,
            })
          )
        );
      } else {
        let realHttp = new Http(realBackend, options);
        let requestOptions = new RequestOptions({
            method: connection.request.method,
            headers: connection.request.headers,
            body: connection.request.getBody(),
            url: connection.request.url,
            withCredentials: connection.request.withCredentials,
            responseType: connection.request.responseType
        });
        realHttp.request(connection.request.url, requestOptions)
            .subscribe((response: Response) => {
                connection.mockRespond(response);
            },
            (error: any) => {
                connection.mockError(error);
        });
      };
      return;
  });

  return new Http(backend, options);
};

export const fakeBackendProvider = {
      // use fake backend in place of Http service for backend-less development
      provide: Http,
      useFactory: fakeBackendFactory,
      deps: [MockBackend, BaseRequestOptions, XHRBackend]
};
