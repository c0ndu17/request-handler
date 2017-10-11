/*
 * Third party
 */
import { Inject, Injector, Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Interceptor, InterceptedResponse, InterceptedRequest } from 'ng2-interceptors';
import { Observable } from 'rxjs/Observable';

/**
 * Models
 */
import { HANDLER_CONFIG, HandlerConfig } from './config/handler.config';

@Injectable()
export class RequestHandlerService implements Interceptor {

  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private injector: Injector,
    @Inject(HANDLER_CONFIG) private handlerConfig: HandlerConfig
  ) {}


  /**
   * Injects http.
   */
  public get http(): Http {
    return this.injector.get(Http);
  }

  public get config(): HandlerConfig {
    return this.handlerConfig;
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
  public interceptBefore(request: InterceptedRequest): InterceptedRequest | Observable<InterceptedRequest> {

    /**
     * Check the request for the presence of a token:
     *  - If no token is present, continue the call as per usual.
     */
    const accessToken = request.options.headers.get(this.config.clientAccessTokenName);
    if (!accessToken || !this.jwtHelper.isTokenExpired(accessToken)) {
      return request;
    }

    let currentCredentials = JSON.parse(localStorage.getItem('auth.headers'));

    /**
     * If there is no access token in local storage,
     * Reassign currentCredentials those in session storage.
     */
    if (!currentCredentials || (currentCredentials && currentCredentials[this.handlerConfig.clientRefreshTokenName] == null)) {
      currentCredentials = JSON.parse(sessionStorage.getItem('auth.headers'));
    }


    /**
     * Set the headers for the request.
     * If the refresh token is not present, throw an error.
     */
    const headers = new Headers();
    headers.append(this.handlerConfig.serverAccessTokenName, accessToken);
    if (currentCredentials && currentCredentials[this.handlerConfig.clientRefreshTokenName]) {
      headers.append(this.handlerConfig.serverRefreshTokenName, currentCredentials[this.handlerConfig.clientRefreshTokenName]);
    } else {
      throw Error('No Refresh Token available');
    }

    // ==================================

    /*
     * TODO: Modify to handle an HTTP resource
     */
    const obs = this.http.post(
      this.handlerConfig.refreshUrl,
      {},
      {
        headers,
      }
    ).map((res) => {
      const localItem = JSON.parse(localStorage.getItem('auth.headers'));
      const persist = localItem !== null && localItem[this.handlerConfig.clientAccessTokenName] !== null;


      console.log(res.headers.get(this.handlerConfig.serverAccessTokenName);
      console.log(res.headers.get(this.handlerConfig.serverRefreshTokenName);

      // Populate the Auth Headers Object
      console.log(res);

      const authHeaders = {};
      console.log(this.handlerConfig.serverAccessTokenName);
      authHeaders[this.handlerConfig.clientAccessTokenName] = res.headers.get(this.handlerConfig.serverAccessTokenName);
      console.log(this.handlerConfig.serverRefreshTokenName);
      authHeaders[this.handlerConfig.clientRefreshTokenName] = res.headers.get(this.handlerConfig.serverRefreshTokenName);

      if (persist) {
        localStorage.setItem('auth.headers', JSON.stringify(authHeaders));
        sessionStorage.removeItem('auth.headers');
      } else {
        sessionStorage.setItem('auth.headers', JSON.stringify(authHeaders));
        localStorage.removeItem('auth.headers');
      }

      request.options.headers.set(this.handlerConfig.serverAccessTokenName, authHeaders[this.handlerConfig.clientAccessTokenName]);

      return request;
    });

    return obs;
  }

  public interceptAfter(response: InterceptedResponse): InterceptedResponse {
    console.log('INTERCEPTED RESPONSE');
    console.log(response);
    return response;
  }
}

