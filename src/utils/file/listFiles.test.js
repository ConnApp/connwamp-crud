const test = require('ava')

const listFiles = require('./listFiles')

test('should list only files from directory. Excludes index [src directory]', async t => {
    const srcPath = __dirname

    const srcFiles = [
        'listFiles',
        'listFolders',
    ]

    const files = listFiles(srcPath)

    for (let srcFile of srcFiles) {
        t.true(files.includes(srcFile))
    }
})
