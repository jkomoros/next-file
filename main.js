const obsidian = require('obsidian');

class NextByDatePlugin extends obsidian.Plugin {

	async onload() {

		this.addCommand({
			id: 'next-by-created-date',
			name: 'Navigate to next file in current folder (by file creation date)',
			callback: () => this.nextByCreatedDate(),
			hotkeys: [
				{
					modifiers:['Mod', 'Alt'],
					key: 'ArrowDown',
				}
			]
		});

		this.addCommand({
			id: 'previous-by-created-date',
			name: 'Navigate to previous file in current folder (by file creation date)',
			callback: () => this.previousByCreatedDate(),
			hotkeys: [
				{
					modifiers:['Mod', 'Alt'],
					key: 'ArrowUp',
				}
			]
		})
	}

	nextByCreatedDate() {
		this.navigateToAdjacentFile(false);
	}

	previousByCreatedDate() {
		this.navigateToAdjacentFile(true);
	}

	navigateToAdjacentFile(movePrevious) {
		const file = this.activeLeafFile();
		if (!file) {
			new Notice('No active file');
			return;
		}
		const folder = file.parent;
		if (!folder) {
			new Notice('No containing folder');
			return;
		}

		let adjacentFile = null;

		//TODO: set adjacentFile to next file in folder

		if (!adjacentFile) {
			new Notice('No other file');
			return;
		}

		this.app.workspace.activeLeaf.openFile(adjacentFile);

	}

	activeLeafFile() {
		if (!this.app.workspace.activeLeaf) {
			return null;
		}
		return this.app.workspace.activeLeaf.view.file;
	}
}

module.exports = NextByDatePlugin;