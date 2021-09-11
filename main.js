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
		const currentFile = this.activeLeafFile();
		if (!currentFile) {
			new Notice('No active file');
			return;
		}
		const folder = currentFile.parent;
		if (!folder) {
			new Notice('No containing folder');
			return;
		}

		let adjacentFile = null;
		for (const file of folder.children) {
			//Skip folders
			if (file.children) continue;
			//Skip the current file
			if (file.name == currentFile.name) continue;
			//Bail out of if this file isn't oh the correct side of curent file, and closer to the current file than the last good one we found
			if (movePrevious) {
				if (file.stat.ctime > currentFile.stat.ctime) continue;
				//TODO: is this logic correct?
				if (adjacentFile && adjacentFile.stat.ctime < file.stat.ctime) continue;
			} else {
				if (file.stat.ctime < currentFile.stat.ctime) continue;
				if (adjacentFile && adjacentFile.stat.ctime > file.stat.ctime) continue;
			}
			//We found a new one that's closer
			adjacentFile = file;
		}

		if (!adjacentFile) {
			new Notice('No other file in that direction');
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