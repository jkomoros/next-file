const obsidian = require('obsidian');

const compareFileByCreatedTime = (one, two) => {
	if (one.stat.ctime == two.stat.ctime) return 0;
	return one.stat.ctime > two.stat.ctime ? -1 : 1;
}

const reversed = (func) => {
	return (one,two) => func(one, two) * -1
}

class NextByDatePlugin extends obsidian.Plugin {

	async onload() {

		this.addCommand({
			id: 'next-by-created-date',
			name: 'Navigate to next file in current folder (by file creation date)',
			checkCallback: (checking) => {
				if (checking) {
					const file = this.getAdjacentFile(false);
					return file ? true : false;
				}
				this.navigateToAdjacentFile(false);
				return true;
			},
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
			checkCallback: (checking) => {
				if (checking) {
					const file = this.getAdjacentFile(true);
					return file ? true : false;
				}
				this.navigateToAdjacentFile(true);
				return true;
			},
			hotkeys: [
				{
					modifiers:['Mod', 'Alt'],
					key: 'ArrowUp',
				}
			]
		})
	}

	getAdjacentFile(movePrevious) {
		const currentFile = this.activeLeafFile();
		if (!currentFile) return null;
		const folder = currentFile.parent;
		if (!folder) return null;
		return this.adjacentFile(movePrevious, currentFile, folder);
	}

	adjacentFile(movePrevious, currentFile, folder) {
		let compare = compareFileByCreatedTime;
		if (movePrevious) compare = reversed(compare);

		let adjacentFile = null;
		for (const file of folder.children) {
			//Skip folders
			if (file.children) continue;
			//Skip the current file
			if (file.name == currentFile.name) continue;
			//Bail if the file isn't on the "right" side of the current file
			if (compare(currentFile, file) < 0) continue;
			//Bail if the file isn't closer to the current file than one we've already found
			if (adjacentFile && compare(adjacentFile, file) > 0) continue;
			adjacentFile = file;
		}
		return adjacentFile;
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

		const adjacentFile = this.adjacentFile(movePrevious, currentFile, folder);

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