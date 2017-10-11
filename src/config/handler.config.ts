import { OpaqueToken } from '@angular/core';

export const HANDLER_CONFIG = new OpaqueToken('handler.config');

export interface HandlerConfig {
  clientAccessTokenName: string;
  clientRefreshTokenName: string;
  serverAccessTokenName: string;
  serverRefreshTokenName: string;
  refreshUrl: string;
}
