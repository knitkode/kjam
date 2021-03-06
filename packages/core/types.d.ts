// FIXME: I cannot include this in the right way in the build process...

// type Brand<K, T> = K & { _brand: T };
type username = string & { _brand: true }; // Brand<string, 'username'>;
type repo = string;
type branch = string;

interface KjamEnv {
  KJAM_GIT: `${username}/${repo}/${branch}`;
  KJAM_FOLDER?: string;
  KJAM_DEBUG?: "true" | "false";
}

declare namespace NodeJS {
  interface ProcessEnv extends KjamEnv {
    KJAM: undefined;
  }
}
