const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	console.log('Congratulations, your extension "cutcopypastedelete" is now active!');

	let disposable = vscode.commands.registerCommand('cutcopypastedelete.helloWorld', function () {

		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;
		if (selection && !selection.isEmpty) {
			const selectionRange = new vscode.Range(selection.start, selection.end);
			const highlighted = editor.document.getText(selectionRange);

		vscode.window.showInformationMessage('Hello World from CutCopyPasteDELETE!' + highlighted);
		}

	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
