import { cookies } from 'next/headers';
export abstract class APIConnection {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected buildUrl(endpoint: string): string {
    console.log(`${this.baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`);
    return `${this.baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  }

  abstract GET(url: string, options?: any): Promise<any>;
  abstract POST(url: string, body: any, options?: any): Promise<any>;
  abstract PUT(url: string, body: any, options?: any): Promise<any>;
  abstract DELETE(url: string, options?: any): Promise<any>;

  protected addInterceptors(requestConfig: RequestInit): RequestInit {
    const interceptors = {
      headers: {
        'Content-Type': 'application/json',
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
    const getCookie = async (name: string) => {
      return cookies().get(name)?.value ?? '';
    };

    const cookie = await getCookie('Set-Cookie');

    if (cookie != undefined) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Cookie: `Set-Cookie=${cookie};`,
      };
    }

    const url = this.buildUrl(endpoint);

    try {
      const response = await fetch(url, requestConfig);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error('Error de Red o CORS');
      }
      throw error;
    }
  }
}
