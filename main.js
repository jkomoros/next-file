const obsidian = require('obsidian');

const compareFileByCreatedTime = (one, two) => {
	if (one.stat.ctime == two.stat.ctime) return 0;
	return one.stat.ctime > two.stat.ctime ? -1 : 1;
}

const compareFileByModifiedTime = (one, two) => {
	if (one.stat.mtime == two.stat.mtime) return 0;
	return one.stat.mtime > two.stat.mtime ? -1 : 1;
}

const compareFileByName = (one, two) => {
	if (one.name == two.name) return 0;
	return one.name > two.name ? -1 : 1;
}

const reversed = (func) => {
	return (one,two) => func(one, two) * -1
}

const NEXT_DESCRIPTION_MIDDLE = ' - Navigate to next file in current folder by file ';
const PREV_DESCRIPTION_MIDDLE = ' - Navigate to previous file in current folder by file ';

const NEXT_BY_CREATED_DATE = 'next-by-created-date';
const PREV_BY_CREATED_DATE = 'prev-by-created-date';
const NEXT_BY_MODIFIED_DATE = 'next-by-modified-date';
const PREV_BY_MODIFIED_DATE = 'prev-by-modified-date';
const NEXT_BY_NAME = 'next-by-name';
const PREV_BY_NAME = 'prev-by-name';

class NextFilePlugin extends obsidian.Plugin {

	async onload() {

		this.addCommand({
			id: NEXT_BY_CREATED_DATE,
			name: 'Next Created' + NEXT_DESCRIPTION_MIDDLE + 'creation date',
			checkCallback: (checking) => {
				return this.checkCallback(checking, compareFileByCreatedTime);
			},
			hotkeys: [
				{
					modifiers:['Mod', 'Alt'],
					key: 'ArrowDown',
				}
			]
		});

		this.addCommand({
			id: PREV_BY_CREATED_DATE,
			name: 'Previous Created' +  PREV_DESCRIPTION_MIDDLE + 'creation date',
			checkCallback: (checking) => {
				return this.checkCallback(checking, reversed(compareFileByCreatedTime));
			},
			hotkeys: [
				{
					modifiers:['Mod', 'Alt'],
					key: 'ArrowUp',
				}
			]
		})

		this.addCommand({
			id: NEXT_BY_MODIFIED_DATE,
			name: 'Next Modified' + NEXT_DESCRIPTION_MIDDLE + 'modification date',
			checkCallback: (checking) => {
				return this.checkCallback(checking, compareFileByModifiedTime);
			}
		});

		this.addCommand({
			id: PREV_BY_MODIFIED_DATE,
			name: 'Previous Modified' +  PREV_DESCRIPTION_MIDDLE + 'modification date',
			checkCallback: (checking) => {
				return this.checkCallback(checking, reversed(compareFileByModifiedTime));
			}
		})

		this.addCommand({
			id: NEXT_BY_NAME,
			name: 'Next Name' + NEXT_DESCRIPTION_MIDDLE + 'name',
			checkCallback: (checking) => {
				return this.checkCallback(checking, compareFileByName);
			}
		});

		this.addCommand({
			id: PREV_BY_NAME,
			name: 'Previous Name' +  PREV_DESCRIPTION_MIDDLE + 'name',
			checkCallback: (checking) => {
				return this.checkCallback(checking, reversed(compareFileByName));
			}
		})
	}

	checkCallback(checking, compare) {
		if (checking) {
			const file = this.getAdjacentFile(compare);
			return file ? true : false;
		}
		this.navigateToAdjacentFile(compare);
		return true;
	}

	getAdjacentFile(compare) {
		const currentFile = this.activeLeafFile();
		if (!currentFile) return null;
		const folder = currentFile.parent;
		if (!folder) return null;
		return this.adjacentFile(compare, currentFile, folder);
	}

	adjacentFile(compare, currentFile, folder) {
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

	navigateToAdjacentFile(compare) {
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

		const adjacentFile = this.adjacentFile(compare, currentFile, folder);

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

module.exports = NextFilePlugin;