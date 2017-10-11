import { Headers, RequestOptions } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { RequestHandlerService } from '../src/request-handler.service';
import { configureTests } from '../tools/tests.configure';
import { RequestHandlerModule } from '../src/index';
import { InterceptedResponse, InterceptedRequest } from 'ng2-interceptors';


describe('Service: Request Handler', () => {
  let requestHandlerService: RequestHandlerService;

  beforeEach(done => {
    const configure = (testBed: TestBed) => {
      testBed.configureTestingModule({
        imports: [
          RequestHandlerModule.forTesting({
            clientAccessTokenName: 'accessToken',
            clientRefreshTokenName: 'refreshToken',
            serverAccessTokenName: 'X-Access-Token',
            serverRefreshTokenName: 'X-Refresh-Token',
            refreshUrl: 'test://localhost:3000',
          })
        ],
      });
    };

    configureTests(configure).then((testBed) => {
      requestHandlerService = testBed.get(RequestHandlerService);
      done();
    });
  });

  it('is configuration valid', () => {
    expect(requestHandlerService.config).toEqual({
      clientAccessTokenName: 'accessToken',
      clientRefreshTokenName: 'refreshToken',
      serverAccessTokenName: 'X-Access-Token',
      serverRefreshTokenName: 'X-Refresh-Token',
      refreshUrl: 'test://localhost:3000',
    });
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
    headers.append(requestHandlerService.config.clientAccessTokenName,
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1MDc3Mjc3NTcsImV4cCI6MTUwNzcyODA5OSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.s8mD1ntB2Fjjwv5uZINfVAF4Z381UUr8ZAG7LSakGWM'
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
    storageObject[requestHandlerService.config.clientRefreshTokenName] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1MDc3Mjc3NTcsImV4cCI6MTUzOTI2NTUwNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.7LMcIstqSJutGWfXa0G4Nt4w8dGJt-1BItCZDXrGnEU';


    localStorage.setItem('auth.headers', JSON.stringify(storageObject));

    let headers = new Headers();
    headers.append(requestHandlerService.config.clientAccessTokenName,
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1MDc3Mjc3NTcsImV4cCI6MTUwNzcyODA5OSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.s8mD1ntB2Fjjwv5uZINfVAF4Z381UUr8ZAG7LSakGWM'
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

    requestHandlerService.interceptBefore(interceptedRequest).subscribe((res) => {
      expect(res.headers.get(requestHandlerService.config.serverAccessTokenName)).toBe(
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1MDc3Mjc3NTcsImV4cCI6MTUwNzczMjUyMywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.XSlAo8SL-pLBK4eLCPLAGZ4Mz732x2yGAM4WW_PwmYg'
      );
      done();
    });

  });

});
