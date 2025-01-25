interface Props {
  firstName: string;
  secondName: string;
  lastName: string;
  mothersLastName: string;
}

export default function fullName({ firstName, secondName, lastName, mothersLastName }: Props) {
  return `${firstName ?? ""}  ${secondName ?? ""} ${lastName ?? ""} ${mothersLastName ?? ""}`;
}

interface PropsBuildBackendUrl {
  host: string;
  port: string;
  path?: string;
}

export function buildBackendUrl({ host, port, path }: PropsBuildBackendUrl) {
  return `http://${host}:${port}/${path}`;
}

export function createEmptyObject<T>(): T {
  const result: Partial<T> = {};

  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = undefined;
    }
  }

  return result as T;
}
