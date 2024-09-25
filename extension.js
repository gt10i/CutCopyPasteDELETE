const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	let disposable = vscode.commands.registerCommand('cutcopypastedelete.deleteEditorContextMenu', function () {

		const editor = vscode.window.activeTextEditor;

		let config = vscode.workspace.getConfiguration('cutcopypastedelete');
		let deleteLine = config.get("deleteLineOnNoSeletion");
		let deleteWordUnderCaret = config.get("deleteWordUnderTheCaret");
		vscode.window.showInformationMessage(deleteLine);

		if (editor) {

			// const selection = editor.selection;
			// console.log(editor.document.getText(selection));

			// if (selection && !selection.isEmpty) {

			// 	editor.edit(editBuilder => {
			// 		editBuilder.delete(selection)

			// 	}).catch(err => console.log(err));
			// }

			editor.edit(editBuilder => {
				editor.selections.forEach(selection => {
					if (selection && !selection.isEmpty) {
						console.log(`Deleted: ${editor.document.getText(selection)}`);
						editBuilder.delete(selection)
					}
					else if (deleteWordUnderCaret) {

						// const selectionRange = new vscode.Range(editor.selection.start.line, editor.selection.end.character);

						// editor.selections.forEach(selection => {
						// 	(selection.active.line).range;

						// const selectionRange = new vscode.Range(selection.start, selection.end);

						// const currentLineRange = editor.document.lineAt(selection).range;

						const wordRange = editor.document.getWordRangeAtPosition(selection.start);

						console.log(`Deleted: ${editor.document.getText(wordRange)}`);

						editBuilder.delete(wordRange);
					}
				})
			})

			console.log("End");
			vscode.window.showInformationMessage("End");
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
