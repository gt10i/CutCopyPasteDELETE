const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	console.log('Congratulations, your extension "cutcopypastedelete" is now active!');

	let disposable = vscode.commands.registerCommand('cutcopypastedelete.deleteEditorContextMenu', function () {

		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			editor.edit(editBuilder => {
				editor.selections.forEach(sel => {
					const range = sel.isEmpty ? document.getWordRangeAtPosition(sel.start) || sel : sel;
					let word = editor.document.getText(range);
					editBuilder.delete(range)
					vscode.window.showInformationMessage(range.start.character.toString() + word);
				})
			}) // apply the (accumulated) replacement(s) (if multiple cursors/selections)
		}




		// const editor = vscode.window.activeTextEditor;
		// const selection = editor.selection;
		// if (selection && !selection.isEmpty) {
		// 	const selectionRange = new vscode.Range(selection.start, selection.end);
		// 	const highlighted = editor.document.getText(selectionRange);
		// 	const replaced = highlighted.replace(highlighted,"T");

		// editor.edit(editBuilder => {
		// 	editBuilder.replace(editor.document.getText(selectionRange), "textReplace");
		//   }).catch(err => console.log(err));
		// }

		// vscode.window.showInformationMessage(replaced);
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
