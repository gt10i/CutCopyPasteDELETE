const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	let disposable = vscode.commands.registerCommand('cutcopypastedelete.deleteEditorContextMenu', function () {

		const editor = vscode.window.activeTextEditor;

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
						console.log(selection);
						editBuilder.delete(selection)
					}
				})
			})

			// delete line - Make this an option?
			
			console.log("End");
			vscode.window.showInformationMessage("End");
		}
	});

		// const selectionRange = new vscode.Range(selection.start, selection.end);
		// const selectedText = editor.document.getText(selectionRange);
		// console.log(selectedText);

	// const document = editor.document;

	// editor.edit(editBuilder => {
	// 	editor.selections.forEach(sel => {
	// 		const range = sel.isEmpty ? document.getWordRangeAtPosition(sel.start) || sel : sel;
	// 	})
	// })


context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
