import type * as MonacoEditor from 'monaco-editor';

export function getEventDeltas(e: MouseEvent | TouchEvent, origin: { x: number; y: number }) {
  if (e instanceof MouseEvent) {
    return {
      dx: e.clientX - origin.x,
      dy: e.clientY - origin.y,
      currPosX: e.clientX,
      currPosY: e.clientY,
    };
  }

  const touch = e.changedTouches[0];
  if (!touch) {
    return {
      dx: 0,
      dy: 0,
      currPosX: 0,
      currPosY: 0,
    };
  }

  return {
    dx: touch.clientX - origin.x,
    dy: touch.clientY - origin.y,
    currPosX: touch.clientX,
    currPosY: touch.clientY,
  };
}

export async function typeCheck(monaco: typeof MonacoEditor) {
  const models = monaco.editor.getModels();
  const getWorker = await monaco.languages.typescript.getTypeScriptWorker();

  for (const model of models) {
    const worker = await getWorker(model.uri);
    const diagnostics = (
      await Promise.all([
        worker.getSyntacticDiagnostics(model.uri.toString()),
        worker.getSemanticDiagnostics(model.uri.toString()),
      ])
    ).reduce((a, b) => a.concat(b));

    const markers = diagnostics.map((d) => {
      const start = model.getPositionAt(d.start!);
      const end = model.getPositionAt(d.start! + d.length!);

      return {
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: start.lineNumber,
        endLineNumber: end.lineNumber,
        startColumn: start.column,
        endColumn: end.column,
        message: d.messageText as string,
      } satisfies MonacoEditor.editor.IMarkerData;
    });

    monaco.editor.setModelMarkers(model, model.getLanguageId(), markers);
  }
}
