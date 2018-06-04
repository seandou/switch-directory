# sd

Easy directory navigation tool

## Install

Install switch-directory

```
npm install -g switch-directory
```



Add the function to .bashrc

```
function sd() {
  source sd-functions
  sdir $@
}
```



## Usage

```
  Usage: sdir [options] [args]

  Options:

    -V, --version  output the version number
    -h, --help     output usage information

  Commands:

    add|a [dir]    add dir to list
    list|l         show all dirs
    remove|rm      remove item from dirs
    pre|-          switch to previous dir
    clean|c        clean the list
```



## TODO

- autocompletion

