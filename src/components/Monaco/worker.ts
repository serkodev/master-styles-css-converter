import type * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'

declare global {
  interface Window { MonacoEnvironment: monaco.Environment }
}

self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string): Worker {
    if (label === 'css' || label === 'scss' || label === 'less')
      return new CssWorker()

    return new EditorWorker()
  },
}
