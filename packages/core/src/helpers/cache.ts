// FIXME: fix typescript for this class or it breaks the build...
// export class Cache {
//   static get<T>(key: string) {
//     return this[key] as T | null;
//   }

//   static set<T>(key: string, data: T) {
//     this[key] = data;
//     return this[key] as T;
//   }
// }

// fs based Cache sketch...
// import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
// import { resolve, join } from 'node:path';

// export class Cache {
//   folder: string;
//   map: Map<string, string>;

//   constructor(folder = '.cache') {
//     this.folder = resolve(process.cwd(), folder);
//     this.map = new Map();

//     if (!existsSync(this.folder)) {
//       mkdirSync(this.folder);
//     }
//   }

//   get(key: string) {
//     try {
//       let json;
//       if (this.map.has(key)) {
//         json = this.map.get(key);
//       } else {
//         json = readFileSync(join(this.folder, key), 'utf-8');
//       }
//       if (json) {
//         try {
//           return JSON.parse(json);
//         } catch (e) {
//           return;
//         }
//       }
//     } catch (e) {
//       return;
//     }
//   }

//   set(key: string, content: any) {
//     try {
//       if (!this.map.has(key)) {
//         const text = JSON.stringify(content);
//         this.map.set(key, text);

//         writeFileSync(join(this.folder, key), text, 'utf-8');
//       }
//       return true;
//     } catch (e) {
//       return;
//     }
//   }
// }

// export const cache = new Cache();
