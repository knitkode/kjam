/**
 * FIXME: abstract static methods are not supported yet
 * @see https://github.com/microsoft/TypeScript/issues/34516
 */
export abstract class Api {
  abstract /* static */ getRaw(path: string): Promise<string>;

  abstract /* static */ getData<T>(path: string): Promise<T>;
}
