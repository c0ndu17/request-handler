import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { InterceptorService} from 'ng2-interceptors';
import { RequestHandlerService } from './request-handler.service';

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
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RequestHandlerModule,
      providers: [
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
}
