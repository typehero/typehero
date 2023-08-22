declare module "monaco-vim" {
	import type * as monaco from "monaco-editor";

	export function initVimMode(
		editor: monaco.editor.IStandaloneCodeEditor,
		statusbarNode?: Element | null,
	): VimMode;
	
	class VimMode {
		/** removes the attached vim bindings */
		dispose(): void;
	}
}
