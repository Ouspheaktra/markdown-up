import { BlocksParser } from './parser/blocks-parser';
import { InlinesParser } from './parser/inlines-parser';
import HTMLRenderer from "./html-renderer/html-renderer";
import ReactRenderer from "./react-renderer/react-renderer";

export default class MarkdownUp {
    constructor(renderer = "html") {
        this.specialChar = [];
        this.data = {};
        this.blocksParser = new BlocksParser(this.specialChar, this.data);
        this.inlinesParser = new InlinesParser(this.specialChar, this.data);
        if (renderer === "html")
            this.renderer = new HTMLRenderer();
        else
            this.renderer = new ReactRenderer();
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