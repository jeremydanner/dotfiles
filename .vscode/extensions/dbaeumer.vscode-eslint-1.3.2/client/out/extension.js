/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const eslintrc = [
    '{',
    '    "env": {',
    '        "browser": true,',
    '        "commonjs": true,',
    '        "es6": true,',
    '        "node": true',
    '    },',
    '    "parserOptions": {',
    '        "ecmaFeatures": {',
    '            "jsx": true',
    '        },',
    '        "sourceType": "module"',
    '    },',
    '    "rules": {',
    '        "no-const-assign": "warn",',
    '        "no-this-before-super": "warn",',
    '        "no-undef": "warn",',
    '        "no-unreachable": "warn",',
    '        "no-unused-vars": "warn",',
    '        "constructor-super": "warn",',
    '        "valid-typeof": "warn"',
    '    }',
    '}'
].join(process.platform === 'win32' ? '\r\n' : '\n');
var Is;
(function (Is) {
    const toString = Object.prototype.toString;
    function boolean(value) {
        return value === true || value === false;
    }
    Is.boolean = boolean;
    function string(value) {
        return toString.call(value) === '[object String]';
    }
    Is.string = string;
})(Is || (Is = {}));
var ValidateItem;
(function (ValidateItem) {
    function is(item) {
        let candidate = item;
        return candidate && Is.string(candidate.language) && (Is.boolean(candidate.autoFix) || candidate.autoFix === void 0);
    }
    ValidateItem.is = is;
})(ValidateItem || (ValidateItem = {}));
var DirectoryItem;
(function (DirectoryItem) {
    function is(item) {
        let candidate = item;
        return candidate && Is.string(candidate.directory) && (Is.boolean(candidate.changeProcessCWD) || candidate.changeProcessCWD === void 0);
    }
    DirectoryItem.is = is;
})(DirectoryItem || (DirectoryItem = {}));
var Status;
(function (Status) {
    Status[Status["ok"] = 1] = "ok";
    Status[Status["warn"] = 2] = "warn";
    Status[Status["error"] = 3] = "error";
})(Status || (Status = {}));
var StatusNotification;
(function (StatusNotification) {
    StatusNotification.type = new vscode_languageclient_1.NotificationType('eslint/status');
})(StatusNotification || (StatusNotification = {}));
var NoConfigRequest;
(function (NoConfigRequest) {
    NoConfigRequest.type = new vscode_languageclient_1.RequestType('eslint/noConfig');
})(NoConfigRequest || (NoConfigRequest = {}));
var NoESLintLibraryRequest;
(function (NoESLintLibraryRequest) {
    NoESLintLibraryRequest.type = new vscode_languageclient_1.RequestType('eslint/noLibrary');
})(NoESLintLibraryRequest || (NoESLintLibraryRequest = {}));
const exitCalled = new vscode_languageclient_1.NotificationType('eslint/exitCalled');
function pickFolder(folders, placeHolder) {
    if (folders.length === 1) {
        return Promise.resolve(folders[0]);
    }
    return vscode_1.window.showQuickPick(folders.map((folder) => { return { label: folder.name, description: folder.uri.fsPath, folder: folder }; }), { placeHolder: placeHolder }).then((selected) => {
        if (!selected) {
            return undefined;
        }
        return selected.folder;
    });
}
function enable() {
    let folders = vscode_1.workspace.workspaceFolders;
    if (!folders) {
        vscode_1.window.showWarningMessage('ESLint can only be enabled if VS Code is opened on a workspace folder.');
        return;
    }
    let disabledFolders = folders.filter(folder => !vscode_1.workspace.getConfiguration('eslint', folder.uri).get('enable', true));
    if (disabledFolders.length === 0) {
        if (folders.length === 1) {
            vscode_1.window.showInformationMessage('ESLint is already enabled in the workspace.');
        }
        else {
            vscode_1.window.showInformationMessage('ESLint is already enabled on all workspace folders.');
        }
        return;
    }
    pickFolder(disabledFolders, 'Select a workspace folder to enable ESLint for').then(folder => {
        if (!folder) {
            return;
        }
        vscode_1.workspace.getConfiguration('eslint', folder.uri).update('enable', true);
    });
}
function disable() {
    let folders = vscode_1.workspace.workspaceFolders;
    if (!folders) {
        vscode_1.window.showErrorMessage('ESLint can only be disabled if VS Code is opened on a workspace folder.');
        return;
    }
    let enabledFolders = folders.filter(folder => vscode_1.workspace.getConfiguration('eslint', folder.uri).get('enable', true));
    if (enabledFolders.length === 0) {
        if (folders.length === 1) {
            vscode_1.window.showInformationMessage('ESLint is already disabled in the workspace.');
        }
        else {
            vscode_1.window.showInformationMessage('ESLint is already disabled on all workspace folders.');
        }
        return;
    }
    pickFolder(enabledFolders, 'Select a workspace folder to disable ESLint for').then(folder => {
        if (!folder) {
            return;
        }
        vscode_1.workspace.getConfiguration('eslint', folder.uri).update('enable', false);
    });
}
function createDefaultConfiguration() {
    let folders = vscode_1.workspace.workspaceFolders;
    if (!folders) {
        vscode_1.window.showErrorMessage('An ESLint configuration can only be generated if VS Code is opened on a workspace folder.');
        return;
    }
    let noConfigFolders = folders.filter(folder => {
        let configFiles = ['.eslintrc.js', '.eslintrc.yaml', '.eslintrc.yml', '.eslintrc', '.eslintrc.json'];
        for (let configFile of configFiles) {
            if (fs.existsSync(path.join(folder.uri.fsPath, configFile))) {
                return false;
            }
        }
        return true;
    });
    if (noConfigFolders.length === 0) {
        if (folders.length === 1) {
            vscode_1.window.showInformationMessage('The workspace already contains an ESLint configuration file.');
        }
        else {
            vscode_1.window.showInformationMessage('All workspace folders already contain an ESLint configuration file.');
        }
        return;
    }
    pickFolder(noConfigFolders, 'Select a workspace folder to generate a ESLint configuration for').then(folder => {
        if (!folder) {
            return;
        }
        let eslintConfigFile = path.join(folder.uri.fsPath, '.eslintrc.json');
        if (!fs.existsSync(eslintConfigFile)) {
            fs.writeFileSync(eslintConfigFile, eslintrc, { encoding: 'utf8' });
        }
    });
}
let dummyCommands;
let defaultLanguages = ['javascript', 'javascriptreact'];
function shouldBeValidated(textDocument) {
    let config = vscode_1.workspace.getConfiguration('eslint', textDocument.uri);
    if (!config.get('enable', true)) {
        return false;
    }
    let validate = config.get('validate', defaultLanguages);
    for (let item of validate) {
        if (Is.string(item) && item === textDocument.languageId) {
            return true;
        }
        else if (ValidateItem.is(item) && item.language === textDocument.languageId) {
            return true;
        }
    }
    return false;
}
function activate(context) {
    let activated;
    let openListener;
    let configurationListener;
    function didOpenTextDocument(textDocument) {
        if (activated) {
            return;
        }
        if (shouldBeValidated(textDocument)) {
            openListener.dispose();
            configurationListener.dispose();
            activated = true;
            realActivate(context);
        }
    }
    function configurationChanged() {
        if (activated) {
            return;
        }
        for (let textDocument of vscode_1.workspace.textDocuments) {
            if (shouldBeValidated(textDocument)) {
                openListener.dispose();
                configurationListener.dispose();
                activated = true;
                realActivate(context);
                return;
            }
        }
    }
    openListener = vscode_1.workspace.onDidOpenTextDocument(didOpenTextDocument);
    configurationListener = vscode_1.workspace.onDidChangeConfiguration(configurationChanged);
    let notValidating = () => vscode_1.window.showInformationMessage('ESLint is not validating any files yet.');
    dummyCommands = [
        vscode_1.commands.registerCommand('eslint.executeAutofix', notValidating),
        vscode_1.commands.registerCommand('eslint.showOutputChannel', notValidating)
    ];
    context.subscriptions.push(vscode_1.commands.registerCommand('eslint.createConfig', createDefaultConfiguration), vscode_1.commands.registerCommand('eslint.enable', enable), vscode_1.commands.registerCommand('eslint.disable', disable));
    configurationChanged();
}
exports.activate = activate;
function realActivate(context) {
    let statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 0);
    let eslintStatus = Status.ok;
    let serverRunning = false;
    statusBarItem.text = 'ESLint';
    statusBarItem.command = 'eslint.showOutputChannel';
    function showStatusBarItem(show) {
        if (show) {
            statusBarItem.show();
        }
        else {
            statusBarItem.hide();
        }
    }
    function updateStatus(status) {
        switch (status) {
            case Status.ok:
                statusBarItem.color = undefined;
                break;
            case Status.warn:
                statusBarItem.color = 'yellow';
                break;
            case Status.error:
                statusBarItem.color = 'darkred';
                break;
        }
        eslintStatus = status;
        updateStatusBarVisibility(vscode_1.window.activeTextEditor);
    }
    function updateStatusBarVisibility(editor) {
        statusBarItem.text = eslintStatus === Status.ok ? 'ESLint' : 'ESLint!';
        showStatusBarItem(serverRunning &&
            (eslintStatus !== Status.ok ||
                (editor && (editor.document.languageId === 'javascript' || editor.document.languageId === 'javascriptreact'))));
    }
    vscode_1.window.onDidChangeActiveTextEditor(updateStatusBarVisibility);
    updateStatusBarVisibility(vscode_1.window.activeTextEditor);
    // We need to go one level up since an extension compile the js code into
    // the output folder.
    // serverModule
    let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    let serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: { cwd: process.cwd() } },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: { execArgv: ["--nolazy", "--inspect=6010"], cwd: process.cwd() } }
    };
    let defaultErrorHandler;
    let serverCalledProcessExit = false;
    let packageJsonFilter = { scheme: 'file', pattern: '**/package.json' };
    let configFileFilter = { scheme: 'file', pattern: '**/.eslintr{c.js,c.yaml,c.yml,c,c.json}' };
    let syncedDocuments = new Map();
    vscode_1.workspace.onDidChangeConfiguration(() => {
        for (let textDocument of syncedDocuments.values()) {
            if (!shouldBeValidated(textDocument)) {
                syncedDocuments.delete(textDocument.uri.toString());
                client.sendNotification(vscode_languageclient_1.DidCloseTextDocumentNotification.type, client.code2ProtocolConverter.asCloseTextDocumentParams(textDocument));
            }
        }
        for (let textDocument of vscode_1.workspace.textDocuments) {
            if (!syncedDocuments.has(textDocument.uri.toString()) && shouldBeValidated(textDocument)) {
                client.sendNotification(vscode_languageclient_1.DidOpenTextDocumentNotification.type, client.code2ProtocolConverter.asOpenTextDocumentParams(textDocument));
                syncedDocuments.set(textDocument.uri.toString(), textDocument);
            }
        }
    });
    let clientOptions = {
        documentSelector: [{ scheme: 'file' }, { scheme: 'untitled' }],
        diagnosticCollectionName: 'eslint',
        revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Never,
        synchronize: {
            // configurationSection: 'eslint',
            fileEvents: [
                vscode_1.workspace.createFileSystemWatcher('**/.eslintr{c.js,c.yaml,c.yml,c,c.json}'),
                vscode_1.workspace.createFileSystemWatcher('**/.eslintignore'),
                vscode_1.workspace.createFileSystemWatcher('**/package.json')
            ]
        },
        initializationOptions: () => {
            let configuration = vscode_1.workspace.getConfiguration('eslint');
            let folders = vscode_1.workspace.workspaceFolders;
            return {
                legacyModuleResolve: configuration ? configuration.get('_legacyModuleResolve', false) : false,
                nodePath: configuration ? configuration.get('nodePath', undefined) : undefined,
                languageIds: configuration ? configuration.get('valiadate', defaultLanguages) : defaultLanguages,
                workspaceFolders: folders ? folders.map(folder => folder.toString()) : []
            };
        },
        initializationFailedHandler: (error) => {
            client.error('Server initialization failed.', error);
            client.outputChannel.show(true);
            return false;
        },
        errorHandler: {
            error: (error, message, count) => {
                return defaultErrorHandler.error(error, message, count);
            },
            closed: () => {
                if (serverCalledProcessExit) {
                    return vscode_languageclient_1.CloseAction.DoNotRestart;
                }
                return defaultErrorHandler.closed();
            }
        },
        middleware: {
            didOpen: (document, next) => {
                if (vscode_1.languages.match(packageJsonFilter, document) || vscode_1.languages.match(configFileFilter, document) || shouldBeValidated(document)) {
                    next(document);
                    syncedDocuments.set(document.uri.toString(), document);
                    return;
                }
            },
            didChange: (event, next) => {
                if (syncedDocuments.has(event.document.uri.toString())) {
                    next(event);
                }
            },
            willSave: (event, next) => {
                if (syncedDocuments.has(event.document.uri.toString())) {
                    next(event);
                }
            },
            willSaveWaitUntil: (event, next) => {
                if (syncedDocuments.has(event.document.uri.toString())) {
                    return next(event);
                }
                else {
                    return Promise.resolve([]);
                }
            },
            didSave: (document, next) => {
                if (syncedDocuments.has(document.uri.toString())) {
                    next(document);
                }
            },
            didClose: (document, next) => {
                let uri = document.uri.toString();
                if (syncedDocuments.has(uri)) {
                    syncedDocuments.delete(uri);
                    next(document);
                }
            },
            provideCodeActions: (document, range, context, token, next) => {
                if (!syncedDocuments.has(document.uri.toString()) || !context.diagnostics || context.diagnostics.length === 0) {
                    return [];
                }
                let eslintDiagnostics = [];
                for (let diagnostic of context.diagnostics) {
                    if (diagnostic.source === 'eslint') {
                        eslintDiagnostics.push(diagnostic);
                    }
                }
                if (eslintDiagnostics.length === 0) {
                    return [];
                }
                let newContext = Object.assign({}, context, { diagnostics: eslintDiagnostics });
                return next(document, range, newContext, token);
            },
            workspace: {
                configuration: (params, _token, _next) => {
                    if (!params.items) {
                        return null;
                    }
                    let result = [];
                    for (let item of params.items) {
                        if (item.section || !item.scopeUri) {
                            result.push(null);
                            continue;
                        }
                        let resource = client.protocol2CodeConverter.asUri(item.scopeUri);
                        let config = vscode_1.workspace.getConfiguration('eslint', resource);
                        let settings = {
                            validate: false,
                            autoFix: false,
                            autoFixOnSave: false,
                            options: config.get('options', {}),
                            run: config.get('run', 'onType'),
                            nodePath: config.get('nodePath', undefined),
                            workingDirectory: undefined,
                            workspaceFolder: undefined,
                            library: undefined
                        };
                        let document = syncedDocuments.get(item.scopeUri);
                        if (!document) {
                            result.push(settings);
                            continue;
                        }
                        if (config.get('enabled', true)) {
                            let validateItems = config.get('validate', ['javascript', 'javascriptreact']);
                            for (let item of validateItems) {
                                if (Is.string(item) && item === document.languageId) {
                                    settings.validate = true;
                                    if (item === 'javascript' || item === 'javascriptreact') {
                                        settings.autoFix = true;
                                    }
                                    break;
                                }
                                else if (ValidateItem.is(item) && item.language === document.languageId) {
                                    settings.validate = true;
                                    settings.autoFix = item.autoFix;
                                    break;
                                }
                            }
                        }
                        if (settings.validate) {
                            settings.autoFixOnSave = settings.autoFix && config.get('autoFixOnSave', false);
                        }
                        let workspaceFolder = vscode_1.workspace.getWorkspaceFolder(resource);
                        if (workspaceFolder) {
                            settings.workspaceFolder = {
                                name: workspaceFolder.name,
                                uri: client.code2ProtocolConverter.asUri(workspaceFolder.uri)
                            };
                        }
                        let workingDirectories = config.get('workingDirectories', undefined);
                        if (Array.isArray(workingDirectories)) {
                            let workingDirectory = undefined;
                            let workspaceFolderPath = workspaceFolder && workspaceFolder.uri.scheme === 'file' ? workspaceFolder.uri.fsPath : undefined;
                            for (let entry of workingDirectories) {
                                let directory;
                                let changeProcessCWD = false;
                                if (Is.string(entry)) {
                                    directory = entry;
                                }
                                else if (DirectoryItem.is(entry)) {
                                    directory = entry.directory;
                                    changeProcessCWD = !!entry.changeProcessCWD;
                                }
                                if (directory) {
                                    if (path.isAbsolute(directory)) {
                                        directory = directory;
                                    }
                                    else if (workspaceFolderPath && directory) {
                                        directory = path.join(workspaceFolderPath, directory);
                                    }
                                    else {
                                        directory = undefined;
                                    }
                                    let filePath = document.uri.scheme === 'file' ? document.uri.fsPath : undefined;
                                    if (filePath && directory && filePath.startsWith(directory)) {
                                        if (workingDirectory) {
                                            if (workingDirectory.directory.length < directory.length) {
                                                workingDirectory.directory = directory;
                                                workingDirectory.changeProcessCWD = changeProcessCWD;
                                            }
                                        }
                                        else {
                                            workingDirectory = { directory, changeProcessCWD };
                                        }
                                    }
                                }
                            }
                            settings.workingDirectory = workingDirectory;
                        }
                        result.push(settings);
                    }
                    return result;
                }
            }
        }
    };
    let client = new vscode_languageclient_1.LanguageClient('ESLint', serverOptions, clientOptions);
    client.registerProposedFeatures();
    defaultErrorHandler = client.createDefaultErrorHandler();
    const running = 'ESLint server is running.';
    const stopped = 'ESLint server stopped.';
    client.onDidChangeState((event) => {
        if (event.newState === vscode_languageclient_1.State.Running) {
            client.info(running);
            statusBarItem.tooltip = running;
            serverRunning = true;
        }
        else {
            client.info(stopped);
            statusBarItem.tooltip = stopped;
            serverRunning = false;
        }
        updateStatusBarVisibility(vscode_1.window.activeTextEditor);
    });
    client.onReady().then(() => {
        client.onNotification(StatusNotification.type, (params) => {
            updateStatus(params.state);
        });
        client.onNotification(exitCalled, (params) => {
            serverCalledProcessExit = true;
            client.error(`Server process exited with code ${params[0]}. This usually indicates a misconfigured ESLint setup.`, params[1]);
            vscode_1.window.showErrorMessage(`ESLint server shut down itself. See 'ESLint' output channel for details.`);
        });
        client.onRequest(NoConfigRequest.type, (params) => {
            let document = vscode_1.Uri.parse(params.document.uri);
            let workspaceFolder = vscode_1.workspace.getWorkspaceFolder(document);
            let fileLocation = document.fsPath;
            if (workspaceFolder) {
                client.warn([
                    '',
                    `No ESLint configuration (e.g .eslintrc) found for file: ${fileLocation}`,
                    `File will not be validated. Consider running 'eslint --init' in the workspace folder ${workspaceFolder.name}`,
                    `Alternatively you can disable ESLint by executing the 'Disable ESLint' command.`
                ].join('\n'));
            }
            else {
                client.warn([
                    '',
                    `No ESLint configuration (e.g .eslintrc) found for file: ${fileLocation}`,
                    `File will not be validated. Alternatively you can disable ESLint by executing the 'Disable ESLint' command.`
                ].join('\n'));
            }
            eslintStatus = Status.warn;
            updateStatusBarVisibility(vscode_1.window.activeTextEditor);
            return {};
        });
        client.onRequest(NoESLintLibraryRequest.type, (params) => {
            const key = 'noESLintMessageShown';
            let state = context.globalState.get(key, {});
            let uri = vscode_1.Uri.parse(params.source.uri);
            let workspaceFolder = vscode_1.workspace.getWorkspaceFolder(uri);
            if (workspaceFolder) {
                client.info([
                    '',
                    `Failed to load the ESLint library for the document ${uri.fsPath}`,
                    '',
                    `To use ESLint please install eslint by running \'npm install eslint\' in the workspace folder ${workspaceFolder.name}`,
                    'or globally using \'npm install -g eslint\'. You need to reopen the workspace after installing eslint.',
                    '',
                    `Alternatively you can disable ESLint for the workspace folder ${workspaceFolder.name} by executing the 'Disable ESLint' command.`
                ].join('\n'));
                if (!state.workspaces) {
                    state.workspaces = Object.create(null);
                }
                if (!state.workspaces[workspaceFolder.uri.toString()]) {
                    state.workspaces[workspaceFolder.uri.toString()] = true;
                    client.outputChannel.show(true);
                    context.globalState.update(key, state);
                }
            }
            else {
                client.info([
                    `Failed to load the ESLint library for the document ${uri.fsPath}`,
                    'To use ESLint for single JavaScript file install eslint globally using \'npm install -g eslint\'.',
                    'You need to reopen VS Code after installing eslint.',
                ].join('\n'));
                if (!state.global) {
                    state.global = true;
                    client.outputChannel.show(true);
                    context.globalState.update(key, state);
                }
            }
            return {};
        });
    });
    if (dummyCommands) {
        dummyCommands.forEach(command => command.dispose());
        dummyCommands = undefined;
    }
    context.subscriptions.push(client.start(), vscode_1.commands.registerCommand('eslint.executeAutofix', () => {
        let textEditor = vscode_1.window.activeTextEditor;
        if (!textEditor) {
            return;
        }
        let textDocument = {
            uri: textEditor.document.uri.toString(),
            version: textEditor.document.version
        };
        let params = {
            command: 'eslint.applyAutoFix',
            arguments: [textDocument]
        };
        client.sendRequest(vscode_languageclient_1.ExecuteCommandRequest.type, params).then(undefined, () => {
            vscode_1.window.showErrorMessage('Failed to apply ESLint fixes to the document. Please consider opening an issue with steps to reproduce.');
        });
    }), vscode_1.commands.registerCommand('eslint.showOutputChannel', () => { client.outputChannel.show(); }), statusBarItem);
}
exports.realActivate = realActivate;
function deactivate() {
    if (dummyCommands) {
        dummyCommands.forEach(command => command.dispose());
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map