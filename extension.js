const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	console.log('Congratulations, your extension "cutcopypastedelete" is now active!');

	let disposable = vscode.commands.registerCommand('cutcopypastedelete.helloWorld', function () {

		vscode.window.showInformationMessage('Hello World from CutCopyPasteDELETE!');
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
