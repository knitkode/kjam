// import { join } from "path";
import type { Api, Entry } from "@kjam/core";
import type { SerializerBodyImgTransformer } from "./serializer";
import { replaceAsync } from "./utils";

/**
 * Get entry's `body` managing images
 */
async function treatBodyImages<T>(
  entry: Pick<Entry<T>, "body">,
  api: Api,
  mdImgTransformer: SerializerBodyImgTransformer
) {
  const regex = /!\[(.+)\][\s|\S]*?\((.+)\)/gm;
  let { body } = entry;

  body = await replaceAsync(body, regex, async (match) => {
    return await mdImgTransformer(match);
  });
  return body;
}

/**
 * Get entry managing images in `data`
 */
// async function treatDataImages<T>(entry: any, api: Api) {
//   for (const key in entry.data) {
//     if (key !== "body") {
//       treatDataImagesSlice(entry.data, key, entry.dir, api);
//     }
//   }

//   return entry as Entry<T>;
// }

/**
 * Get entry managing all images both in` body` and `data`
 *
 * There is no need to treat the dataImages as they are just plain urls already
 * treated by the `treatAllLinks` function. We do instead apply an image
 * specific transform inside the body where we can use MDX components.
 */
export async function treatAllImages<T>(
  entry: any,
  api: Api,
  mdImgTransformer: SerializerBodyImgTransformer
) {
  // entry = await treatDataImages(entry, api);
  entry.body = await treatBodyImages(entry, api, mdImgTransformer);

  return entry as Entry<T>;
}

// function treatDataImagesSlice(data: any, key: any, baseDir: string, api: Api) {
//   if (typeof data[key] === "string") {
//     const currentValue = data[key];
//     if (
//       currentValue.endsWith(".jpg") ||
//       currentValue.endsWith(".jpeg") ||
//       currentValue.endsWith(".png")
//     ) {
//       data[key] = api.getUrl(join(baseDir, currentValue));
//       // console.log("transformed: ", data[key]);
//     }
//   } else if (Array.isArray(data[key])) {
//     // console.log("is array", key);
//     for (let i = 0; i < data[key].length; i++) {
//       treatDataImagesSlice(data[key], i, baseDir, api);
//     }
//   } else if (
//     Object.prototype.toString.call(data[key]).slice(8, -1) === "Object"
//   ) {
//     // console.log("is object", key);
//     for (const subkey in data[key]) {
//       treatDataImagesSlice(data[key], subkey, baseDir, api);
//     }
//   }
// }
