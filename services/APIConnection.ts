import { checkCookie } from '../helpers/cookie';
export abstract class APIConnection {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected buildUrl(endpoint: string): string {
    // console.log(`${this.baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`);
    return `${this.baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  }

  abstract GET(url: string, options?: any): Promise<any>;
  abstract POST(url: string, body: any, options?: any): Promise<any>;
  abstract PUT(url: string, body: any, options?: any): Promise<any>;
  abstract DELETE(url: string, options?: any): Promise<any>;

  protected addInterceptors(
    requestConfig: RequestInit,
    contentType: string = 'application/json'
  ): RequestInit {
    const interceptors = {
      headers: {
        'Content-Type': contentType
      },
    };
    return {
      ...requestConfig,
      headers: {
        ...requestConfig.headers,
        ...interceptors.headers,
      },
    };
  }

  protected async handleRequest(endpoint: string, requestConfig: RequestInit): Promise<any> {
    const cookie = await checkCookie();
    if (cookie != undefined) {
      requestConfig.headers = {
        ...requestConfig.headers,
        "Set-Cookie": `msp=${cookie};`,
      };
    }

    const url = this.buildUrl(endpoint);

    const response = await fetch(url, requestConfig);
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok) {
      if (contentType.includes('application/json')) {
        return response;
      }
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    return response;
  }
}
