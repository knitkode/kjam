'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fsExtra = require('fs-extra');
var grayMatter = require('gray-matter');
var jsYaml = require('js-yaml');
var core = require('@kjam/core');
var path = require('path');
var fdir = require('fdir');

function _array_like_to_array$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes$1(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array$1(arr);
}
function asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator$4(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterable_to_array_limit$1(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array$1(arr, i) {
    return _array_with_holes$1(arr) || _iterable_to_array_limit$1(arr, i) || _unsupported_iterable_to_array$1(arr, i) || _non_iterable_rest$1();
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array$1(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$1(o, minLen);
}
function _ts_generator$4(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
/**
 * Only keep `.md` and `.mdx` files based on filename
 */ function filterMarkdownFiles(filenameOrPath) {
    return filenameOrPath.endsWith(".md") || filenameOrPath.endsWith(".mdx");
}
function extractMeta(filepath, i18n) {
    var pathParts = filepath.split("/");
    var filename = pathParts[pathParts.length - 1];
    // clean directory from path, e.g. "./news/a-title/index.it.md" to "news/a-title"
    var dir = core.normalisePathname(pathParts.slice(0, -1).join("/").replace(/\./g, ""));
    // const dirParts = dir.split("/");
    // const parentDirs = dirParts.slice(0, -1).join("/");
    var filenameParts = filename.split(".");
    // const ext = filenameParts[filenameParts.length - 1];
    // const basename = filename.replace(`.${ext}`, "");
    var locale = filenameParts.length > 2 ? filenameParts[filenameParts.length - 2] : i18n.defaultLocale;
    return {
        dir: dir,
        // parentDirs,
        // filename,
        // basename,
        // ext,
        locale: locale
    };
}
/**
 * Quickly clean markdown specific syntax and mdx imports and components
 */ function getExcerpt(content) {
    var maxChars = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 160;
    var cleaned = content.replace(/<[\n|\s|\S|.]*?>|\n|!\[.*?\]|\[|\]|\(.*?\)|#.*?\n|import\s.*?\n|\*|\*\*|_|__|>.*?\n/gm, "");
    var truncated = cleaned.slice(0, maxChars + 0);
    if (cleaned.length > maxChars) {
        truncated += "...";
    }
    return truncated;
}
function extractMatter(filepath) {
    var _read = grayMatter.read(filepath, {
        excerpt: true,
        engines: {
            // turn off automatic date parsing
            // @see https://github.com/jonschlinkert/gray-matter/issues/62#issuecomment-577628177
            // @ts-expect-error I don't think this is important
            yaml: function(s) {
                return jsYaml.load(s, {
                    schema: jsYaml.JSON_SCHEMA
                });
            }
        }
    }), content = _read.content, excerpt = _read.excerpt, data = _read.data;
    return {
        body: content,
        excerpt: excerpt || getExcerpt(content),
        data: data
    };
}
function extractRoute(meta, matter) {
    var _matter_data_slug, _matter_data;
    var dir = meta.dir;
    var dirParts = dir.split("/");
    var _matter_data_slug_split;
    var matterSlugParts = (_matter_data_slug_split = (_matter_data = matter.data) === null || _matter_data === void 0 ? void 0 : (_matter_data_slug = _matter_data.slug) === null || _matter_data_slug === void 0 ? void 0 : _matter_data_slug.split("/")) !== null && _matter_data_slug_split !== void 0 ? _matter_data_slug_split : [];
    // pages ids get the `pages/` part stripped out to act as root level routes
    // PAGES:
    // const id = dir.replace("pages/", "");
    var id = dir;
    // get the parent path of the entry's directory
    var parentDirs = dirParts.slice(0, -1).join("/")// PAGES: 
    .replace(/(pages\/*).*$/, "");
    // use last portion of the frontmatter defined `slug` key as priority slug
    var slugFromMatter = matterSlugParts[matterSlugParts.length - 1];
    // use last portion of the directory/id as fallback slug
    var slugFromDir = dirParts[dirParts.length - 1];
    // normalize the slug
    var slug = core.normalisePathname(slugFromMatter || slugFromDir || "");
    // special homepage case
    slug = slug === "home" ? "" : slug;
    var templateSlug = core.normalisePathname("".concat(parentDirs, "/").concat(slug));
    // const url = (urlPrepend ? `${urlPrepend}/` : urlPrepend) + slug;
    // remove the slug from frontmatter to avoid ambiguity, that one is
    // just represents what is coming from the CMS 'database' but the one to
    // use is the `slug` at the root level of the entry object
    delete matter.data.slug;
    return {
        id: id,
        templateSlug: templateSlug,
        slug: "",
        url: ""
    };
}
/**
 * Check if the given folder path is a folder containing a collection of entries
 */ function isCollectionPath(fullpath) {
    if (!fsExtra.existsSync(fullpath)) {
        return false;
    }
    var children = fsExtra.readdirSync(fullpath, {
        withFileTypes: true
    });
    return children.filter(function(dirent) {
        var isDir = dirent.isDirectory();
        if (!isDir) return false;
        var name = dirent.name;
        // TODO: test for this behaviour...
        return name !== "media" && name !== "photos" && name !== "images";
    }).length > 0;
}
function replaceAsync(str, regex, asyncFn) {
    return _replaceAsync.apply(this, arguments);
}
function _replaceAsync() {
    _replaceAsync = _async_to_generator$4(function(str, regex, asyncFn) {
        var promises, data;
        return _ts_generator$4(this, function(_state) {
            switch(_state.label){
                case 0:
                    promises = [];
                    // @ts-expect-error FIXME: No time for this...
                    str.replace(regex, function() {
                        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                            args[_key] = arguments[_key];
                        }
                        promises.push(asyncFn.apply(void 0, _to_consumable_array(args)));
                    });
                    return [
                        4,
                        Promise.all(promises)
                    ];
                case 1:
                    data = _state.sent();
                    // @ts-expect-error FIXME: No time for this...
                    return [
                        2,
                        str.replace(regex, function() {
                            return data.shift();
                        })
                    ];
            }
        });
    });
    return _replaceAsync.apply(this, arguments);
}
function parseUrl() {
    var url = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    var _path_match;
    var _url_split = _sliced_to_array$1(url.split("?"), 2), path = _url_split[0], query = _url_split[1];
    var params = Object.fromEntries(new URLSearchParams(query));
    var relative = /^(?!\/\/)[.|/]/.test(path);
    var ext = (_path_match = path.match(/.+(\.[a-zA-Z0-9]+)$/)) === null || _path_match === void 0 ? void 0 : _path_match[1];
    return {
        path: path,
        query: query ? "?".concat(query) : "",
        params: params,
        relative: relative,
        file: !!ext,
        ext: ext
    };
}

// import probe from "probe-image-size";
function asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator$3(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _class_call_check$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties$1(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
}
function _define_property$1(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_generator$3(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var Img = /*#__PURE__*/ function() {
    function Img() {
        var markdownString = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
        _class_call_check$1(this, Img);
        // baseUrl: string;
        _define_property$1(this, "md", void 0);
        _define_property$1(this, "originalUrl", void 0);
        _define_property$1(this, "alt", void 0);
        _define_property$1(this, "source", void 0);
        this.md = markdownString;
        this.originalUrl = "";
        this.parseMarkdown();
    }
    _create_class$1(Img, [
        {
            key: "parseMarkdown",
            value: function parseMarkdown() {
                var regex = /!\[(.+)\]\((.+)\)/;
                var matches = this.md.match(regex);
                if (matches) {
                    var alt = matches[1];
                    var source = matches[2];
                    // const isRelative = source.startsWith(".");
                    // const relativeUrl = isRelative ? source.replace(/^\./, "") : "";
                    // this.originalUrl = relativeUrl ? this.baseUrl + relativeUrl : source;
                    this.originalUrl = source;
                    this.alt = alt;
                }
            }
        },
        {
            key: "getInfoFromParams",
            value: function getInfoFromParams() {
                var _this = this;
                return _async_to_generator$3(function() {
                    var params, width, height, ratio;
                    return _ts_generator$3(this, function(_state) {
                        params = parseUrl(_this.originalUrl).params;
                        width = Number(params.width || params.w) || 0;
                        height = Number(params.height || params.h) || 0;
                        ratio = params.ratio || "";
                        // console.log("kjam/img::getInfoFromParams originalUrl is", this.originalUrl);
                        // const start = performance.now();
                        // const { width, height } = await probe(this.originalUrl);
                        // console.log(`kjam/img:getInfoFromParams took ${performance.now() - start}ms for image at url ${this.originalUrl}`);
                        return [
                            2,
                            {
                                width: width,
                                height: height,
                                ratio: ratio
                            }
                        ];
                    });
                })();
            }
        },
        {
            key: "toComponent",
            value: /**
   * Expected output:
   * ```md
   * ![text](https://ciao.com/path-to-img.jpg)
   * ```
   */ // async toMarkdown() {
            //   const imgRegex = /(!\[.+\])\((\.)(.+)\)/gm;
            //   const imgSubst = `$1(${this.baseUrl}$3)`;
            //   const output = this.md.replace(imgRegex, imgSubst);
            //   return output;
            // }
            /**
   * Expected output:
   * ```jsx
   * <Img alt="text" src="https://ciao.com/path-to-img.jpg"/>
   * ```
   */ function toComponent(attrs) {
                var _this = this;
                return _async_to_generator$3(function() {
                    var _ref, width, height, ratio, attributes;
                    return _ts_generator$3(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.getInfoFromParams()
                                ];
                            case 1:
                                _ref = _state.sent(), width = _ref.width, height = _ref.height, ratio = _ref.ratio;
                                attributes = 'src="'.concat(_this.originalUrl, '" alt="').concat(_this.alt, '"');
                                attributes += width ? " width={".concat(width, "}") : "";
                                attributes += height ? " height={".concat(height, "}") : "";
                                attributes += ratio ? ' ratio="'.concat(ratio, '"') : "";
                                if (attrs) {
                                    attributes += " ".concat(attrs);
                                }
                                return [
                                    2,
                                    "<Img ".concat(attributes, " />")
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "toHtml",
            value: /**
   * Expected output:
   * ```html
   * <img alt="text" src="https://ciao.com/path-to-img.jpg" />
   * ```
   *
   * @see https://regex101.com/r/slDmIl/1
   */ function toHtml() {
                var _this = this;
                return _async_to_generator$3(function() {
                    var _ref, width, height, ratio, attributes;
                    return _ts_generator$3(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.getInfoFromParams()
                                ];
                            case 1:
                                _ref = _state.sent(), width = _ref.width, height = _ref.height, ratio = _ref.ratio;
                                attributes = 'src="'.concat(_this.originalUrl, '" alt="').concat(_this.alt, '"');
                                attributes += width ? ' width="'.concat(width, '"') : "";
                                attributes += height ? ' height="'.concat(height, '"') : "";
                                attributes += ratio ? ' data-ratio="'.concat(ratio, '"') : "";
                                return [
                                    2,
                                    "<img ".concat(attributes, " />")
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return Img;
}();

// import { join } from "path";
function asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator$2(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator$2(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
function treatBodyImages(entry, api, mdImgTransformer) {
    return _treatBodyImages.apply(this, arguments);
}
function _treatBodyImages() {
    _treatBodyImages = /**
 * Get entry's `body` managing images
 */ _async_to_generator$2(function(entry, api, mdImgTransformer) {
        var regex, body;
        return _ts_generator$2(this, function(_state) {
            switch(_state.label){
                case 0:
                    regex = /!\[(.+)\][\s|\S]*?\((.+)\)/gm;
                    body = entry.body;
                    return [
                        4,
                        replaceAsync(body, regex, function() {
                            var _ref = _async_to_generator$2(function(match) {
                                return _ts_generator$2(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                mdImgTransformer(match)
                                            ];
                                        case 1:
                                            return [
                                                2,
                                                _state.sent()
                                            ];
                                    }
                                });
                            });
                            return function(match) {
                                return _ref.apply(this, arguments);
                            };
                        }())
                    ];
                case 1:
                    body = _state.sent();
                    return [
                        2,
                        body
                    ];
            }
        });
    });
    return _treatBodyImages.apply(this, arguments);
}
/**
 * Get entry managing images in `data`
 */ // async function treatDataImages<T>(entry: any, api: Api) {
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
 */ function treatAllImages(entry, api, mdImgTransformer) {
    return _treatAllImages.apply(this, arguments);
} // function treatDataImagesSlice(data: any, key: any, baseDir: string, api: Api) {
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
function _treatAllImages() {
    _treatAllImages = _async_to_generator$2(function(entry, api, mdImgTransformer) {
        return _ts_generator$2(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        treatBodyImages(entry, api, mdImgTransformer)
                    ];
                case 1:
                    // entry = await treatDataImages(entry, api);
                    entry.body = _state.sent();
                    return [
                        2,
                        entry
                    ];
            }
        });
    });
    return _treatAllImages.apply(this, arguments);
}

/**
 * Get translated link
 *
 */ function getTranslatedLink(raw, entry, api, urls) {
    var _urls_id;
    var id = "";
    var _parseUrl = parseUrl(raw), path$1 = _parseUrl.path, relative = _parseUrl.relative, file = _parseUrl.file, query = _parseUrl.query;
    if (!relative) {
        return raw;
    }
    var startsWithDot = path$1[0] === ".";
    if (startsWithDot) {
        var relativePath = path$1.replace(/\/index\..+/, "");
        id = path.join(entry.dir, relativePath);
    } else {
        id = core.normalisePathname(path$1);
    }
    if (file) {
        return "".concat(api.getUrl(id)).concat(query);
    }
    return ((_urls_id = urls[id]) === null || _urls_id === void 0 ? void 0 : _urls_id[entry.locale]) || raw;
// raw.match(/[\.|\/]*(.+)/)[1]
}
/**
 * Get entry's `body` managing links
 */ function treatBodyLinks(entry, api, urls) {
    // support for returns within title or href:
    // const regex = /\[([\s|\S|.]*?)\][\s|\S]*?\(([\s|\S|.]+?)\)/gm;
    var regex = /\[(.+)\][\s|\S]*?\((.+)\)/gm;
    var body = entry.body;
    body = body.replace(regex, function(_match, text, url) {
        return "[".concat(text, "](").concat(getTranslatedLink(url, entry, api, urls), ")");
    });
    return body;
}
/**
 * Get entry managing links in `data`
 */ function treatDataLinks(entry, api, urls) {
    for(var key in entry.data){
        if (key !== "body") {
            treatDataLinksSlice(entry.data, key, entry, api, urls);
        }
    }
    return entry;
}
/**
 * Get entry managing all links both in` body` and `data`
 */ function treatAllLinks(entry, api, urls) {
    entry = treatDataLinks(entry, api, urls);
    entry.body = treatBodyLinks(entry, api, urls);
    return entry;
}
function treatDataLinksSlice(data, key, entry, api, urls) {
    if (typeof data[key] === "string") {
        var currentValue = data[key];
        if (/^([\s|.]*\/)+/.test(currentValue)) {
            data[key] = getTranslatedLink(currentValue, entry, api, urls);
        // console.log("transformed: ", data[key]);
        } else {
            var regex = /(\[[\s|\S]*?\])\(([\s\S]*?)\)/gm;
            data[key] = currentValue.replace(regex, function(_, text, url) {
                if (text && url) {
                    return "".concat(text, "(").concat(getTranslatedLink(url, entry, api, urls), ")");
                }
                return _;
            });
        }
    } else if (Array.isArray(data[key])) {
        // console.log("is array", key);
        for(var i = 0; i < data[key].length; i++){
            treatDataLinksSlice(data[key], i, entry, api, urls);
        }
    } else if (Object.prototype.toString.call(data[key]).slice(8, -1) === "Object") {
        // console.log("is object", key);
        for(var subkey in data[key]){
            treatDataLinksSlice(data[key], subkey, entry, api, urls);
        }
    }
}

function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator$1(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator$1(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
/**
 * Convention for translation strings
 *
 * Based on the shape of the translation keys:
 * - `_commonKey`: inital underscore marks common site wide translations to be included in every page
 * - `~route`: lowercase with initial tilde mark route specific translations
 *   - `~route~path`: tilde works as a slash to concatenate pathnames
 *   - `~route~`: ending tilde marks translations for a dynamic path portion
 * - `ComponentKey`: Pascal case marks Component specific translations
 *
 * This convention uses only unreserved characters that [do not need to be encoded
 * in a URL](https://perishablepress.com/stop-using-unsafe-characters-in-urls/).
 * This allows to transform the keys into URL ready filenames to be uploaded
 * on a CDN or github without needing to care about URL encoding.
 */ var TRANSLATIONS_CHARS = {
    common: "_",
    route: "~"
};
var TRANSLATIONS_REGEX = {
    route: /~/g
};
function buildNestedTranslations(outBuffer, keyParts, value) {
    for(var i = 0; i < keyParts.length; i++){
        var key = keyParts[i];
        if (i === keyParts.length - 1) {
            // @ts-expect-error nevermind...
            outBuffer[key] = value;
        } else {
            // @ts-expect-error nevermind...
            outBuffer[key] = outBuffer[key] || {};
            keyParts.splice(i, 1);
            // @ts-expect-error nevermind...
            buildNestedTranslations(outBuffer[key], keyParts, value);
        }
    }
}
function getTranslations(folderPath, i18n, routes) {
    return _getTranslations.apply(this, arguments);
}
function _getTranslations() {
    _getTranslations = _async_to_generator$1(function(folderPath, i18n, routes) {
        var locales, out, commonChar, routeChar, routeReg, i, locale, target, data, content, value, keyParts, isRoute, isComponent, isCommon, scoped, file, scoped1, file1, locales1, locale1, slug;
        return _ts_generator$1(this, function(_state) {
            switch(_state.label){
                case 0:
                    locales = i18n.locales;
                    out = {};
                    commonChar = TRANSLATIONS_CHARS.common, routeChar = TRANSLATIONS_CHARS.route;
                    routeReg = TRANSLATIONS_REGEX.route;
                    i = 0;
                    _state.label = 1;
                case 1:
                    if (!(i < locales.length)) return [
                        3,
                        7
                    ];
                    locale = locales[i];
                    target = path.join(folderPath, "".concat(locale, ".yml"));
                    data = void 0;
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        4,
                        ,
                        5
                    ]);
                    return [
                        4,
                        fsExtra.readFile(target, "utf-8")
                    ];
                case 3:
                    content = _state.sent();
                    data = jsYaml.load(content);
                    return [
                        3,
                        5
                    ];
                case 4:
                    _state.sent();
                    return [
                        3,
                        5
                    ];
                case 5:
                    if (data) {
                        out[locale] = out[locale] || {};
                        for(var key in data){
                            value = data[key];
                            keyParts = key.split(".");
                            // const isCommon = key[0] === commonChar;
                            isRoute = key[0] === routeChar;
                            isComponent = key[0] === key[0].toUpperCase();
                            isCommon = !isRoute && !isComponent;
                            if (keyParts.length === 1) {
                                if (!isCommon) {
                                    console.error("kjam/Serializer::getTranslations, problem found with " + "'".concat(key, "' in file '").concat(target, "', only '_common' ") + "translations can have no dots in the key.\n");
                                } else {
                                    scoped = keyParts[0];
                                    out[locale][commonChar] = out[locale][scoped] || {};
                                    out[locale][commonChar][keyParts[0]] = value;
                                }
                            } else if (keyParts.length >= 2) {
                                file = isCommon ? commonChar : keyParts[0].replace(routeReg, "");
                                if (isCommon) {
                                    scoped1 = keyParts[0];
                                    out[locale][file][scoped1] = out[locale][file][scoped1] || {};
                                    buildNestedTranslations(out[locale][file][scoped1], keyParts.slice(1), value);
                                } else {
                                    file1 = keyParts[0].replace(routeReg, "");
                                    out[locale][file1] = out[locale][file1] || {};
                                    buildNestedTranslations(out[locale][file1], keyParts.slice(1), value);
                                }
                            }
                        }
                    }
                    _state.label = 6;
                case 6:
                    i++;
                    return [
                        3,
                        1
                    ];
                case 7:
                    // automatically build translations for routes paths
                    for(var route in routes){
                        locales1 = routes[route];
                        for(var _locale in locales1){
                            locale1 = _locale;
                            slug = locales1[locale1];
                            out[locale1][TRANSLATIONS_CHARS.route] = out[locale1][TRANSLATIONS_CHARS.route] || {};
                            out[locale1][TRANSLATIONS_CHARS.route]["/".concat(route)] = slug;
                        }
                    }
                    return [
                        2,
                        out
                    ];
            }
        });
    });
    return _getTranslations.apply(this, arguments);
}
function writeTranslations(translations, write) {
    for(var _locale in translations){
        var locale = _locale;
        for(var fileName in translations[locale]){
            var fileData = translations[locale][fileName];
            write("i18n/".concat(locale, "/").concat(fileName), fileData);
        }
    }
}

// import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = _object_without_properties_loose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var Serializer = /*#__PURE__*/ function() {
    function Serializer(config) {
        _class_call_check(this, Serializer);
        var _process_env_GITHUB_REF;
        _define_property(this, "api", void 0);
        _define_property(this, "config", void 0);
        /** Logger function */ _define_property(this, "log", void 0);
        /** Flag for debug mode */ _define_property(this, "debug", void 0);
        /** Path where the i18n config YAML file is placed */ _define_property(this, "pathI18n", void 0);
        /** Path of the folder where the i18n YAML translations files are placed */ _define_property(this, "pathTranslations", void 0);
        /** Repository root absolute folder path */ _define_property(this, "root", void 0);
        _define_property(this, "i18n", void 0);
        _define_property(this, "routes", void 0);
        _define_property(this, "urls", void 0);
        _define_property(this, "slugs", void 0);
        _define_property(this, "translations", void 0);
        _define_property(this, "collections", void 0);
        _define_property(this, "entries", void 0);
        /**
   * All markdown files paths
   */ _define_property(this, "mdPaths", void 0);
        var defaultLogger = function(data) {
            var type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "info";
            console[type](data);
        };
        // @see https://docs.github.com/en/actions/learn-github-actions/environment-variables
        var _split = _sliced_to_array((process.env["GITHUB_REPOSITORY"] || "").split("/"), 2), username = _split[0], repo = _split[1];
        // TODO: check if I can use GITHUB_REF_NAME
        var branch = ((_process_env_GITHUB_REF = process.env["GITHUB_REF"]) === null || _process_env_GITHUB_REF === void 0 ? void 0 : _process_env_GITHUB_REF.substring(11)) || "main";
        this.api = new core.ApiGithub(_object_spread({
            username: username,
            repo: repo,
            branch: branch
        }, (config === null || config === void 0 ? void 0 : config.api) || {}));
        var _ref = config || {}, log = _ref.log, debug = _ref.debug, pathI18n = _ref.pathI18n, pathTranslations = _ref.pathTranslations, root = _ref.root, restConfig = _object_without_properties(_ref, [
            "log",
            "debug",
            "pathI18n",
            "pathTranslations",
            "root"
        ]);
        this.config = restConfig;
        this.log = log || defaultLogger;
        this.debug = !!debug || false;
        this.pathI18n = pathI18n || "settings/i18n/config.yml";
        this.pathTranslations = pathTranslations || "settings/i18n/messages";
        this.root = root || path.join(process.cwd(), process.env["KJAM_FOLDER"] || ".");
        this.i18n = this.getI18n();
        this.routes = {};
        this.urls = {};
        this.slugs = {};
        this.translations = {};
        this.collections = {};
        this.entries = {};
        this.mdPaths = [];
    }
    _create_class(Serializer, [
        {
            key: "run",
            value: function run() {
                var _this = this;
                return _async_to_generator(function() {
                    var _ref, routes, urls, slugs, collections, entries, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step_value, id, locales, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _step_value1, locale, entry, templateSlug;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this.ensureMetaFolder();
                                return [
                                    4,
                                    _this.getMarkdownPaths()
                                ];
                            case 1:
                                _this.mdPaths = _state.sent();
                                _this.log("> Found ".concat(_this.mdPaths.length, " markdown files."));
                                return [
                                    4,
                                    _this.getRouting(_this.mdPaths)
                                ];
                            case 2:
                                _ref = _state.sent(), routes = _ref.routes, urls = _ref.urls, slugs = _ref.slugs, collections = _ref.collections, entries = _ref.entries;
                                _this.routes = routes;
                                _this.urls = urls;
                                _this.slugs = slugs;
                                _this.collections = collections;
                                _this.entries = entries;
                                _this.writeFile("i18n", _this.i18n);
                                _this.writeFile("routes", _this.routes);
                                _this.writeFile("urls", _this.urls);
                                _this.writeFile("slugs", _this.slugs);
                                return [
                                    4,
                                    getTranslations(path.join(_this.root, _this.pathTranslations), _this.i18n, _this.routes)
                                ];
                            case 3:
                                // this.writeFile("collections", this.collections);
                                // this.writeFile("entries", this.entries);
                                _this.translations = _state.sent();
                                writeTranslations(_this.translations, _this.writeFile.bind(_this));
                                _this.writeFile("byRoute", _this.entries);
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                try {
                                    // const map = await this.getEntriesMap();
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    for(_iterator = Object.entries(_this.entries)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                        _step_value = _sliced_to_array(_step.value, 2), id = _step_value[0], locales = _step_value[1];
                                        _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                        try {
                                            // FIXME: using the following would help creating staticlly Untranslated Pages...
                                            // for (const [locale, entry] of Object.entries(this.i18n.locales)) {
                                            for(_iterator1 = Object.entries(locales)[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                                _step_value1 = _sliced_to_array(_step1.value, 2), locale = _step_value1[0], entry = _step_value1[1];
                                                // PAGES:
                                                // if (!id.startsWith("pages/")) {
                                                _this.writeFile("entries/".concat(id, "__").concat(locale), entry);
                                                // }
                                                // FIXME: still not sure what is the best here, maybe the template slug
                                                // is only needed for next.js routing system, maybe not, right now we
                                                // are creating multiple endpoints for the same entry, which is probably
                                                // not ideal
                                                templateSlug = entry.templateSlug;
                                                // if (!this.collections[id]) {
                                                _this.writeFile("entries/".concat(templateSlug, "__").concat(locale), entry);
                                            // }
                                            }
                                        } catch (err) {
                                            _didIteratorError1 = true;
                                            _iteratorError1 = err;
                                        } finally{
                                            try {
                                                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                                    _iterator1.return();
                                                }
                                            } finally{
                                                if (_didIteratorError1) {
                                                    throw _iteratorError1;
                                                }
                                            }
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                } finally{
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                                            _iterator.return();
                                        }
                                    } finally{
                                        if (_didIteratorError) {
                                            throw _iteratorError;
                                        }
                                    }
                                }
                                return [
                                    4,
                                    _this.start()
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        byRoute: _this.entries
                                    }
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "start",
            value: /**
   * Use this in subclasses as we are sure that routes structure has been
   * calculated
   *
   * @abstract
   */ function start() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            new Promise(function(resolve) {
                                return resolve("");
                            })
                        ];
                    });
                })();
            }
        },
        {
            key: "getPaths",
            value: /**
   * Get all files' path recursively
   */ function getPaths(dir) {
                var _this = this;
                return _async_to_generator(function() {
                    var crawler, paths;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                crawler = new fdir.fdir().withFullPaths().crawl(dir || _this.root);
                                return [
                                    4,
                                    crawler.withPromise()
                                ];
                            case 1:
                                paths = _state.sent();
                                return [
                                    2,
                                    paths
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getMarkdownPaths",
            value: /** @protected */ function getMarkdownPaths() {
                var _this = this;
                return _async_to_generator(function() {
                    var paths;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.getPaths()
                                ];
                            case 1:
                                paths = _state.sent();
                                if (!paths) {
                                    _this.log("Repository is empty.", "error");
                                    throw Error("Repository is empty!");
                                }
                                return [
                                    2,
                                    paths.filter(filterMarkdownFiles).map(function(filepath) {
                                        return path.relative(_this.root, filepath);
                                    })// TODO: make the following more optional and better thought of
                                    .filter(function(filepath) {
                                        return !filepath.startsWith("settings/");
                                    })
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "ensureMetaFolder",
            value: /**
   * Make sure that the meta folder is there, always remove it and recreate it
   */ function ensureMetaFolder() {
                var target = path.join(this.root, ".kjam");
                fsExtra.emptyDirSync(target);
                fsExtra.mkdirSync(target, {
                    recursive: true
                });
            }
        },
        {
            key: "writeFile",
            value: function writeFile() {
                var filepath = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", data = arguments.length > 1 ? arguments[1] : void 0;
                var target = path.join(this.root, ".kjam", "".concat(filepath, ".json"));
                var dir = path.dirname(target);
                var content = JSON.stringify(data, null, core.isTestEnv() ? 2 : 0);
                if (!fsExtra.existsSync(dir)) {
                    fsExtra.mkdirSync(dir, {
                        recursive: true
                    });
                }
                fsExtra.writeFileSync(target, content);
            }
        },
        {
            /** @protected */ key: "getI18n",
            value: function getI18n() {
                var target = path.join(this.root, this.pathI18n);
                if (fsExtra.existsSync(target)) {
                    var content = fsExtra.readFileSync(target, "utf-8");
                    var i18n = jsYaml.load(content);
                    return i18n;
                }
                return {
                    locales: [
                        "en"
                    ],
                    defaultLocale: "en"
                };
            }
        },
        {
            key: "shouldExcludeFilePath",
            value: function shouldExcludeFilePath(dirAsId) {
                var BLACKLISTED = [
                    "settings"
                ];
                var exclude = false;
                // exclude e.g. `settings`
                if (BLACKLISTED.indexOf(dirAsId) > -1) {
                    exclude = true;
                } else {
                    // exclude e.g. `settings/categores`
                    for(var i = 0; i < BLACKLISTED.length; i++){
                        if (dirAsId.startsWith("".concat(BLACKLISTED[i], "/"))) {
                            exclude = true;
                        }
                    }
                }
                return exclude;
            }
        },
        {
            key: "getRouting",
            value: /**
   * Let's do everyhting in this big function. We can avoid creating too many maps
   * to pass around to other functions. It might be hard to read but let's
   * comment it properly.
   *
   * The convention is that each markdown file is in its own folder alongside
   * its translations, e.g. we could have:
   *
   * ```
   * projects/wood/boxes/index.en.md
   * projects/wood/boxes/index.it.md
   * ```
   *
   * What we are interested in here is just the `projects/wood` bit as the
   * `boxes` folder is not the folder in terms of URL as it behaves like the entry
   * `slug`, in other words the last portion of the URL pathname. In fact this
   * content entry will be probably reachable at something like these URLS:
   *
   * ```
   * https://example.com/projects/wood/boxes (en)
   * https://example.com/it/progetti/legno/scatole (it)
   * ```
   *
   * @private
   */ function getRouting(markdownFiles) {
                var _this = this;
                return _async_to_generator(function() {
                    var _loop, ids, entries, slugs, urls, routes, collections, i, filepath, meta, id, exclude, matter, isCollection, route, entry, entrySlugs, promises, id1, locales, locale, entry1, promisesEntries;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _loop = function(_id) {
                                    var id = _id;
                                    var idParts = id.split("/")// PAGES:
                                    .filter(function(part, idx) {
                                        return idx === 0 && part === "pages" ? false : true;
                                    });
                                    var locales = slugs[id];
                                    // if it's a one level path we do not need to do anything more
                                    if (idParts.length <= 1) {
                                        routes[id] = locales;
                                        urls[id] = locales;
                                        for(var _locale in locales){
                                            var locale = _locale;
                                            if (entries[id][locale]) entries[id][locale].url = locales[locale];
                                        }
                                    } else {
                                        // otherwise we need to loop through each portion of the route and pick
                                        // each segment's translation from the previously constructed map
                                        for(var _locale1 in locales){
                                            var locale1 = _locale1;
                                            var pathTarget = "";
                                            var url = "";
                                            // loop through each part of the route key (e.g. /spaces/outdoor/seasons)
                                            // and translate each segment
                                            for(var j = 0; j < idParts.length; j++){
                                                var _slugs_pathTarget;
                                                pathTarget = "".concat(pathTarget ? pathTarget + "/" : "").concat(idParts[j]);
                                                // use the path part as fallback, which means that if a folder does
                                                // not have an entry we use its folder name as part of its children's
                                                // url pathnames
                                                var folderBasedSlugSegment = "/".concat(idParts[j]);
                                                var existingSlugSegment = (_slugs_pathTarget = slugs[pathTarget]) === null || _slugs_pathTarget === void 0 ? void 0 : _slugs_pathTarget[locale1];
                                                var slugSegment = typeof existingSlugSegment === "string" ? existingSlugSegment : folderBasedSlugSegment;
                                                if (typeof existingSlugSegment !== "string") {
                                                    // console.log("folderBasedSlugSegment", Object.keys(slugs), pathTarget);
                                                    // add to the `routes` the url to construct links of the nested
                                                    // entries, no need to add it to the `urls` map as it does not make
                                                    // sense to link directly to this URL, it is only an empty folder
                                                    // pathname
                                                    var routeWithoutEntry = pathTarget;
                                                    var urlWithoutEntry = routeWithoutEntry.split("/").map(function(path) {
                                                        var _slugs_path;
                                                        return (slugs === null || slugs === void 0 ? void 0 : (_slugs_path = slugs[path]) === null || _slugs_path === void 0 ? void 0 : _slugs_path[locale1]) || path;
                                                    }).join("/");
                                                    routes[routeWithoutEntry] = routes[routeWithoutEntry] || {};
                                                    routes[routeWithoutEntry][locale1] = urlWithoutEntry;
                                                }
                                                url += slugSegment;
                                            }
                                            // add to the `routes` structure only the collections pages
                                            if (collections[id]) {
                                                routes[id] = routes[id] || {};
                                                routes[id][locale1] = url;
                                            }
                                            urls[id] = urls[id] || {};
                                            urls[id][locale1] = url;
                                            if (entries[id][locale1]) entries[id][locale1].url = url;
                                        }
                                    }
                                };
                                ids = {};
                                entries = {};
                                slugs = {};
                                urls = {};
                                routes = {};
                                collections = {};
                                // Pass 1: gather all the markdown paths and build the `entries` map flagging
                                // those that are `collections`
                                for(i = 0; i < markdownFiles.length; i++){
                                    filepath = markdownFiles[i];
                                    meta = extractMeta(filepath, _this.i18n);
                                    // pages collection is treated as if it was at the root level
                                    // PAGES:
                                    // const id = meta.dir.replace("pages/", "");
                                    id = meta.dir;
                                    exclude = _this.shouldExcludeFilePath(id);
                                    if (exclude) {
                                        continue;
                                    }
                                    matter = extractMatter(path.join(_this.root, filepath));
                                    // ability to filter out contents with conventional frontmatter flags
                                    if (matter.data.draft) {
                                        continue;
                                    }
                                    isCollection = isCollectionPath(path.join(_this.root, id));
                                    route = extractRoute(meta, matter);
                                    entry = _object_spread({}, meta, matter, route);
                                    entrySlugs = _this.getSlugsForPath(id);
                                    entry.slug = entrySlugs[entry.locale].replace(/\//g, "");
                                    // entry.slug = entrySlugs[entry.locale].replace("/", "");
                                    if (id) {
                                        ids[id] = true;
                                        slugs[id] = entrySlugs;
                                        entries[id] = entries[id] || {};
                                        entries[id][entry.locale] = entry;
                                        if (isCollection) {
                                            collections[id] = true;
                                        }
                                    }
                                }
                                // Pass 2: loop through each entry path and construct the output maps
                                for(var _id in ids)_loop(_id);
                                promises = [];
                                for(var _id1 in entries){
                                    id1 = _id1;
                                    locales = entries[id1];
                                    for(var _locale in locales){
                                        locale = _locale;
                                        entry1 = locales[locale];
                                        entry1 = treatAllLinks(entry1, _this.api, _this.urls);
                                        promises.push(treatAllImages(entry1, _this.api, _this.transformBodyImage));
                                    }
                                }
                                return [
                                    4,
                                    Promise.all(promises)
                                ];
                            case 1:
                                promisesEntries = _state.sent();
                                promisesEntries.forEach(function(entry) {
                                    entries[entry.id][entry.locale] = entry;
                                });
                                return [
                                    2,
                                    {
                                        routes: routes,
                                        urls: urls,
                                        slugs: slugs,
                                        collections: collections,
                                        entries: entries
                                    }
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getSlugsForPath",
            value: /** @private */ function getSlugsForPath(path$1) {
                var pathSlugs = {};
                for(var i = 0; i < this.i18n.locales.length; i++){
                    var locale = this.i18n.locales[i];
                    // Should we check `mdx` too? I don't think so...
                    var filename = "index.".concat(locale, ".md");
                    var pageEntry = path.join(this.root, // PAGES:
                    // path === "pages" ? `${path}` : `pages/${path}`,
                    path$1, filename);
                    var existingEntry = "";
                    var slug = void 0;
                    // first check if we have a specific page entry for this path in
                    // `pages` folder
                    if (fsExtra.existsSync(pageEntry)) {
                        existingEntry = pageEntry;
                    } else {
                        // otherwise check if we have a specific page entry for this path in
                        // its `{path}` collection folder
                        var collectionEntry = path.join(this.root, path$1, filename);
                        if (fsExtra.existsSync(collectionEntry)) {
                            existingEntry = collectionEntry;
                        }
                    }
                    // if we have an entry we try to read the slug from the raw file
                    if (existingEntry) {
                        slug = this.getSlugFromRawMdFile(existingEntry);
                    }
                    // it might be that the entry markdown file does not specify a slug or that
                    // a collection folder might not have an `index` file, in these case URLS
                    // will be constructed by simply using the folder name as it is, as we can
                    // have entries that are fine with using their folder name as slug and
                    // have nested collections that are only meant for organizing the content
                    // structure. So we just use the last portion of the `path`.
                    if (typeof slug !== "string") {
                        // special case for homepage, if no slug is specified in the markdown
                        // file (probably it should never be) we just hardcode the empty path
                        // PAGES:HOME:
                        if (path$1 === "pages/home") {
                            slug = "";
                        } else {
                            var pathParts = path$1.split("/");
                            slug = pathParts[pathParts.length - 1];
                        }
                    }
                    // PAGES:
                    slug = slug.startsWith("pages/") ? slug.replace("pages/", "") : slug, pathSlugs[locale] = "/" + core.normalisePathname(slug);
                }
                return pathSlugs;
            }
        },
        {
            key: "getSlugFromRawMdFile",
            value: /**
   * We want to be quick here, just using a regex is fine for now avoiding
   * `frontmatter` parsing at this phase of the serialization
   *
   * The `slug` regex allows the slug to be defined on the next line in the
   * frontmatter data
   *
   * @private
   */ function getSlugFromRawMdFile(filepath) {
                var content = fsExtra.readFileSync(filepath, "utf-8");
                // check first if slug is defined, it might be defined but empty, hence
                // the following regex would not work
                if (/^slug:/m.test(content)) {
                    var regex = /slug:[\s\n]+((?!.+:).+)$/m;
                    var matches = content.match(regex);
                    if (matches && matches[1]) {
                        // use the last bit only of the pathname, declaring a composed path is not
                        // allowed as each entry should just define its slug and not its ancestor's
                        // ones (which are inferred in the serialization phase).
                        var matchParts = matches[1].split("/");
                        var slug = matchParts[matchParts.length - 1];
                        // replace the quotes if the string is wrapped in it
                        return slug.replace(/"|'/g, "");
                    }
                    // if it is defined but empty we assume the slug is the one for the
                    // homepage
                    return "";
                }
                return undefined;
            }
        },
        {
            /** @private */ key: "getRawFile",
            value: function getRawFile(filepath) {
                try {
                    return fsExtra.readFileSync(path.join(this.root, filepath), "utf8");
                } catch (e) {
                    if (this.debug) {
                        console.warn("kjam/serializer::getRawFile failed to read ".concat(filepath), e);
                    }
                    return null;
                }
            }
        },
        {
            key: "transformBodyImage",
            value: function transformBodyImage(markdownImg) {
                return _async_to_generator(function() {
                    var img;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                img = new Img(markdownImg);
                                return [
                                    4,
                                    img.toComponent()
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return Serializer;
}();

exports.Img = Img;
exports.Serializer = Serializer;
