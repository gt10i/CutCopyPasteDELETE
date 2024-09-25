const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

var config = vscode.workspace.getConfiguration('cutCopyPasteDelete');
const DELETE_WORD_UNDER_THE_CARET = config.get("deleteWordUnderTheCaret.enabled")
const DELETE_LINE_WHEN_CARET_AT_EOLC = config.get("deleteWordUnderTheCaret.deleteLineWhenCaretAtEndOfLineCharacter.enabled");
const DELETE_LINE_IF_NO_SELECTION = config.get("deleteLineIfNoSeletion.enabled");
const EMPTY_LINE = config.get("deleteLineIfNoSeletion.emptyLine.enabled");
const TRIM_LEFT = config.get("trim.left.enabled")
const TRIM_TO_ONE_SPACE_LEFT = config.get("trim.left.leaveOneSpace");
const TRIM_RIGHT = config.get("trim.right.enabled");
const TRIM_TO_ONE_SPACE_RIGHT = config.get("trim.right.leaveOneSpace");

function activate(context) {

	let disposable = vscode.commands.registerCommand('cutcopypastedelete.deleteEditorContextMenu', function () {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			editor.edit(editBuilder => {
				editor.selections.forEach(selection => {
					if (selection && !selection.isEmpty) {

						let currentRange = new vscode.Range(selection.start, selection.end)
						deleteText(editor, editBuilder, currentRange);
					}
					else if (DELETE_WORD_UNDER_THE_CARET) {

						let currentRange = editor.document.getWordRangeAtPosition(selection.start);

						if (currentRange == undefined && DELETE_LINE_IF_NO_SELECTION) {

							deleteLine(editor, editBuilder, selection);
							return;
						}

						if (currentRange && DELETE_LINE_WHEN_CARET_AT_EOLC) {

							var endOfLineCharacter = editor.document.lineAt(selection.active.line).range.end.character;
							var caretPosition = selection.active.character;

							if (endOfLineCharacter == caretPosition) {

								deleteLine(editor, editBuilder, selection);
								return;
							}
						}

						deleteText(editor, editBuilder, currentRange);
					}
					else if (DELETE_LINE_IF_NO_SELECTION) {

						deleteLine(editor, editBuilder, selection);
					}
				})
			})
		}
	});

	context.subscriptions.push(disposable);
}

function deleteText(editor, editBuilder, currentRange) {

	let numberOfSpacesToTrimLeft = 0
	if (TRIM_LEFT) {
		numberOfSpacesToTrimLeft = getNumberOfSpacesToTrimLeft(editor, currentRange);
	}

	let numberOfSpacesToTrimRight = 0
	if (TRIM_RIGHT) {
		numberOfSpacesToTrimRight = getNumberOfSpacesToTrimRight(editor, currentRange);
	}

	let finalStartPosition = new vscode.Position(currentRange.start.line, currentRange.start.character - numberOfSpacesToTrimLeft);
	let finalEndPosition = new vscode.Position(currentRange.end.line, currentRange.end.character + numberOfSpacesToTrimRight);
	let deletionWithTrimRange = new vscode.Range(finalStartPosition, finalEndPosition);

	editBuilder.delete(deletionWithTrimRange);
}

function deleteLine(editor, editBuilder, selection) {

	let lineDeleteRange = editor.document.lineAt(selection.active.line).rangeIncludingLineBreak;

	if (EMPTY_LINE) {
		lineDeleteRange = editor.document.lineAt(selection.active.line).range;
	}

	editBuilder.delete(lineDeleteRange);
	console.log(`Deleted line: ${editor.document.getText(lineDeleteRange)}`);
}

function getNumberOfSpacesToTrimLeft(editor, currentRange) {

	if (currentRange == undefined) {
		return;
	}

	let wordStart = new vscode.Position(currentRange.end.line, currentRange.start.character);

	if (wordStart.character == 0) {
		return;
	}

	let wordStartWithUnderstep = new vscode.Position(currentRange.end.line, (currentRange.start.character - 1));
	let previousCharacterRange = new vscode.Range(wordStartWithUnderstep, wordStart);
	let previousCharacter = editor.document.getText(previousCharacterRange);

	let numberOfSpaces = 0;

	while (previousCharacter == " ") {

		numberOfSpaces++;

		let head = wordStart.character - 1;

		if (head == 0) { // if head not zero
			break;
		}

		wordStart = new vscode.Position(currentRange.end.line, head);
		wordStartWithUnderstep = new vscode.Position(currentRange.end.line, head - 1);

		let nextCharacterRange = new vscode.Range(wordStartWithUnderstep, wordStart);
		previousCharacter = editor.document.getText(nextCharacterRange);
	}

	if (TRIM_TO_ONE_SPACE_LEFT && numberOfSpaces > 0) {
		numberOfSpaces -= 1;
	}

	return numberOfSpaces;
}

function getNumberOfSpacesToTrimRight(editor, currentRange) {

	let endPositionOfWord = new vscode.Position(currentRange.end.line, (currentRange.end.character));
	let overStep = new vscode.Position(currentRange.end.line, (currentRange.end.character + 1));
	let nextCharacterRange = new vscode.Range(endPositionOfWord, overStep);
	let nextCharacter = editor.document.getText(nextCharacterRange);

	let numberOfSpaces = 0;

	while (nextCharacter == " ") {

		let head = overStep.character;

		endPositionOfWord = new vscode.Position(currentRange.end.line, head);
		overStep = new vscode.Position(currentRange.end.line, head + 1);

		head += 1;

		nextCharacterRange = new vscode.Range(endPositionOfWord, overStep);

		nextCharacter = editor.document.getText(nextCharacterRange);

		numberOfSpaces++;
	}

	console.log(`Number right spaces that will be deleted before leaveOneSpace flag: ${numberOfSpaces}`);

	if (TRIM_TO_ONE_SPACE_RIGHT && numberOfSpaces > 0) {
		numberOfSpaces -= 1;
	}

	return numberOfSpaces;
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
