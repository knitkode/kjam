import * as runtime from 'react/jsx-runtime';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import * as mdx from '@mdx-js/react';

/**
 * @file
 *
 * Shamelessly copied from [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote/blob/main/src/index.tsx)
 * We do this because of esm vs commonjs import problems
 */ function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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
/**
 * Renders compiled source from next-mdx-remote/serialize.
 */ function MDX(param) {
    var compiledSource = param.compiledSource, frontmatter = param.frontmatter, scope = param.scope, _param_components = param.components, components = _param_components === void 0 ? {} : _param_components, lazy = param.lazy;
    var _useState = _sliced_to_array(useState(!lazy || typeof window === "undefined"), 2), isReadyToRender = _useState[0], setIsReadyToRender = _useState[1];
    // if we're on the client side and `lazy` is set to true, we hydrate the
    // mdx content inside requestIdleCallback, allowing the page to get to
    // interactive quicker, but the mdx content to hydrate slower.
    useEffect(function() {
        if (lazy) {
            var handle = window.requestIdleCallback(function() {
                setIsReadyToRender(true);
            });
            return function() {
                return window.cancelIdleCallback(handle);
            };
        }
        return;
    }, [
        lazy
    ]);
    var Content = useMemo(function() {
        // if we're ready to render, we can assemble the component tree and let React do its thing
        // first we set up the scope which has to include the mdx custom
        // create element function as well as any components we're using
        var fullScope = Object.assign({
            opts: _object_spread$1({}, mdx, runtime)
        }, {
            frontmatter: frontmatter
        }, scope);
        var keys = Object.keys(fullScope);
        var values = Object.values(fullScope);
        // now we eval the source code using a function constructor
        // in order for this to work we need to have React, the mdx createElement,
        // and all our components in scope for the function, which is the case here
        // we pass the names (via keys) in as the function's args, and execute the
        // function with the actual values.
        var hydrateFn = Reflect.construct(Function, keys.concat("".concat(compiledSource)));
        return hydrateFn.apply(hydrateFn, values).default;
    }, [
        scope,
        compiledSource,
        frontmatter
    ]);
    if (!isReadyToRender) {
        // If we're not ready to render, return an empty div to preserve SSR'd markup
        return /*#__PURE__*/ jsx("div", {
            dangerouslySetInnerHTML: {
                __html: ""
            },
            suppressHydrationWarning: true
        });
    }
    // wrapping the content with MDXProvider will allow us to customize the standard
    // markdown components (such as "h1" or "a") with the "components" object
    var content = /*#__PURE__*/ jsx(mdx.MDXProvider, {
        components: components,
        children: /*#__PURE__*/ jsx(Content, {})
    });
    // If lazy = true, we need to render a wrapping div to preserve the same markup structure that was SSR'd
    return lazy ? /*#__PURE__*/ jsx("div", {
        children: content
    }) : content;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
var PageDebug = function(param) {
    var mdx = param.mdx, entry = param.entry, _param_mdComponents = param.mdComponents, mdComponents = _param_mdComponents === void 0 ? {} : _param_mdComponents, _param_tpl = param.tpl, tpl = _param_tpl === void 0 ? "" : _param_tpl, children = param.children;
    var _entry_data, _entry_data1;
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsx("table", {
                className: "kjam-PageDebug",
                children: /*#__PURE__*/ jsxs("tbody", {
                    children: [
                        /*#__PURE__*/ jsxs("tr", {
                            children: [
                                /*#__PURE__*/ jsx("th", {
                                    children: "template"
                                }),
                                /*#__PURE__*/ jsx("td", {
                                    children: tpl
                                })
                            ]
                        }),
                        entry && /*#__PURE__*/ jsxs("tr", {
                            children: [
                                /*#__PURE__*/ jsx("th", {
                                    children: "slug"
                                }),
                                /*#__PURE__*/ jsx("td", {
                                    children: entry.slug
                                })
                            ]
                        }),
                        entry && (entry === null || entry === void 0 ? void 0 : entry.data) && /*#__PURE__*/ jsxs("tr", {
                            children: [
                                /*#__PURE__*/ jsx("th", {
                                    children: "entry.data.title"
                                }),
                                /*#__PURE__*/ jsx("td", {
                                    children: ((_entry_data = entry.data) === null || _entry_data === void 0 ? void 0 : _entry_data.title) || ((_entry_data1 = entry.data) === null || _entry_data1 === void 0 ? void 0 : _entry_data1.name) || ""
                                })
                            ]
                        }),
                        mdx && /*#__PURE__*/ jsxs("tr", {
                            children: [
                                /*#__PURE__*/ jsx("th", {
                                    children: "mdx"
                                }),
                                /*#__PURE__*/ jsx("td", {
                                    children: /*#__PURE__*/ jsx(MDX, _object_spread_props(_object_spread({}, mdx), {
                                        components: mdComponents
                                    }))
                                })
                            ]
                        }),
                        /*#__PURE__*/ jsxs("tr", {
                            children: [
                                /*#__PURE__*/ jsx("th", {
                                    children: "entry JSON"
                                }),
                                /*#__PURE__*/ jsx("td", {
                                    children: /*#__PURE__*/ jsx("pre", {
                                        children: JSON.stringify(entry, null, 2)
                                    })
                                })
                            ]
                        }),
                        children && /*#__PURE__*/ jsxs("tr", {
                            children: [
                                /*#__PURE__*/ jsx("th", {
                                    children: "children"
                                }),
                                /*#__PURE__*/ jsx("td", {
                                    children: children
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ jsx("style", {
                children: "\n          body {\n            margin: 0;\n          }\n          \n          .kjam-PageDebug {\n            width: 100%;\n            table-layout: fixed;\n            border-collapse: collapse;\n            font-family: monospace;\n          }\n          \n          .kjam-PageDebug th {\n            text-align: right;\n            width: 150px;\n          }\n          \n          .kjam-PageDebug th,\n          .kjam-PageDebug td {\n            padding: 10px;\n            border: 1px solid #ccc;\n            vertical-align: top;\n          }\n          \n          .kjam-PageDebug pre {\n            background: #f4f4f4;\n            color: #666;\n            page-break-inside: avoid;\n            font-size: 12px;\n            line-height: 1.6;\n            margin: -10px;\n            max-width: 100%;\n            overflow: auto;\n            padding: 1em 1.5em;\n            display: block;\n            word-wrap: break-word;\n          }          \n        "
            })
        ]
    });
};

export { MDX, PageDebug };
