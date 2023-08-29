import { VimMode } from 'monaco-vim';

// TODO: Store this in the setting store and allow users to modify it
export const defaultVimConfig = `
" - this is a comment
" - nmap == normal map
" - \`:M\` is an ex command to run a monaco action
nmap K  :M<Space>editor.action.showHover
nmap gd :M<Space>editor.action.goToDeclaration
nmap gr :M<Space>editor.action.goToReferences
nmap gi :M<Space>editor.action.goToImplementation
nmap gx :M<Space>editor.action.openLink
nmap ]d :M<Space>editor.action.marker.next
nmap [d :M<Space>editor.action.marker.prev
`;

export function sourceVimCommands(cma: VimMode, vimCommands: string) {
  VimMode.Vim.mapclear();

  VimMode.Vim.maybeInitVimState_(cma);

  for (const line of vimCommands.split('\n')) {
    // skip comments
    if (line.startsWith('"')) continue;

    const trimmed = line.trim();

    // skip empty lines
    if (!trimmed) continue;

    VimMode.Vim.handleEx(cma, trimmed);
  }
}
