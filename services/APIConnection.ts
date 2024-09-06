
export abstract class APIConnection {

   protected baseUrl: string;

   constructor(baseUrl: string) {
      this.baseUrl = baseUrl
   }

   protected buildUrl(endpoint: string): string {
      return `${this.baseUrl}${endpoint}`
   }

   abstract GET(url: string, options?: any): Promise<any>
   abstract POST(url: string, body: any, options?:any): Promise<any>
   abstract PUT(url: string, body: any, options?:any): Promise<any>
   abstract DELETE(url: string, options?:any): Promise<any>

   protected addInterceptors(requestConfig: RequestInit): RequestInit {
      const interceptors = {
         headers: {
            'Content-Type': 'application/json'
         }
      }
      return {
         ...requestConfig,
         headers: {
            ...requestConfig.headers,
            ...interceptors.headers
         }
      }
   }
}