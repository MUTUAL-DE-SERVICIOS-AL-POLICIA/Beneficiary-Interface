import { APIConnection } from "./APIConnection";
import { APIConnectionFactory } from "./APIConnectionFactory";
import { FetchService } from "./FetchService";
import { frontend, backend} from "../env";
import { checkIp } from "../helpers/ip";
export class FetchServiceFactory extends APIConnectionFactory {
  private baseUrl: string;

  constructor(baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
  }

  public createAPIConnection(): APIConnection {
    return new FetchService(this.baseUrl);
  }
}

const baseUrlBackend = backend.url+"/api/";
const baseUrlFrontend = frontend.url;
const factory = new FetchServiceFactory(baseUrlBackend);
const factoryFront = new FetchServiceFactory(baseUrlFrontend);
export const apiClient = factory.createAPIConnection();

export const apiServerFrontend = factoryFront.createAPIConnection();
export const urlLogin = frontend.url;
export const urlHubFront = frontend.url;


export const apiClientBiometric = async () => {
  const ip = await checkIp();
  const biometricHost = ip || "localhost";
  const biometricPort = process.env.NEXT_PUBLIC_BIOMETRIC_PORT || 8899;
  const baseUrlBiometric = `http://${biometricHost}:${biometricPort}/api/`;
  const biometricFactory = new FetchServiceFactory(baseUrlBiometric);

  return biometricFactory.createAPIConnection();
};
