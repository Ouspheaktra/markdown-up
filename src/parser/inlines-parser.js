import OrderedObject from '../ordered-object';
import Common from './common';
import { Parsers, Parser } from './parser';
import { removeDuplicate } from "../helpers";

let builtin = new OrderedObject();

/**
 * USE TO TOKENIZE SRC INTO INLINE TOKENS
 */
export class InlinesParser extends Parsers {
    constructor(...args) {
        super(...args);
        this._textParser = new Text(this);
    }
    _postParse(match, text, token) {
        let toInsert = [];
        if (token.tag === "text") {
            toInsert.push(token);
        } else {
            if (token.text) {
                token.children = this.text(token.text);
                delete token.text;
            }
            // prepare token
            if (token.children && token.children.constructor !== Array)
                token.children = [token.children];
            // prepare what to insert into children
            let start = text.substr(0, match.index);
            let end = text.substr(match.index + match[0].length);
            if (start !== "")
                toInsert.push(start);
            toInsert.push(token);
            if (end !== "")
                toInsert.push(end);
        }
        return toInsert;
    }
    /**
     * 
     * @param {string[]} tokens 
     */
    parse(tokens) {
        this._preParse();
        let parser, match, toInsert, text, token;
        for (let i = 0; i < tokens.length; i++) {
            text = tokens[i];
            // if it is Object
            // it means it's tokenized            
            if (text.constructor === Object) {
                if (text.tag !== "text" && text.children)
                    this.parse(text.children);
                continue;
            }
            // loop to test each parser
            for (parser of this._parsersIns.values())
                // eslint-disable-next-line
                if (match = parser.test(text))
                    break;
            // if all test failed, use text parser
            if (!match)
                parser = this._textParser;

            token = parser.parse(match, text);
            toInsert = this._postParse(match, text, token);
            // insert parts into children
            tokens.splice(i, 1, ...toInsert);
            // if first one is string
            // it means that string will be placed in current index
            // so substract one, otherwise that string won't be tokenized
            if (toInsert[0].constructor === String)
                i--;
            // tokenize children text
            if (token.tag !== "text" && token.children)
                this.parse(token.children);
        }
        return tokens;
    }
}
InlinesParser.builtin = builtin;

/**
 * INLINE TOKENIZER BUILDER
 * extend this class to construct a inline parser
 */
export class InlineParser extends Parser {
    constructor(...args) {
        super(...args);
        this.text = text => this.mainParser._textParser.parse(null, text);
    }
    /**
     * Override this method to test
     * @param {string} text 
     * @return - anything is true, call parse() and put it as second param
     */
    test(text) {
        try {
            return RegExp(this.constructor.regex).exec(text);
        } catch (e) {
            throw Error("something wrong with this regex: " + this.constructor.regex);
        }
    }
    /**
     * 
     * @param {string[]} test 
     * @param {*} match - what return from test()
     */
    parse(match, test) {
        throw new Error("override this method");
    }
}

/// BUILTIN ///

class Text extends InlineParser {
    parse(match, text) {
        const chars = removeDuplicate(this.mainParser.specialChar).map(char => `\\${char}`).join("");
        return {
            tag: 'text',
            text: text.replace(RegExp(`\\\\([${chars}])`), '$1')
        }
    }
}

class Strong extends InlineParser {
    test(text) {
        return this.constructor.regex.exec(text) || this.constructor.regex2.exec(text);
    }
    parse(match) {
        return {
            tag: 'strong',
            children: match[2]
        };
    }
}
Strong.regex = /(?<!\*.*)(?<!\\)(\*)\1(.+?)\1\1(?!.*\1)/;
Strong.regex2 = /(?<!_)(?<!\\)(_)\1(.+?)\1\1(?!\1)/;
Strong.specialChar = ["*", "_"]
builtin.add("strong", Strong);

class Emphasize extends InlineParser {
    parse(match) {
        return {
            tag: 'em',
            children: match[2]
        };
    }
}
Emphasize.regex = /(?<!\\)(\*|_)(.+?)\1/;
builtin.add("emphasize", Emphasize);

class NewLine extends InlineParser {
    parse() {
        return {
            tag: 'br'
        };
    }
}
NewLine.regex = /^\n$/;
builtin.add("new_line", NewLine);

class StrikeThrough extends InlineParser {
    parse(match) {
        return {
            tag: 'del',
            children: match[1]
        };
    }
}
StrikeThrough.regex = /(?<!\\)~~(.+?)~~/;
StrikeThrough.specialChar = "~";
builtin.add("strike_through", StrikeThrough);

class InlineCode extends InlineParser {
    parse(match) {
        return {
            tag: 'code',
            children: this.text(match[1])
        };
    }
}
InlineCode.regex = /(?<!\\)`([^`\n]+?)`/;
InlineCode.specialChar = "`";
builtin.add("code", InlineCode);

/* LINK N IMAGE */

class Link extends InlineParser {
    parse(match) {
        let out = {
            tag: this.constructor.tag,
            [this.constructor.href]: match[2],
            title: match[3]
        }
        if (this.constructor.tag === 'a')
            out.children = match[1];
        return out;
    }
}
Link.tag = 'a';
Link.href = 'href';
Link.regex = `(?<!\\\\)\\[(.+?)\\]\\(${Common.link}\\)`;
Link.specialChar = "[";

class Image extends Link { }
Image.tag = 'img';
Image.href = 'src';
Image.regex = `(?<!\\\\)!${Link.regex}`;
Image.specialChar = "!";

class LinkRef extends InlineParser {
    parse(match) {
        let text = match[1];
        let refName = match[2];
        if (!refName) refName = text;
        refName = refName.toLowerCase();
        if (this.data.ref && refName in this.data.ref) {
            let data = this.data.ref[refName];
            let out = {
                tag: this.constructor.tag,
                alt: text,
                [this.constructor.href]: data.href,
                title: data.title,
            }
            if (this.constructor.tag === 'a')
                out.children = text;
            return out;
        }
        return this.text(match[0]);
    }
}
LinkRef.tag = Link.tag;
LinkRef.href = Link.href;
LinkRef.regex = '(?<!\\\\)\\[(.+?)\\](?:\\[(.+?)\\])?';

class ImageRef extends LinkRef { }
ImageRef.tag = Image.tag;
ImageRef.href = Image.href;
ImageRef.regex = `!${LinkRef.regex}`;

builtin.add("image", Image);
builtin.add("link", Link);

builtin.add("image_ref", ImageRef);
builtin.add("link_ref", LinkRef);

class AutoLink extends InlineParser {
    parse(match) {
        return {
            tag: 'a',
            href: match[1],
            children: this.text(match[1])
        };
    }
}
AutoLink.regex = '\\b(https?:\\/{2}\\S+)\\b';

class SurroundedAutoLink extends AutoLink { }
SurroundedAutoLink.regex = `(?<!\\\\)<${AutoLink.regex}>`;
SurroundedAutoLink.specialChar = "<";

builtin.add("surrounded_auto_link", SurroundedAutoLink);
builtin.add("auto_link", AutoLink);