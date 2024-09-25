const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	let disposable = vscode.commands.registerCommand('cutcopypastedelete.deleteEditorContextMenu', function () {

		const editor = vscode.window.activeTextEditor;

		let config = vscode.workspace.getConfiguration('cutcopypastedelete');
		let deleteLine = config.get("deleteLineOnNoSeletion");
		let deleteWordUnderTheCaret = config.get("deleteWordUnderTheCaret");
		let trimRight = config.get("trimRight");
		vscode.window.showInformationMessage(deleteLine);

		if (editor) {
			// 	})
			// }

			editor.edit(editBuilder => {
				editor.selections.forEach(selection => {
					if (selection && !selection.isEmpty) {
						console.log(`Deleted: ${editor.document.getText(selection)}`);
						editBuilder.delete(selection)

						// trim here too
					}
					else if (deleteLine) {

						const wordRange = editor.document.getWordRangeAtPosition(selection.start);

						console.log(`Deleted: ${editor.document.getText(wordRange)}`);

						// editBuilder.delete(wordRange);

						// editor.selections.forEach(selection => {
						// 	(selection.active.line).range;

						// const currentLineRange = editor.document.lineAt(selection).range;
						// const selectionRange = new vscode.Range(selection.start, selection.end);

						editBuilder.delete();
					}
					else if (deleteWordUnderTheCaret && trimRight) {

						let currentRange = editor.document.getWordRangeAtPosition(selection.start);
						let startPosition = new vscode.Position(currentRange.end.line, (currentRange.end.character));
						let endPosition = new vscode.Position(currentRange.end.line, (currentRange.end.character + 1));
						let nextCharacterRange = new vscode.Range(startPosition, endPosition);
						let nextCharacter = editor.document.getText(nextCharacterRange);

						let emptyLog = "";
						let count = 0;

						while (nextCharacter === " ") {

							let nextRange = new vscode.Range(endPosition, new vscode.Position(currentRange.end.line, (currentRange.end.character + 1)));

							startPosition = new vscode.Position(nextRange.end.line, (nextRange.end.character));
							endPosition = new vscode.Position(nextRange.end.line, (nextRange.end.character) + 1);

							const nextCharacterPosition = new vscode.Range(startPosition, endPosition);

							nextCharacter = editor.document.getText(nextCharacterPosition);

							numberOfSpaces++;
						}

						emptyLog = `Number of empty numberOfSpaces that will be deleted: ${numberOfSpaces}`;
						console.log(emptyLog);

						let finalStartPosition = new vscode.Position(currentRange.end.line, (currentRange.start.character));
						let finalEndPosition = new vscode.Position(currentRange.end.line, (currentRange.end.character) + numberOfSpaces);

						let deletionWithTrimRange = new vscode.Range(finalStartPosition, finalEndPosition);

						console.log(`Deleted: ${editor.document.getText(deletionWithTrimRange)} (${numberOfSpaces} spaces)`);

						editBuilder.delete(deletionWithTrimRange);

					}
				}).catch(err => console.log(err));
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
