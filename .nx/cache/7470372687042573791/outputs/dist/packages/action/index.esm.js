import * as core from '@actions/core';
import simpleGit from 'simple-git';

/**
 * @file
 *
 * All the git part is heavily taken and simplified from
 * https://github.com/EndBug/add-and-commit
 */ function _array_like_to_array(arr, len) {
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
function log(err, data) {
    if (data) console.log(data);
    if (err) core.error(err);
}
var Git = /*#__PURE__*/ function() {
    function Git(baseDir, afterFetch) {
        _class_call_check(this, Git);
        _define_property(this, "baseDir", void 0);
        _define_property(this, "afterFetch", void 0);
        _define_property(this, "outputs", void 0);
        _define_property(this, "errors", []);
        this.baseDir = baseDir;
        this.afterFetch = afterFetch;
        this.outputs = {
            committed: "false",
            commit_sha: undefined,
            pushed: "false"
        };
        // setup default output values
        Object.entries(this.outputs).forEach(function(param) {
            var _param = _sliced_to_array(param, 2), name = _param[0], value = _param[1];
            return core.setOutput(name, value);
        });
    }
    _create_class(Git, [
        {
            key: "run",
            value: function run() {
                var _this = this;
                return _async_to_generator(function() {
                    var _process_env_GITHUB_REF, git, branch, changedFiles;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                git = simpleGit({
                                    baseDir: _this.baseDir
                                });
                                branch = ((_process_env_GITHUB_REF = process.env["GITHUB_REF"]) === null || _process_env_GITHUB_REF === void 0 ? void 0 : _process_env_GITHUB_REF.substring(11)) || "main";
                                core.info("Running in folder ".concat(_this.baseDir, "..."));
                                // TODO: maybe this only needs to be used when run locally on a user machine?
                                core.info("> Pulling from remote...");
                                return [
                                    4,
                                    git.fetch(undefined, log).pull(undefined, undefined, undefined, log)
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    4,
                                    _this.afterFetch()
                                ];
                            case 2:
                                _state.sent();
                                core.info("> Checking for uncommitted changes in the git working tree...");
                                return [
                                    4,
                                    git.status()
                                ];
                            case 3:
                                changedFiles = _state.sent().files.length;
                                if (!changedFiles) return [
                                    3,
                                    9
                                ];
                                core.info("> Found ".concat(changedFiles, " changed files."));
                                return [
                                    4,
                                    git.addConfig("user.name", "knitkode", undefined, log).addConfig("author.name", "@knitkode/kjam-action", undefined, log)
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    4,
                                    git.fetch([
                                        "--tags",
                                        "--force"
                                    ], log)
                                ];
                            case 5:
                                _state.sent();
                                // core.info('> Checkout branch...')
                                // await git.checkoutLocalBranch(branch, log)
                                // core.info('> Pulling from remote...')
                                // await git.fetch(undefined, log).pull(undefined, undefined, undefined, log)
                                core.info("> Re-staging files...");
                                return [
                                    4,
                                    git.add(".").catch(function(e) {
                                        if (e.message.includes("fatal: pathspec") && e.message.includes("did not match any files")) {
                                            _this.errors.push(new Error("Add command did not match any file"));
                                        } else throw e;
                                    })
                                ];
                            case 6:
                                _state.sent();
                                core.info("> Creating commit...");
                                return [
                                    4,
                                    git.commit("Update '.kjam' output", undefined, {}, function(err, data) {
                                        if (data) {
                                            _this.setOutput("committed", "true");
                                            _this.setOutput("commit_sha", data.commit);
                                        }
                                        return log(err, data);
                                    })
                                ];
                            case 7:
                                _state.sent();
                                core.info("> Pushing commit to repo...");
                                return [
                                    4,
                                    git.push("origin", branch, {
                                        "--set-upstream": null
                                    }, function(err, data) {
                                        if (data) _this.setOutput("pushed", "true");
                                        return log(err, data);
                                    })
                                ];
                            case 8:
                                _state.sent();
                                core.endGroup();
                                core.info("> Task completed!!!");
                                return [
                                    3,
                                    10
                                ];
                            case 9:
                                core.endGroup();
                                core.info("> Working tree clean. Nothing to commit.");
                                _state.label = 10;
                            case 10:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "setOutput",
            value: function setOutput(name, value) {
                this.outputs[name] = value;
                core.setOutput(name, value);
            }
        },
        {
            key: "logOutputs",
            value: function logOutputs() {
                core.startGroup("Outputs");
                for(var key in this.outputs){
                    core.info("".concat(key, ": ").concat(this.outputs[key]));
                }
                core.endGroup();
            }
        },
        {
            key: "success",
            value: function success() {
                if (this.errors.length === 1) {
                    throw this.errors[0];
                } else if (this.errors.length > 1) {
                    this.errors.forEach(function(e) {
                        return core.error(e);
                    });
                    throw "There have been multiple runtime errors.";
                }
                this.logOutputs();
            }
        },
        {
            key: "error",
            value: function error(e) {
                core.endGroup();
                this.logOutputs();
                core.setFailed(e);
            }
        }
    ]);
    return Git;
}();

export { Git };
