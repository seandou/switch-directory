const fs = require('fs')
const path = require('path')
const os = require('os')
const _ = require('lodash')

class DirList {
    constructor() {
        this.configFile = path.join(os.homedir(), '.sdir')
        if (!fs.existsSync(this.configFile)) {
            this._saveDirs([])
        }
    }

    _loadDirs() {
        let dirs = []
        if (fs.existsSync(this.configFile)) {
            let data = fs.readFileSync(this.configFile, 'utf8')
            dirs = JSON.parse(data)
        }

        return dirs
    }

    _saveDirs(dirs) {
        fs.writeFileSync(this.configFile, JSON.stringify(dirs, null, 2))
    }

    _newDir(dir) {
        return {dir: dir}
    }

    getDirList() {
        let dirs = this._loadDirs()
        return _.map(dirs, 'dir')
    }

    getDirSelection(dir) {
        let dirs = this._loadDirs()
        return _.map(dirs, function(item) {
            return {value: item.dir, checked: item.dir == dir}
        })
    }

    printDirs() {
        let dirs = this._loadDirs()
        console.log(dirs)
    }

    addDir(dir) {
        let dirs = this._loadDirs()
        if (!fs.lstatSync(dir).isDirectory()) {
            return false
        }

        if (_.find(dirs, {dir: dir})) {
            return false
        }

        dirs.unshift(this._newDir(dir))
        this._saveDirs(dirs)
    }

    previousDir() {
        let dirs = this._loadDirs()
        let item = dirs.shift()
        if (item) {
            return item.dir
        }
    }

    removeDirs(items) {
        if (items.length == 0)
            return
        let dirs = this._loadDirs()
        _.remove(dirs, function(item) {
            return items.indexOf(item.dir) != -1
        })
        this._saveDirs(dirs)
    }

    floatDir(dir) {
        let dirs = this._loadDirs()
        if (!_.find(dirs, {dir: dir})) {
            return
        }
        let floatDir = _.remove(dirs, function(item) {
            return item.dir == dir
        })
        _.sortBy(dirs, ['dir'])
        dirs.unshift(floatDir[0])
        this._saveDirs(dirs)
    }

    cleanDirs() {
        this._saveDirs([])
    }
}

module.exports = new DirList()
