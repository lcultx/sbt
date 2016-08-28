var path = require('path');
var BaseTools = (function () {
    function BaseTools(module_path) {
        this._module_path = module_path;
    }
    BaseTools.prototype.getModulePath = function () {
        return this._module_path;
    };
    BaseTools.prototype.getModuleName = function () {
        return path.basename(this.getModulePath());
    };
    BaseTools.prototype.getModuleNameByPath = function () {
        return path.basename(this.getModulePath());
    };
    BaseTools.prototype.getModuleNameByPackage = function () {
    };
    BaseTools.prototype.getModuleNameByModule = function () {
    };
    return BaseTools;
}());
exports.BaseTools = BaseTools;
//# sourceMappingURL=BaseTools.js.map