const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	let disposable = vscode.commands.registerCommand('cutcopypastedelete.deleteEditorContextMenu', function () {

		const editor = vscode.window.activeTextEditor;

		let config = vscode.workspace.getConfiguration('cutcopypastedelete');
		let deleteLine = config.get("deleteLineOnNoSeletion");
		let emptyLine = config.get("emptyLineOnNoSeletion");
		let deleteWordUnderTheCaret = config.get("deleteWordUnderTheCaret");
		let trimRight = config.get("trimRight");

		if (editor) {
			editor.edit(editBuilder => {
				editor.selections.forEach(selection => {
					if (selection && !selection.isEmpty) {
						console.log(`Deleted: ${editor.document.getText(selection)}`);
						editBuilder.delete(selection)

						// trim here too
					}
					else if (deleteLine) {

						const currentLineRangeWithLineBreak = editor.document.lineAt(selection.active.line).rangeIncludingLineBreak;

						editBuilder.delete(currentLineRangeWithLineBreak);

						console.log(`Deleted line: ${editor.document.getText(currentLineRangeWithLineBreak)}`);
					}
					else if (emptyLine) {

						const currentLineRange = editor.document.lineAt(selection.active.line).range;

						editBuilder.delete(currentLineRange);

						console.log(`Deleted line: ${editor.document.getText(currentLineRange)}`);
					}
					// else if (deleteWordUnderTheCaret){

					// 	const word = editor.document.getWordRangeAtPosition(selection.start);

					// 	editBuilder.delete(word);

					// 	console.log(`Deleted: ${editor.document.getText(wordRange)}`);
					// }
					// else if (deleteWordUnderTheCaret && trimLeft) {
					// 	// if leave one space, just -1 from the spaces range
					// }
					else if (deleteWordUnderTheCaret && trimRight) {

						let currentRange = editor.document.getWordRangeAtPosition(selection.start);
						let startPosition = new vscode.Position(currentRange.end.line, (currentRange.end.character));
						let endPosition = new vscode.Position(currentRange.end.line, (currentRange.end.character + 1));
						let nextCharacterRange = new vscode.Range(startPosition, endPosition);
						let nextCharacter = editor.document.getText(nextCharacterRange);

						let emptyLog = "";
						let numberOfSpaces = 0;

						while (nextCharacter === " ") {

							let moveStartPositionByOne = new vscode.Range(endPosition,
								new vscode.Position(currentRange.end.line, (currentRange.end.character + 1)));

							startPosition = new vscode.Position(moveStartPositionByOne.end.line, (moveStartPositionByOne.end.character));
							endPosition = new vscode.Position(moveStartPositionByOne.end.line, (moveStartPositionByOne.end.character) + 1);

							const nextCharacterPosition = new vscode.Range(startPosition, endPosition);

							nextCharacter = editor.document.getText(nextCharacterPosition);

							numberOfSpaces++;
						}

						emptyLog = `Number of empty numberOfSpaces that will be deleted: ${numberOfSpaces}`;
						console.log(emptyLog);

						let finalStartPosition = new vscode.Position(currentRange.end.line, (currentRange.start.character));

						let leaveOneSpace = true;
						if (leaveOneSpace){
							numberOfSpaces -= 1;
						}
						let finalEndPosition = new vscode.Position(currentRange.end.line, (currentRange.end.character) + numberOfSpaces);

						let deletionWithTrimRange = new vscode.Range(finalStartPosition, finalEndPosition);

						console.log(`Deleted: ${editor.document.getText(deletionWithTrimRange)} (${numberOfSpaces} spaces)`);

						editBuilder.delete(deletionWithTrimRange);
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
