import type { Api } from "@kjam/core";
import type { SerializerBodyImgTransformer } from "./serializer";
/**
 * Get entry managing images in `data`
 */
/**
 * Get entry managing all images both in` body` and `data`
 *
 * There is no need to treat the dataImages as they are just plain urls already
 * treated by the `treatAllLinks` function. We do instead apply an image
 * specific transform inside the body where we can use MDX components.
 */
export declare function treatAllImages<T>(entry: any, api: Api, mdImgTransformer: SerializerBodyImgTransformer): Promise<Entry<T>>;
