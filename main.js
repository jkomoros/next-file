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
		new Notice('Not yet implemented');
	}

	previousByCreatedDate() {
		new Notice('Not yet implemented');
	}

	folderOfActiveLeaf() {
		if (!this.app.workspace.activeLeaf) {
			return null;
		}
		const activeLeaf = this.app.workspace.activeLeaf;
		if (!activeLeaf.view.file) {
			return null;
		}
		return activeLeaf.view.file.parent;
	}

	navigateToRandomNoteInFolder(folder) {
		if (!folder || !folder.children) {
			new Notice('Invalid folder.');
			return;
		}
		const randomChild = this.randomFileInFolder(folder);
		if (!randomChild) {
			new Notice('No files in that folder.');
			return;
		}
		this.app.workspace.activeLeaf.openFile(randomChild);
	}
}

module.exports = NextByDatePlugin;