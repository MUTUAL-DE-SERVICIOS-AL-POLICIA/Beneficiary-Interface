import { beforeAll, vi } from "vitest";

// beforeAll( () => {
//    vi.mock("next/navigation", () => require("next-router-mock"))
// })

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => null;
  vi.mock("next/navigation", () => ({
    _esModule: true,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      isFallback: false,
    }),
    useParams: () => ({
      get: () => {},
      query: {
        id: 15,
      },
    }),
    usePathname: () => ({
      pahtname: "",
    }),
  }));
});
