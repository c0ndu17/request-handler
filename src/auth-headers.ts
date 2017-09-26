export class AuthHeaders {
  public access_token: string;
  public refresh_token: string;
  public client: string;
  public id: string;

  /**
   * AuthHeaders model to be constructed from the response headers of a HTTP request
   */
  constructor(data?: any) {
    if (data) {
      if (data.access_token) {
        this.access_token = data.access_token;
      }

      if (data.refresh_token) {
        this.refresh_token = data.refresh_token;
      }

      if (data.client) {
        this.client = data.client;
      }

      if (data.id) {
        this.id = data.id;
      }
    }
  }
}
