import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { InterceptorService} from 'ng2-interceptors';

import { RequestHandlerService } from './request-handler.service';
import { HANDLER_CONFIG, HandlerConfig } from './config/handler.config';
import { fakeBackendProvider } from './tests/provider/fake-backend';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

export * from './request-handler.service';

export function InterceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, requestHandlerService: RequestHandlerService) {
  const service = new InterceptorService(xhrBackend, requestOptions);
  service.addInterceptor(requestHandlerService);
  return service;
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class RequestHandlerModule {

  static forRoot(handlerConfig: HandlerConfig): ModuleWithProviders {
    return {
      ngModule: RequestHandlerModule,
      providers: [
        {
          provide: HANDLER_CONFIG,
          useValue: handlerConfig
        },
        RequestHandlerService,
        {
          provide: Http,
          useFactory: InterceptorFactory,
          deps: [
            XHRBackend,
            RequestOptions,
            RequestHandlerService,
          ],
        },
      ]
    };
  }

  static forTesting(handlerConfig: HandlerConfig): ModuleWithProviders {
    return {
      ngModule: RequestHandlerModule,
      providers: [
        {
          provide: HANDLER_CONFIG,
          useValue: handlerConfig
        },
        RequestHandlerService,
        {
          provide: Http,
          useFactory: InterceptorFactory,
          deps: [
            XHRBackend,
            RequestOptions,
            RequestHandlerService,
          ],
        },
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions
      ]
    };
  }
}
