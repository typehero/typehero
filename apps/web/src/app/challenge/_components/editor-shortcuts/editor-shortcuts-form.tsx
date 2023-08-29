'use client';

interface Props {
  title: string;
  description: React.ReactNode;
}
function EditorShortcut(props: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <h1>{props.title}</h1>
      <>{props.description}</>
    </div>
  );
}

export function EditorShortcuts() {
  return (
    <div>
      <EditorShortcut
        title="Run Code"
        description={
          <p>
            <kbd>Ctrl</kbd> + <kbd>'</kbd>
          </p>
        }
      />
      <EditorShortcut
        title="Submit"
        description={
          <p>
            <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
          </p>
        }
      />
      <EditorShortcut
        title="Debug Code"
        description={
          <p>
            <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>'</kbd>
          </p>
        }
      />
      <EditorShortcut
        title="To indent one level"
        description={
          <p>
            <kbd>Tab</kbd> + <kbd>Ctrl</kbd>
          </p>
        }
      />
      <EditorShortcut
        title="To indent one fewer levels"
        description={
          <p>
            <kbd>Shift</kbd> + <kbd>Tab</kbd>
          </p>
        }
      />
      <EditorShortcut
        title="To move lines up/down"
        description={
          <p>
            <kbd>Alt</kbd> + <kbd>Up/Down</kbd>
          </p>
        }
      />
      <EditorShortcut
        title="Delete line and copy to buffer"
        description={
          <p>
            <kbd>Ctrl</kbd> + <kbd>X</kbd>
          </p>
        }
      />
      <EditorShortcut
        title="Comment/uncomment current selection"
        description={
          <p>
            <kbd>Ctrl</kbd> + <kbd>/</kbd>
          </p>
        }
      />
      <EditorShortcut
        title="Undo action"
        description={
          <p>
            <kbd>Ctrl</kbd> + <kbd>Z</kbd>
          </p>
        }
      />
      <EditorShortcut
        title="Redo action"
        description={
          <p>
            <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>
          </p>
        }
      />
    </div>
  );
}
