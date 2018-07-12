const fs = require('fs')
const path = require('path')
const os = require('os')
const _ = require('lodash')

class Sdir {
    constructor() {
        this.configFile = path.join(os.homedir(), '.sdir')
        if (!fs.existsSync(this.configFile)) {
            this._flushConfig()
        } else {
            this._loadConfig()
        }
    }

    _flushConfig() {
        this.config = {
            curDir: os.homedir(),
            dirs: []
        }
        this._syncConfig()
    }

    _syncConfig() {
        fs.writeFileSync(this.configFile, JSON.stringify(this.config))
    }

    _loadConfig() {
        let data = fs.readFileSync(this.configFile, 'utf8')
        this.config = JSON.parse(data)
    }


    _loadDirs() {
        return this.config['dirs']
    }

    _saveDirs(dirs) {
        this.config['dirs'] = dirs
        this._syncConfig()
    }

    getDirs() {
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
        dirs.forEach(function(item) {
            console.log('- ' + item.dir)
        })
    }

    addDir(dir) {
        let dirs = this._loadDirs()
        if (!fs.lstatSync(dir).isDirectory()) {
            return false
        }

        if (_.find(dirs, {dir: dir})) {
            return false
        }

        dirs.unshift({dir: dir})
        this._saveDirs(dirs)
    }

    currentDir() {
        let dir = this.config['curDir']
        if (!dir) {
            dir = os.homedir()
        }
        return dir
    }

    saveCurrentDir(dir) {
        this.config['curDir'] = dir
        this._syncConfig()
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

        this.config['dirs'] = dirs
    }

    cleanDirs() {
        this._saveDirs([])
    }

    filterDirsByKeywords(keyword, from) {
        let dirs = []
        let fDirs = []

        if (from == undefined) {
            dirs = this._loadDirs()
        } else {
            from.split(['|']).forEach(function(item) {
                let s = item.split([':'])
                let dir = s[0]
                let maxdepth = s[1]

                // TODO: find dirs by from pattern
            })            
        }

        if (keyword == undefined) {
            return _.map(dirs, 'dir')
        }

        dirs.forEach(function(item) {
            if (_.startsWith(path.basename(item.dir), keyword)) {
                fDirs.push(item.dir)
            }
        })

        return fDirs
    }
}

module.exports = new Sdir()
