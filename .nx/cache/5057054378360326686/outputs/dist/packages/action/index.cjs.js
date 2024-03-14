'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@actions/core');
var simpleGit = require('simple-git');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var core__namespace = /*#__PURE__*/_interopNamespace(core);
var simpleGit__default = /*#__PURE__*/_interopDefaultLegacy(simpleGit);

/**
 * @file
 *
 * All the git part is heavily taken and simplified from
 * https://github.com/EndBug/add-and-commit
 */
function log(err, data) {
    if (data)
        console.log(data);
    if (err)
        core__namespace.error(err);
}
class Git {
    baseDir;
    afterFetch;
    outputs;
    errors = [];
    constructor(baseDir, afterFetch) {
        this.baseDir = baseDir;
        this.afterFetch = afterFetch;
        this.outputs = {
            committed: "false",
            commit_sha: undefined,
            pushed: "false",
        };
        // setup default output values
        Object.entries(this.outputs).forEach(([name, value]) => core__namespace.setOutput(name, value));
    }
    async run() {
        const git = simpleGit__default["default"]({ baseDir: this.baseDir });
        const branch = process.env["GITHUB_REF"]?.substring(11) || "main";
        core__namespace.info(`Running in folder ${this.baseDir}...`);
        // TODO: maybe this only needs to be used when run locally on a user machine?
        core__namespace.info("> Pulling from remote...");
        await git.fetch(undefined, log).pull(undefined, undefined, undefined, log);
        await this.afterFetch();
        core__namespace.info("> Checking for uncommitted changes in the git working tree...");
        const changedFiles = (await git.status()).files.length;
        if (changedFiles) {
            core__namespace.info(`> Found ${changedFiles} changed files.`);
            await git
                .addConfig("user.name", "knitkode", undefined, log)
                .addConfig("author.name", "@knitkode/kjam-action", undefined, log);
            await git.fetch(["--tags", "--force"], log);
            // core.info('> Checkout branch...')
            // await git.checkoutLocalBranch(branch, log)
            // core.info('> Pulling from remote...')
            // await git.fetch(undefined, log).pull(undefined, undefined, undefined, log)
            core__namespace.info("> Re-staging files...");
            await git.add(".").catch((e) => {
                if (e.message.includes("fatal: pathspec") &&
                    e.message.includes("did not match any files")) {
                    this.errors.push(new Error(`Add command did not match any file`));
                }
                else
                    throw e;
            });
            core__namespace.info("> Creating commit...");
            await git.commit("Update '.kjam' output", undefined, {}, (err, data) => {
                if (data) {
                    this.setOutput("committed", "true");
                    this.setOutput("commit_sha", data.commit);
                }
                return log(err, data);
            });
            core__namespace.info("> Pushing commit to repo...");
            await git.push("origin", branch, { "--set-upstream": null }, (err, data) => {
                if (data)
                    this.setOutput("pushed", "true");
                return log(err, data);
            });
            core__namespace.endGroup();
            core__namespace.info("> Task completed!!!");
        }
        else {
            core__namespace.endGroup();
            core__namespace.info("> Working tree clean. Nothing to commit.");
        }
    }
    setOutput(name, value) {
        this.outputs[name] = value;
        core__namespace.setOutput(name, value);
    }
    logOutputs() {
        core__namespace.startGroup("Outputs");
        for (const key in this.outputs) {
            core__namespace.info(`${key}: ${this.outputs[key]}`);
        }
        core__namespace.endGroup();
    }
    success() {
        if (this.errors.length === 1) {
            throw this.errors[0];
        }
        else if (this.errors.length > 1) {
            this.errors.forEach((e) => core__namespace.error(e));
            throw "There have been multiple runtime errors.";
        }
        this.logOutputs();
    }
    error(e) {
        core__namespace.endGroup();
        this.logOutputs();
        core__namespace.setFailed(e);
    }
}

exports.Git = Git;
