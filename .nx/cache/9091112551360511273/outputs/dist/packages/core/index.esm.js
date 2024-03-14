import { join, isAbsolute } from 'path';
import { readFileSync } from 'fs';

function _class_call_check$3(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _define_property$3(obj, key, value) {
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
var Api = function Api() {
    var config = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _class_call_check$3(this, Api);
    _define_property$3(this, "debug", void 0);
    _define_property$3(this, "url", void 0);
    /**
   * The domain of the API, without `https://` protocol
   */ _define_property$3(this, "domain", void 0);
    this.debug = !!(config === null || config === void 0 ? void 0 : config.debug);
    this.url = (config === null || config === void 0 ? void 0 : config.url) || "";
    this.domain = (config === null || config === void 0 ? void 0 : config.domain) || "";
};

/**
 * Normalise pathname
 *
 * From a path like `/some//malformed/path///` it returns `some/malformed/path`
 *
 * - Removes subsequent slashes
 * - Removing initial and ending slashes
 */ function normalisePathname() {
    var pathname = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return pathname.replace(/\/+\//g, "/").replace(/^\/*(.*?)\/*$/, "$1");
}
/**
 * Clean a pathname and encode each part
 *
 * @see {@link normalisePathname}
 */ function encodePathname(pathname) {
    var parts = normalisePathname(pathname).split("/");
    return parts.filter(function(part) {
        return !!part;
    }).map(function(part) {
        return encodeURIComponent(part);
    }).join("/");
}
/**
 * Detect if we are running a test
 *
 * @see https://stackoverflow.com/q/50940640/9122820
 */ function isTestEnv() {
    return process.env["JEST_WORKER_ID"] !== undefined || process.env["NODE_ENV"] === "test";
}

function _array_like_to_array$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes$1(arr) {
    if (Array.isArray(arr)) return arr;
}
function _assert_this_initialized$1(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
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
function _class_call_check$2(instance, Constructor) {
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
function _define_property$2(obj, key, value) {
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
function _get_prototype_of$1(o) {
    _get_prototype_of$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of$1(o);
}
function _inherits$1(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of$1(subClass, superClass);
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
function _possible_constructor_return$1(self, call) {
    if (call && (_type_of$1(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized$1(self);
}
function _set_prototype_of$1(o, p) {
    _set_prototype_of$1 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of$1(o, p);
}
function _sliced_to_array$1(arr, i) {
    return _array_with_holes$1(arr) || _iterable_to_array_limit$1(arr, i) || _unsupported_iterable_to_array$1(arr, i) || _non_iterable_rest$1();
}
function _type_of$1(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$1(o, minLen);
}
function _is_native_reflect_construct$1() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _create_super$1(Derived) {
    var hasNativeReflectConstruct = _is_native_reflect_construct$1();
    return function _createSuperInternal() {
        var Super = _get_prototype_of$1(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _get_prototype_of$1(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possible_constructor_return$1(this, result);
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
var ApiGit = /*#__PURE__*/ function(Api) {
    _inherits$1(ApiGit, Api);
    var _super = _create_super$1(ApiGit);
    function ApiGit(config) {
        _class_call_check$2(this, ApiGit);
        var _this;
        _this = _super.call(this, config);
        _define_property$2(_assert_this_initialized$1(_this), "folder", void 0);
        _define_property$2(_assert_this_initialized$1(_this), "username", void 0);
        _define_property$2(_assert_this_initialized$1(_this), "repo", void 0);
        _define_property$2(_assert_this_initialized$1(_this), "branch", void 0);
        _this.folder = (config === null || config === void 0 ? void 0 : config.folder) || "";
        _this.username = (config === null || config === void 0 ? void 0 : config.username) || "";
        _this.repo = (config === null || config === void 0 ? void 0 : config.repo) || "";
        _this.branch = (config === null || config === void 0 ? void 0 : config.branch) || "";
        return _this;
    }
    _create_class$1(ApiGit, [
        {
            /**
   * Get git config from mandatory .env variable
   */ key: "getConfig",
            value: function getConfig() {
                var _split = _sliced_to_array$1((process.env["KJAM_GIT"] || "").split("/"), 3), username = _split[0], repo = _split[1], branch = _split[2];
                return {
                    username: username || this.username || "",
                    repo: repo || this.repo || "",
                    branch: branch || this.branch || ""
                };
            }
        },
        {
            /**
   * The GitHub api url is:
   *
   * `https://api.github.com/repos/${username}/${repo}/${branch}`
   */ key: "getUrl",
            value: function getUrl(path) {
                var baseUrl = this.url;
                if (!baseUrl) {
                    var _this_getConfig = this.getConfig(), username = _this_getConfig.username, repo = _this_getConfig.repo, branch = _this_getConfig.branch;
                    baseUrl = "https://".concat(this.domain, "/").concat(username, "/").concat(repo, "/").concat(branch);
                }
                if (path) {
                    return "".concat(baseUrl, "/").concat(encodePathname(path));
                }
                return baseUrl;
            }
        },
        {
            key: "getRaw",
            value: function getRaw(path) {
                var _this = this;
                return _async_to_generator$1(function() {
                    var gitFolder, filepath, url, res, raw;
                    return _ts_generator$1(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                gitFolder = process.env["KJAM_FOLDER"] || _this.folder;
                                if (gitFolder) {
                                    filepath = join(isAbsolute(gitFolder) ? "" : process.cwd(), gitFolder, path);
                                    try {
                                        return [
                                            2,
                                            readFileSync(filepath, {
                                                encoding: "utf-8"
                                            })
                                        ];
                                    } catch (_e) {
                                        return [
                                            2,
                                            ""
                                        ];
                                    }
                                }
                                url = "".concat(_this.getUrl(path));
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    4,
                                    ,
                                    5
                                ]);
                                return [
                                    4,
                                    fetch(url)
                                ];
                            case 2:
                                res = _state.sent();
                                return [
                                    4,
                                    res.text()
                                ];
                            case 3:
                                raw = _state.sent();
                                return [
                                    2,
                                    raw
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    2,
                                    ""
                                ];
                            case 5:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getData",
            value: /**
   * Get and parse json file produced by `kjam-action` on remote git repo
   */ function getData(path) {
                var failedReturn = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                var _this = this;
                return _async_to_generator$1(function() {
                    var raw;
                    return _ts_generator$1(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.getRaw(".kjam/".concat(path, ".json"))
                                ];
                            case 1:
                                raw = _state.sent();
                                try {
                                    return [
                                        2,
                                        JSON.parse(raw)
                                    ];
                                } catch (_e) {
                                    if (_this.debug) {
                                        console.error("[@kjam/core:ApiGit]:getData failed parsing JSON at '".concat(path, "'"));
                                    }
                                    return [
                                        2,
                                        failedReturn
                                    ];
                                }
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getMaps",
            value: function getMaps() {
                var _this = this;
                return _async_to_generator$1(function() {
                    var byRoute, entriesMap;
                    return _ts_generator$1(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.getData("byRoute")
                                ];
                            case 1:
                                byRoute = _state.sent();
                                entriesMap = {
                                    byRoute: byRoute
                                };
                                return [
                                    2,
                                    entriesMap
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return ApiGit;
}(Api);

function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _class_call_check$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
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
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _object_spread$1(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property$1(target, key, source[key]);
        });
    }
    return target;
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _is_native_reflect_construct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _create_super(Derived) {
    var hasNativeReflectConstruct = _is_native_reflect_construct();
    return function _createSuperInternal() {
        var Super = _get_prototype_of(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _get_prototype_of(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possible_constructor_return(this, result);
    };
}
var ApiGithub = /*#__PURE__*/ function(ApiGit) {
    _inherits(ApiGithub, ApiGit);
    var _super = _create_super(ApiGithub);
    function ApiGithub(config) {
        _class_call_check$1(this, ApiGithub);
        return _super.call(this, _object_spread$1({
            domain: "raw.githubusercontent.com"
        }, config));
    }
    return ApiGithub;
}(ApiGit);

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
var Content = /*#__PURE__*/ function() {
    function Content() {
        var config = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        _class_call_check(this, Content);
        _define_property(this, "api", void 0);
        _define_property(this, "debug", void 0);
        this.debug = !!(config === null || config === void 0 ? void 0 : config.debug) || process.env["KJAM_DEBUG"] === "true";
        this.api = new ApiGithub(config.api);
    }
    _create_class(Content, [
        {
            key: "getById",
            value: function getById(id, locale) {
                var _this = this;
                return _async_to_generator(function() {
                    var _byRoute_id, byRoute, _byRoute_id1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.api.getMaps()
                                ];
                            case 1:
                                byRoute = _state.sent().byRoute;
                                if (locale && ((_byRoute_id = byRoute[id]) === null || _byRoute_id === void 0 ? void 0 : _byRoute_id[locale])) {
                                    return [
                                        2,
                                        (_byRoute_id1 = byRoute[id]) === null || _byRoute_id1 === void 0 ? void 0 : _byRoute_id1[locale]
                                    ];
                                }
                                return [
                                    2,
                                    null
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "get",
            value: function get() {
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                    args[_key] = arguments[_key];
                }
                var _this = this;
                return _async_to_generator(function() {
                    var _folder, _slug, _locale, _args, slug, locale, _args1, folderPath, slug1, locale1, target, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _folder = "";
                                if (args.length === 2) {
                                    _args = _sliced_to_array(args, 2), slug = _args[0], locale = _args[1];
                                    _slug = slug;
                                    _locale = locale;
                                } else {
                                    _args1 = _sliced_to_array(args, 3), folderPath = _args1[0], slug1 = _args1[1], locale1 = _args1[2];
                                    // PAGES:
                                    // _folder = folderPath === "pages" ? "" : folderPath || "";
                                    _folder = folderPath || "";
                                    _slug = slug1;
                                    _locale = locale1;
                                }
                                target = Array.isArray(_slug) ? _slug.join("/") : _slug;
                                // target = normalisePathname(`${localisedFolderPath}/${_slug}`);
                                target = normalisePathname("".concat(_folder, "/").concat(_slug));
                                // homepage special case
                                if (target === "home") {
                                    target = "";
                                }
                                if (_this.debug) {
                                    console.log("[@kjam/core:Content]::get target ".concat(target));
                                }
                                return [
                                    4,
                                    _this.api.getData("entries/".concat(target, "__").concat(_locale))
                                ];
                            case 1:
                                data = _state.sent();
                                return [
                                    2,
                                    data
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getMany",
            value: function getMany(idStartingWith, locale, withBody) {
                var _this = this;
                return _async_to_generator(function() {
                    var byRoute;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.api.getMaps()
                                ];
                            case 1:
                                byRoute = _state.sent().byRoute;
                                return [
                                    2,
                                    Object.keys(byRoute).filter(function(id) {
                                        var _byRoute_id;
                                        // add the ending slash so that we match not the folder index page, e.g.
                                        // with argument "projects" we need to match here not "project/index.en.md"
                                        // but the entries like "projects/a-title/..."
                                        return id.startsWith(normalisePathname(idStartingWith) + "/") && !!((_byRoute_id = byRoute[id]) === null || _byRoute_id === void 0 ? void 0 : _byRoute_id[locale]);
                                    }).map(function(id) {
                                        var _byRoute_id_locale = byRoute[id][locale], body = _byRoute_id_locale.body, entry = _object_without_properties(_byRoute_id_locale, [
                                            "body"
                                        ]);
                                        return withBody ? _object_spread({
                                            body: body
                                        }, entry) : entry;
                                    })
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return Content;
}();

export { Api, ApiGit, ApiGithub, Content, encodePathname, isTestEnv, normalisePathname };
