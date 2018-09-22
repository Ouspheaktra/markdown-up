import { BlocksParser } from './parser/blocks-parser';
import { InlinesParser } from './parser/inlines-parser';

export default class MarkdownUp {
    constructor(renderer) {
        this.specialChar = [];
        this.data = {};
        this.blocksParser = new BlocksParser(this.specialChar, this.data);
        this.inlinesParser = new InlinesParser(this.specialChar, this.data);
        this.renderer = new renderer();
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