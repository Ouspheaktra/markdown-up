import MarkdownUp from './src/markdown-up';
import HTMLRenderer from './src/html-renderer/html-renderer';
import ReactRenderer from './src/react-renderer/react-renderer';
import { BlockParser } from './src/parser/blocks-parser';
import { InlineParser } from './src/parser/inlines-parser';
import { removeDuplicate, lastItem } from './src/helpers';
import { gatherText } from './src/react-renderer/helper';

class MarkdownUpHTML extends MarkdownUp {
    constructor() {
        super(HTMLRenderer);
    }
}

class MarkdownUpReact extends MarkdownUp {
    constructor() {
        super(ReactRenderer);
    }
}

export {
    BlockParser,
    InlineParser,
    gatherText,
    removeDuplicate,
    lastItem,
    MarkdownUp,
    MarkdownUpHTML,
    MarkdownUpReact
}