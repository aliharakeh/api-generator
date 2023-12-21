// import\(["'](.*?)["']\) ==> matches import("/path/to/file")
// \. ==> matches exact `.` char
// (\w+(?:<[\w\[\]]+>)?) ==> matches any the imported item
const MODELS_REGEX = /import\(["'](.*?)["']\)\.(\w+(?:<[\w\[\]]+>)?)/g;

export class ImportPathParser {
    importMap = new Map<string, Set<string>>;
    model: string;

    constructor(public rootPath: string, public importPath: string) {
        if (importPath.startsWith('import')) {
            this.constructImportMap();
        }
        else {
            this.model = importPath;
        }
    }

    constructImportMap() {
        // extract all imports
        let matches = this.importPath.matchAll(MODELS_REGEX);
        const models = [];
        for (let match of matches) {
            // get full local import path and model name
            const [importPath, model] = match.slice(1, 3);
            // add model
            models.push(model);
            // update models map
            const importModels = this.importMap.get(importPath) || new Set();
            this.importMap.set(this.cleanLocalPath(importPath), importModels.add(model));
        }
        this.updateModel(models);
    }

    // clean path from any local parts
    cleanLocalPath(importPath: string) {
        return importPath.split(`/${this.rootPath}/`)[1];
    }

    // join all models to construct the full model
    updateModel(models: string[]) {
        this.model = models.reverse().reduce((acc, model, i) => {
            return i == 0 ? model : `${model}<${acc}>`;
        }, '');
    }
}
