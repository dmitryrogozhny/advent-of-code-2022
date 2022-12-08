import { getData, getLines } from './utils'

interface File {
  name: string
  size: number
}

interface Folder {
  name: string
  files: File[]
  parent: Folder | null
  subFolders: Folder[]
}

// https://adventofcode.com/2022/day/7
export function day7part1 (terminalOutput: string[]): number {
  const sizeLimit = 100000
  const root = parseFolders(terminalOutput)

  // find all folders unred limit size
  const foldersUnderSizeLimit = findFolders(root, [], (folder) => getSize(folder) <= sizeLimit)
  const sumSize = foldersUnderSizeLimit.reduce((sum, f) => sum + getSize(f), 0)

  return sumSize
}

// https://adventofcode.com/2022/day/7#part2
export function day7part2 (terminalOutput: string[]): number {
  const totalDiskSize = 70000000
  const requiredSize = 30000000
  const root = parseFolders(terminalOutput)

  const allFilesSize = getSize(root)
  const sizeToDelete = requiredSize - (totalDiskSize - allFilesSize)

  // find all the folders with the size over the size needed to delete
  const foldersToDelete = findFolders(root, [], (f) => getSize(f) >= sizeToDelete)

  // take the smallest folder out of all options
  const foldersSizes = foldersToDelete.map(getSize).sort((a, b) => a - b)

  return foldersSizes[0]
}

/**
 * Gets the list of all the folders that are matching the condition specified by the condition function.
 * @param folder The folder to start from
 * @param matchingFolders List of all the folders that are matching the condition
 * @param condition The condition function
 * @returns The list of all the folders that are matching the condition
 */
function findFolders (folder: Folder, matchingFolders: Folder[], condition: (folder: Folder) => boolean): Folder[] {
  if (condition(folder)) {
    matchingFolders.push(folder)
  }

  folder.subFolders.forEach((f) => findFolders(f, matchingFolders, condition))

  return matchingFolders
}

/**
 * The root folder of the parsed folders' structure.
 * @param terminalOutput The terminal output
 */
function parseFolders (terminalOutput: string[]): Folder {
  const root: Folder = createFolder('/')

  // set the root as the starting folder
  let currentFolder = root

  // skip the first command as it's setting the root as the starting folder
  for (let i = 1; i < terminalOutput.length; i++) {
    const output = terminalOutput[i]

    // check whether it's a command or output
    if (output[0] === '$') {
      // command
      const [_, command, argument] = output.split(' ')
      switch (command) {
        case 'ls':
          // ignore the command
          break
        case 'cd':
          // change the current folder
          if (argument === '..') {
            if (currentFolder.parent === null) {
              throw new Error('Cannot navigate up from the root folder')
            }

            currentFolder = currentFolder.parent
          } else {
            const folder = currentFolder.subFolders.find((f) => f.name === argument)

            if (folder === undefined) {
              throw new Error(`Cannot find the ${argument} folder in the ${currentFolder.name} folder`)
            }

            currentFolder = folder
          }
          break
        default:
          throw new Error(`Unknown command: ${output}`)
      }
    } else {
      // output
      // check if it's a directory or a file
      if (output.startsWith('dir')) {
        // directory
        const name = output.split(' ')[1]
        const folder = createFolder(name)
        addFolder(folder, currentFolder)
      } else {
        // file
        const [sizeStr, name] = output.split(' ')
        const file = createFile(name, parseInt(sizeStr, 10))
        addFile(file, currentFolder)
      }
    }
  }

  return root
}

/**
 * Gets the size of the folder including all the subfolders.
 * @param folder Folder
 * @returns The size of the folder
 */
function getSize (folder: Folder): number {
  const filesSize = folder.files.reduce((sum, f) => sum + f.size, 0)
  const subFoldersSize = folder.subFolders.reduce((sum, f) => sum + getSize(f), 0)

  return filesSize + subFoldersSize
}

function addFolder (folder: Folder, parent: Folder): void {
  if (parent.subFolders.find((f) => f.name === folder.name) != null) {
    throw new Error(`Folder ${folder.name} already exists in the folder ${parent.name}`)
  }

  folder.parent = parent
  parent.subFolders.push(folder)
}

function createFolder (name: string): Folder {
  return { name, parent: null, files: [], subFolders: [] }
}

function createFile (name: string, size: number): File {
  return { name, size }
}

function addFile (file: File, parent: Folder): void {
  parent.files.push(file)
}

getData(7).then((dayData) => {
  const testDayData = `$ cd /
    $ ls
    dir a
    14848514 b.txt
    8504156 c.dat
    dir d
    $ cd a
    $ ls
    dir e
    29116 f
    2557 g
    62596 h.lst
    $ cd e
    $ ls
    584 i
    $ cd ..
    $ cd ..
    $ cd d
    $ ls
    4060174 j
    8033020 d.log
    5626152 d.ext
    7214296 k`

  const testData = testDayData.split('\n').map(s => s.trim())
  const data = getLines(dayData)

  console.log(day7part1(testData))
  console.log(day7part1(data))

  console.log(day7part2(testData))
  console.log(day7part2(data))
}).catch(e => console.error(e))
