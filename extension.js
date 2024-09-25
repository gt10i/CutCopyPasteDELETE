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
		let trimLeft = config.get("trimLeft")
		let trimRight = config.get("trimRight");

		if (editor) {
			editor.edit(editBuilder => {
				editor.selections.forEach(selection => {
					if (selection && !selection.isEmpty) {

						// if trim left - getNumberOfSpacesToTrimLeft
						// if trim right - getNumberOfSpacesToTrimRight
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
					else if (deleteWordUnderTheCaret){

						const word = editor.document.getWordRangeAtPosition(selection.start);

						editBuilder.delete(word);

						console.log(`Deleted: ${editor.document.getText(word)}`);
					}
					else if (deleteWordUnderTheCaret || trimLeft) {

						let currentRange = editor.document.getWordRangeAtPosition(selection.start);

						if (currentRange == undefined){
							console.log(`Undefined. Escaped`)
							return;
						}

						let wordStart = new vscode.Position(currentRange.end.line, currentRange.start.character);

						if (wordStart.character == 0) {
							console.log(`Character was: ${wordStart.character}. Beginning of line. Escaped`)
							return;
						}

						let wordStartWithUnderstep = new vscode.Position(currentRange.end.line, (currentRange.start.character - 1));
						let previousCharacterRange = new vscode.Range(wordStartWithUnderstep, wordStart);
						let previousCharacter = editor.document.getText(previousCharacterRange);

						let numberOfSpaces = 0;

						while (previousCharacter === " ") {

							numberOfSpaces++;

							let head = wordStart.character - 1;

							if (head == 0) { // if head not zero
								console.log(`Character was: ${head}. Escaped`)
								break;
							}

							wordStart = new vscode.Position(currentRange.end.line, head);
							wordStartWithUnderstep = new vscode.Position(currentRange.end.line, head - 1);

							nextCharacterRange = new vscode.Range(wordStartWithUnderstep, wordStart);
							previousCharacter = editor.document.getText(nextCharacterRange);
						}

						console.log(`Number of empty that will be deleted: ${numberOfSpaces}`);

						let finalEndPosition = new vscode.Position(currentRange.end.line, (currentRange.end.character));

						let leaveOneSpace = true;
						if (leaveOneSpace) {
							numberOfSpaces -= 1;
							console.log(`leaveOneSpace = ${leaveOneSpace}. Number of empty that will be deleted: ${numberOfSpaces}`)
						}

						let finalStartPosition = new vscode.Position(currentRange.end.line, (currentRange.start.character) - numberOfSpaces);

						let deletionWithTrimRange = new vscode.Range(finalStartPosition, finalEndPosition);

						console.log(`Deleted: ${editor.document.getText(deletionWithTrimRange)} (${numberOfSpaces} spaces)`);

						editBuilder.delete(deletionWithTrimRange);
					}
					else if (deleteWordUnderTheCaret && trimRight) {

						let currentRange = editor.document.getWordRangeAtPosition(selection.start);
						let endPositionOfWord = new vscode.Position(currentRange.end.line, (currentRange.end.character));
						let overStep = new vscode.Position(currentRange.end.line, (currentRange.end.character + 1));
						let nextCharacterRange = new vscode.Range(endPositionOfWord, overStep);
						let nextCharacter = editor.document.getText(nextCharacterRange);

						let numberOfSpaces = 0;

						while (nextCharacter === " ") {

							let head = overStep.character;

							endPositionOfWord = new vscode.Position(currentRange.end.line, head);
							overStep = new vscode.Position(currentRange.end.line, head + 1);

							head += 1;

							nextCharacterRange = new vscode.Range(endPositionOfWord, overStep);

							nextCharacter = editor.document.getText(nextCharacterRange);

							numberOfSpaces++;
						}

						console.log(`Number of empty numberOfSpaces that will be deleted: ${numberOfSpaces}`);

						let finalStartPosition = new vscode.Position(currentRange.end.line, (currentRange.start.character));

						let leaveOneSpace = false;
						if (leaveOneSpace) {
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
