import HTMLRenderer from './html-renderer';
import ReactRenderer from './react-renderer';
import { BlocksParser, BlockParser } from './parser/blocks-parser';
import { InlinesParser, InlineParser } from './parser/inlines-parser';
import { removeDuplicate, lastItem } from './helpers';
import { gatherText } from './react-renderer/helper';

export default class MarkdownUp {
    constructor(renderer) {
        this.specialChar = [];
        this.data = {};
        this.blocksParser = new BlocksParser(this.specialChar, this.data);
        this.inlinesParser = new InlinesParser(this.specialChar, this.data);
        this.renderer = new renderer();
        this.blockParsers = this.blocksParser.parsers;
        this.inlineParsers = this.inlinesParser.parsers;
        this.renderers = this.renderer.renderers;
    }
    parse(src) {
        let tokens = this.blocksParser.parse(src);
        return this.inlinesParser.parse(tokens);
    }
    render(src) {
        if (src.constructor === String)
            return this.renderer.render(this.parse(src));
        else
            return this.renderer.render(src);
    }
}

export {
    BlocksParser,
    InlinesParser,
    BlockParser,
    InlineParser,
    gatherText,
    removeDuplicate,
    lastItem,
    MarkdownUp,
    HTMLRenderer,
    ReactRenderer
}