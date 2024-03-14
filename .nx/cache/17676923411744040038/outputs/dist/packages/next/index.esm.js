import 'dotenv/config';
import { Content, normalisePathname } from '@kjam/core';
import { codeFrameColumns } from '@babel/code-frame';

/**
 * @file
 *
 * Shamelessly copied from [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote/tree/main/src)
 *
 * Probably migrate to `mdx-bundler` once [this PR](https://github.com/kentcdodds/mdx-bundler/issues/137) gets merged
 */ function _array_like_to_array$1(arr, len) {
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
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
 * Attempt to parse position information from an error message originating from the MDX compiler.
 * Only used if the error object doesn't contain
 */ function parsePositionInformationFromErrorMessage(message) {
    var positionInfoPattern = /\d+:\d+(-\d+:\d+)/g;
    var match = message.match(positionInfoPattern);
    if (match) {
        // take the last match, that seems to be the most reliable source of the error.
        var lastMatch = match.slice(-1)[0];
        var _lastMatch_split__split = _sliced_to_array$1(lastMatch.split("-")[0].split(":"), 2), line = _lastMatch_split__split[0], column = _lastMatch_split__split[1];
        return {
            start: {
                line: Number.parseInt(line, 10),
                column: Number.parseInt(column, 10)
            }
        };
    }
    return;
}
/**
 * Prints a nicely formatted error message from an error caught during MDX compilation.
 *
 * @param error - Error caught from the mdx compiler
 * @param source - Raw MDX string
 * @returns Error
 */ function createFormattedMDXError(error, source) {
    var _error_position;
    var position = (_error_position = error === null || error === void 0 ? void 0 : error.position) !== null && _error_position !== void 0 ? _error_position : parsePositionInformationFromErrorMessage(error === null || error === void 0 ? void 0 : error.message);
    var _position_start_column;
    var codeFrames = position ? codeFrameColumns(source, {
        start: {
            line: position.start.line,
            column: (_position_start_column = position.start.column) !== null && _position_start_column !== void 0 ? _position_start_column : 0
        }
    }, {
        linesAbove: 2,
        linesBelow: 2
    }) : "";
    var formattedError = new Error("[next-mdx-remote] error compiling MDX:\n".concat(error === null || error === void 0 ? void 0 : error.message, "\n").concat(codeFrames ? "\n" + codeFrames + "\n" : "", "\nMore information: https://mdxjs.com/docs/troubleshooting-mdx"));
    formattedError.stack = "";
    return formattedError;
}
function getCompileOptions() {
    var mdxOptions = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    // don't modify the original object when adding our own plugin
    // this allows code to reuse the same options object
    var remarkPlugins = _to_consumable_array(mdxOptions.remarkPlugins || []).concat(_to_consumable_array([] ));
    return _object_spread_props(_object_spread$1({}, mdxOptions), {
        remarkPlugins: remarkPlugins,
        outputFormat: "function-body",
        providerImportSource: "@mdx-js/react"
    });
}
/**
 * Parses and compiles the provided MDX string. Returns a result which can be passed into <MDXRemote /> to be rendered.
 */ function serialize(/** Raw MDX contents as a string. */ source) {
    return _serialize.apply(this, arguments);
}
function _serialize() {
    _serialize = _async_to_generator$1(function(source) {
        var _ref, _ref_scope, scope, _ref_mdxOptions, mdxOptions, _ref1, compile, remove, compiledMdx, error, compiledSource;
        var _arguments = arguments;
        return _ts_generator$1(this, function(_state) {
            switch(_state.label){
                case 0:
                    _ref = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : {}, _ref_scope = _ref.scope, scope = _ref_scope === void 0 ? {} : _ref_scope, _ref_mdxOptions = _ref.mdxOptions, mdxOptions = _ref_mdxOptions === void 0 ? {} : _ref_mdxOptions, _ref.parseFrontmatter;
                    return [
                        4,
                        Promise.all([
                            // import("gray-matter"),
                            // import("js-yaml"),
                            // FIXME: hacky workaround, @see https://github.com/microsoft/TypeScript/issues/43329#issuecomment-1008361973
                            Function('return import("@mdx-js/mdx")')(),
                            Function('return import("unist-util-remove")')()
                        ])
                    ];
                case 1:
                    _ref1 = _sliced_to_array$1.apply(void 0, [
                        _state.sent(),
                        2
                    ]), /* { read }, { load, JSON_SCHEMA }, */ compile = _ref1[0].compile, remove = _ref1[1].remove;
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
                        compile(source, getCompileOptions(mdxOptions, remove))
                    ];
                case 3:
                    compiledMdx = _state.sent();
                    return [
                        3,
                        5
                    ];
                case 4:
                    error = _state.sent();
                    throw createFormattedMDXError(error, String(source));
                case 5:
                    compiledSource = String(compiledMdx);
                    return [
                        2,
                        {
                            compiledSource: compiledSource,
                            frontmatter: {},
                            scope: scope
                        }
                    ];
            }
        });
    });
    return _serialize.apply(this, arguments);
}

function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
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
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
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
var ContentNext = /*#__PURE__*/ function(Content) {
    _inherits(ContentNext, Content);
    var _super = _create_super(ContentNext);
    function ContentNext() {
        _class_call_check(this, ContentNext);
        return _super.apply(this, arguments);
    }
    _create_class(ContentNext, [
        {
            key: "getStaticPaths",
            value: /**
   * @param context We grab the `locales` from this
   * @param fallback Defaults to `"blocking"`
   * @param routeType Defaults to `""`
   * @param asString Defaults to `false`
   * @returns
   */ function getStaticPaths(context) {
                var fallback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "blocking", routeType = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", asString = arguments.length > 3 ? arguments[3] : void 0;
                var _this = this;
                return _async_to_generator(function() {
                    var _context_locales, _context_locales_reduce, ctxLocalesMap, paths, byRoute, normalisedRouteType, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step_value, id, locales, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _step_value1, locale, entry, slugSegments, slug;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                ctxLocalesMap = (_context_locales_reduce = (_context_locales = context.locales) === null || _context_locales === void 0 ? void 0 : _context_locales.reduce(function(map, locale) {
                                    map[locale] = true;
                                    return map;
                                }, {})) !== null && _context_locales_reduce !== void 0 ? _context_locales_reduce : {};
                                paths = [];
                                return [
                                    4,
                                    _this.api.getMaps()
                                ];
                            case 1:
                                byRoute = _state.sent().byRoute;
                                // the ending slash ensures that we are not gathering the root level `index`
                                // entry for the given `routeType` (usually a collection)
                                // PAGES:
                                // const normalisedRouteType =
                                //   normalisePathname(routeType === "pages" ? "" : routeType) + "/";
                                normalisedRouteType = normalisePathname(routeType) + "/";
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                try {
                                    for(_iterator = Object.entries(byRoute)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                        _step_value = _sliced_to_array(_step.value, 2), id = _step_value[0], locales = _step_value[1];
                                        if (id.startsWith(normalisedRouteType)) {
                                            _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                            try {
                                                for(_iterator1 = Object.entries(locales)[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                                    _step_value1 = _sliced_to_array(_step1.value, 2), locale = _step_value1[0], entry = _step_value1[1];
                                                    slugSegments = entry.templateSlug.replace(normalisedRouteType, "").split("/").filter(function(segment, idx) {
                                                        return segment && !(idx === 0 && segment === "pages");
                                                    });
                                                    slug = void 0;
                                                    if (ctxLocalesMap[locale]) {
                                                        if (asString) {
                                                            if (slugSegments.length === 1) {
                                                                slug = entry.slug;
                                                            }
                                                        } else {
                                                            slug = slugSegments;
                                                        }
                                                        // ensure that slug is not empty array or empty string, next.js does
                                                        // not want that
                                                        if (typeof slug === "string" && slug || Array.isArray(slug) && slug.length) {
                                                            paths.push({
                                                                // @ts-expect-error Not sure why this breaks
                                                                params: {
                                                                    slug: slug
                                                                },
                                                                locale: locale
                                                            });
                                                        }
                                                    }
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
                                if (_this.debug) {
                                    console.log("kjam/content::getStaticPaths", paths);
                                }
                                return [
                                    2,
                                    {
                                        fallback: fallback,
                                        paths: paths
                                    }
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getStaticProps",
            value: function getStaticProps(ctx) {
                var routeType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", otherProps = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
                var _this = this;
                return _async_to_generator(function() {
                    var params, locale, entry, mdx;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                params = ctx.params, locale = ctx.locale;
                                return [
                                    4,
                                    _this.get(routeType, (params === null || params === void 0 ? void 0 : params.slug) || "", locale)
                                ];
                            case 1:
                                entry = _state.sent();
                                if (!entry) {
                                    return [
                                        2,
                                        {
                                            notFound: true
                                        }
                                    ];
                                }
                                return [
                                    4,
                                    _this.getEntryMdx(entry)
                                ];
                            case 2:
                                mdx = _state.sent();
                                return [
                                    2,
                                    _object_spread({
                                        props: _object_spread({
                                            mdx: mdx,
                                            entry: entry
                                        }, otherProps)
                                    }, options)
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getEntryMdx",
            value: function getEntryMdx(entry) {
                return _async_to_generator(function() {
                    var mdx;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    serialize(entry.body, {
                                        scope: entry.data
                                    })
                                ];
                            case 1:
                                mdx = _state.sent();
                                return [
                                    2,
                                    mdx
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return ContentNext;
}(Content);
/**
 * This provides a default Content class configuration instance
 */ var kjam = new ContentNext();

export { ContentNext, kjam };
