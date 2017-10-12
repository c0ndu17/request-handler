import { Headers, RequestOptions } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { RequestHandlerService } from '../src/request-handler.service';
import { configureTests } from '../tools/tests.configure';
import { RequestHandlerModule } from '../src/index';
import { InterceptedResponse, InterceptedRequest } from 'ng2-interceptors';

import {
  testConfig,
  expiredToken,
  refreshToken,
  validToken,
} from '../src/tests/constants';


describe('Service: Request Handler', () => {
  let requestHandlerService: RequestHandlerService;

  beforeEach(done => {
    const configure = (testBed: TestBed) => {
      testBed.configureTestingModule({
        imports: [
          RequestHandlerModule.forTesting(testConfig)
        ],
      });
    };

    configureTests(configure).then((testBed) => {
      requestHandlerService = testBed.get(RequestHandlerService);
      done();
    });
  });

  it('is configuration valid', () => {
    expect(requestHandlerService.config).toEqual(testConfig);
  });

  it('Passes on request without token present', () => {
    let headers = new Headers();
    let options = new RequestOptions({
      headers,
    });
    let interceptedRequest: InterceptedRequest = {
      url: 'test://',
      options,
      interceptorOptions: {
      },
    };
    const result = requestHandlerService.interceptBefore(interceptedRequest);

    expect(result).toBe(interceptedRequest);
  });

  it('Throws error if the access token is invalid JWT', () => {
    let headers = new Headers();
    headers.append(requestHandlerService.config.clientAccessTokenName, 'adadasd');
    let options = new RequestOptions({
      headers,
    });
    let interceptedRequest: InterceptedRequest = {
      url: 'test://asdasdas',
      options,
      interceptorOptions: {
      },
    };

    expect(() => requestHandlerService.interceptBefore(interceptedRequest)).toThrowError('JWT must have 3 parts');

  });

  it('Throws an error if there is no refresh token present ', () => {
    let headers = new Headers();
    headers.append(
      requestHandlerService.config.clientAccessTokenName,
      expiredToken
    );

    let options = new RequestOptions({
      headers,
    });

    let interceptedRequest: InterceptedRequest = {
      url: 'test://',
      options,
      interceptorOptions: {
      },
    };

    expect(() => requestHandlerService.interceptBefore(interceptedRequest)).toThrowError('No Refresh Token available');

  });

  it('Calls refresher endpoint ', (done) => {
    const storageObject = {};
    storageObject[requestHandlerService.config.clientRefreshTokenName] = refreshToken;


    localStorage.setItem('auth.headers', JSON.stringify(storageObject));

    let headers = new Headers();
    headers.append(requestHandlerService.config.clientAccessTokenName, expiredToken);

    let options = new RequestOptions({
      headers,
    });

    let interceptedRequest: InterceptedRequest = {
      url: 'test://',
      options,
      interceptorOptions: {
      },
    };

    requestHandlerService.interceptBefore(interceptedRequest).subscribe((res) => {
      const authHeaders = JSON.parse(localStorage.getItem('auth.headers'));
      expect(authHeaders[requestHandlerService.config.clientAccessTokenName]).toBe(validToken);
      done();
    });

  });

});
