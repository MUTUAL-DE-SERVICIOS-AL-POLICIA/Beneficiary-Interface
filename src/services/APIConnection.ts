import { checkCookie } from "../helpers/cookie";
export abstract class APIConnection {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected buildUrl(endpoint: string): string {
    return `${this.baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  }

  abstract GET(url: string, options?: any): Promise<any>;
  abstract POST(url: string, body: any, options?: any): Promise<any>;
  abstract PUT(url: string, body: any, options?: any): Promise<any>;
  abstract DELETE(url: string, options?: any): Promise<any>;

  protected addInterceptors(
    requestConfig: RequestInit,
    contentType: string | null = "application/json",
  ): RequestInit {
    const headers: any = requestConfig.headers || {};

    if (!(headers instanceof Headers)) {
      headers["credentials"] = "include";
      if (contentType) {
        headers["Content-Type"] = contentType;
      }
    }

    requestConfig.headers = headers;

    return requestConfig;
  }

  protected async handleRequest(endpoint: string, requestConfig: RequestInit): Promise<any> {
    const cookie = await checkCookie();

    if (cookie != undefined) {
      if (!requestConfig.headers) {
        requestConfig.headers = {};
      }
      if (requestConfig.headers instanceof Headers) {
        requestConfig.headers.append("Set-Cookie", `msp=${cookie};`);
      } else {
        (requestConfig.headers as Record<string, string>)["Set-Cookie"] = `msp=${cookie};`;
      }
    }
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, requestConfig);
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      if (contentType.includes("application/json")) {
        const errorData = await response.json();

        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
    }

    return response;
  }
}
