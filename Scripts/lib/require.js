// File Origin: https://github.com/cvknage/Automation-iOS-Scriptable/blob/master/Scripts/lib/require.js

/**
 * This script emulated the behaviout of the 'require' function for CommonJS modules.
 * 
 * DISCLAMER:
 * This is in NO way a full implementation of 'require'. Expect weird stuff to happen!
 * 
 * This implementation is heavily inspired on the works of:
 * sylumer @ https://talk.automators.fm/t/import-one-script-from-another/1374/3
 * JXA-Cookbook @ https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts#emulating-npms-require
 */
this.require = (libName) => {
    
    function Module(_libName) {
        const scriptableFilesPath = '/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/lib/';
        const libraryPath = `${scriptableFilesPath}${_libName}.js`;
        const fileManagerLocal = FileManager.local();

        let module = {exports: {}};
        let exports = module.exports;
        
        (function () {
            eval(fileManagerLocal.readString(libraryPath));
        }.call(exports));

        return module.exports;
    } 

    return new Module(libName);
}
