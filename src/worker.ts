import * as monaco from 'monaco-editor';
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";

(globalThis as any)["MonacoEnvironment"] = {
  getWorker(_: any, label: string) {
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    return new editorWorker();
  },
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
