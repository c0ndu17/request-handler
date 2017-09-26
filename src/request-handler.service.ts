import { Injector, Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';

import { JwtHelper } from 'angular2-jwt';
import { Interceptor, InterceptedRequest } from 'ng2-interceptors';

// TODO: Uncomment when Observable type can be returned
// import { Observable } from 'rxjs/Observable';

/**
 * Models
 */
import { AuthHeaders } from './auth-headers';

@Injectable()
export class RequestHandlerService implements Interceptor {

  // TODO: Uncomment when endpoint is available
  // private jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private injector: Injector,
  ) {}

  /**
   * Injects http.
   */
  public get http(): Http {
    return this.injector.get(Http);
  }

  /**
   * Run before any http request is made
   *
   * You can return:
   *   - Request: The modified request
   *   - Nothing: For convenience: It's just like returning the request
   *   - <any>(Observable.throw("cancelled")): Cancels the request,
   *     interrupting it from the pipeline, and calling back 'interceptAfter'
   *     in backwards order of those interceptors that got called up to this point.
   */
  public interceptBefore(request: InterceptedRequest): any {
    /**
     * Check the request for the presence of a token:
     *  - If no token is present, continue the call as per usual.
     */
    // TODO: Delete
    if (/\/assets\//.test(request.url) || /\/tokens/.test(request.url) ) {
      return request;
    }
    // TODO: Uncomment when endpoint is available
    // const access_token = request.options.headers.get('access_token');
    // if (!access_token || !this.jwtHelper.isTokenExpired(access_token)) {
    //   return request;
    // }

    let currentCredentials = JSON.parse(localStorage.getItem('auth.headers'));

    /*
     * If there is no access token in local storage,
     * Reassign currentCredentials those in session storage.
     */
    if (currentCredentials && currentCredentials.access_token == null) {
      currentCredentials = JSON.parse(sessionStorage.getItem('auth.headers'));
    }

    const headers = new Headers();
    if (currentCredentials) {
      headers.append('X-Auth-Token', currentCredentials.access_token);
      headers.append('X-Refresh-Token', currentCredentials.refresh_token);
    }

    /*
     * TODO: Modify to handle an HTTP resource
     */
    const obs = this.http.post('http://localhost:3000/api/logins/tokens',
      {},
      {
        headers,
      }
    ).map((data) => {
      const responseData = data.json();
      const localItem = JSON.parse(localStorage.getItem('auth.headers'));
      const persist = localItem !== null && localItem.access_token !== null;

      // Populate the Auth Headers Object
      const authHeaders: AuthHeaders = new AuthHeaders();
      authHeaders.access_token = responseData.resource.access_token;
      authHeaders.refresh_token = responseData.resource.refresh_token;
      authHeaders.id = responseData.resource.id; // TODO: Check this is the new equivalent

      if (persist) {
        localStorage.setItem('auth.headers', JSON.stringify(authHeaders));
      } else {
        sessionStorage.setItem('auth.headers', JSON.stringify(authHeaders));
      }

      request.options.headers.set('X-Auth-Token', authHeaders.access_token);

      return request;
    });

    obs.subscribe((data) => {
      console.log(data);
    }, (err) => {
      console.log('Oh noooooo!!!! An error occured');
      console.log(err);
    });
    return obs;
  }
}

