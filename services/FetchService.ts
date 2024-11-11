import { APIConnection } from './APIConnection';

export class FetchService extends APIConnection {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async GET(endpoint: string, params?: Record<string, string>, contentType: string = 'application/json', signal?: AbortSignal): Promise<any> {
    let url = endpoint;
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      url += `?${queryParams}`;
    }
    const requestConfig = this.addInterceptors({
      method: 'GET',
      credentials: 'include',
      signal,
    }, contentType);
    return this.handleRequest(url, requestConfig);
  }

  async POST(endpoint: string, body: any, signal?: AbortSignal): Promise<any> {
    const requestConfig = this.addInterceptors({
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(body),
      signal,
    });
    return this.handleRequest(endpoint, requestConfig);
  }

  async PUT(endpoint: string, body: any, signal?: AbortSignal): Promise<any> {
    const requestConfig = this.addInterceptors({
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(body),
      signal,
    });
    return this.handleRequest(endpoint, requestConfig);
  }
  async DELETE(endpoint: string, signal?: AbortSignal): Promise<any> {
    const requestConfig = this.addInterceptors({
      method: 'DELETE',
      credentials: 'include',
      signal
    });
    return this.handleRequest(endpoint, requestConfig);
  }
}
