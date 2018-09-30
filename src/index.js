import HTMLRenderer from './renderer/html';
import ReactRenderer from './renderer/react';
import { BlocksParser, BlockParser } from './parser/blocks-parser';
import { InlinesParser, InlineParser } from './parser/inlines-parser';
import * as mainHelpers from './helpers';
import * as rendererHelpers from './renderer/helpers';

export default class MarkdownUp {
    constructor(renderer) {
        this.specialChar = [];
        this.data = {};
        this.blocksParser = new BlocksParser(this.data, this.specialChar);
        this.inlinesParser = new InlinesParser(this.data, this.specialChar);
        this.renderer = new renderer(this.data);
        this.blockParsers = this.blocksParser.parsers;
        this.inlineParsers = this.inlinesParser.parsers;
        this.renderers = this.renderer.renderers;
    }
    parse(src, data={}) {
		mainHelpers.clearObject(this.data);
		Object.assign(this.data, data);
		this.data.ref = {};
        let tokens = this.blocksParser.parse(src);
        return this.inlinesParser.parse(tokens);
    }
    render(src, data) {
        return this.renderer.render(this.parse(src, data));
    }
}

const helpers = { ...mainHelpers, ...rendererHelpers };

export {
    BlocksParser,
    InlinesParser,
    BlockParser,
    InlineParser,
    MarkdownUp,
    HTMLRenderer,
    ReactRenderer,
    helpers
}