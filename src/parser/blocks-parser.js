import OrderedObject from '../ordered-object';
import Common from './common';
import { Parsers, Parser } from './index';
import { lastItem } from '../helpers';

let builtin = new OrderedObject();

/**
 * USE TO TOKENIZE SRC INTO BLOCK TOKENS
 */
export class BlocksParser extends Parsers {
    constructor(...args) {
        super(...args);
        this._defaultParser = Paragraph;
    }
    /**
     * Prepare Each Token and Tokenize children
     */
    _postParse(token) {
        if (typeof token !== "object") return token;
        if (token.children !== undefined) {
            if (token.children.constructor !== Array)
                token.children = [token.children]
            token.children = token.children.map(children => this._postParse(children), this);
        }
        return token;
    }
    parseOne(lines) {
        let token = false;
        let { parser, match } = this.findParser(lines);
        // do the tokenize job
        token =
            this._postParse(
                parser.parse(lines, match));
        return token;
    }
    /**
     * 
     * @param {string[]} lines 
     */
    parse(lines) {
        this._preParse();
        // if not yet split the string, split
        if (lines.constructor === String)
            lines = lines
                .trim()
                .replace(/\r\n|\r/g, '\n')
                .replace(/\t/g, '  ')
                .replace(/\u00a0/g, ' ')
                .replace(/\u2424/g, '\n')
                .split('\n');
        // loop until no line left
        let token, tokens = [];
        while (lines.length) {
            token = this.parseOne(lines);
            if (token !== false)
                tokens.push(token);
        }
        return tokens;
    }
}
BlocksParser.builtin = builtin;

/**
 * BLOCK TOKENIZER BUILDER
 * extend this class to construct a block parser
 */
export class BlockParser extends Parser {
    /**
     * Override this method to test
     * @param {string[]} lines 
     * @return - anything is true, call parse() and put it as second param
     */
    test(lines) {
        return RegExp(this.constructor.regex).exec(lines[0]);
    }
    /**
     * 
     * @param {string[]} lines 
     * @param {*} match - what return from test()
     * @return - { tag: string } or false
     */
    parse(lines, match) {
        throw new Error("override this method");
    }
}

/// BUILTIN ///

class Paragraph extends BlockParser {
    test = () => true;
    parse(lines) {
        let children = [lines.shift()];
        let parser;
        while (lines.length && ({ parser } = this.findParser(lines)) && parser.constructor === this.constructor)
            if (lines[0].endsWith("  "))
                children.push('\n', lines.shift());
            else
                children.push(` ${lines.shift()}`);
        return {
            tag: "p",
            children
        };
    }
}



class Heading extends BlockParser {
    parse(lines, match) {
        lines.shift();
        return {
            tag: `h${match[1].length}`,
            children: match[2]
        }
    }
}
Heading.regex = /^(#{1,6}) *([^\n]+)/;
builtin.add("heading", Heading);

class Heading12 extends BlockParser {
    test(lines) {
        if (lines.length >= 2)
            return /^(-|=)\1*$/.exec(lines[1]);
        return false;
    }
    parse(lines, match) {
        let children = lines.shift();
        lines.shift();
        return {
            tag: `h${match[1] === "=" ? 1 : 2}`,
            children
        }
    }
}
builtin.add("heading12", Heading12);

class Hr extends BlockParser {
    parse(lines, match) {
        lines.shift();
        return {
            tag: 'hr'
        }
    }
}
Hr.regex = /^([-*_]){3,}$/;
builtin.add("hr", Hr);

class List extends BlockParser {
    _depth(match, preDepth = 0) {
        let depth = Math.floor(match[1].length / 2) - preDepth;
        if (depth < 0)
            depth = 0;
        return depth;
    }
    _type(match) {
        return isNaN(+match[2][0]) ? 'ul' : 'ol';
    }
    _li(match) {
        return {
            tag: 'li',
            children: [match[3]]
        }
    }
    _wli(tag, depth) {
        return {
            tag: tag,
            children: [],
            depth
        }
    }
    _append(parent, child) {
        parent.children.push(child);
        child.parent = parent
    }
    _findSameDepth(wli, depth) {
        if (depth > wli.depth)
            return null;
        let curWli = wli;
        while (curWli.depth !== depth)
            curWli = curWli.parent.parent;
        return curWli;
    }
    _removeUnnec(el) {
        delete el.parent;
        delete el.depth;
        if (el.children)
            for (let child of el.children)
                this._removeUnnec(child);
    }
    parse(lines, match) {
        lines.shift();
        let type = this._type(match);
        let preDepth = this._depth(match);
        let root = this._wli(type, this._depth(match, preDepth));
        if (type === "ol")
            root.start = +match[2]
        let li = this._li(match);
        this._append(root, li);
        let prevWli = root,
            wli, findWli, depth;
        // eslint-disable-next-line
        while (match = this.test(lines) || (lines.length && lines[0].startsWith("  ") && (match = true))) {
            // line break;
            if (match === true) {
                lastItem(prevWli.children).children[0] += lines.shift().slice(1);
                continue;
            }
            // prepare
            type = this._type(match);
            depth = this._depth(match, preDepth);
            // diffirent type at root
            if (depth === 0 && type !== root.tag)
                break;
            // li & wli
            li = this._li(match);
            findWli = this._findSameDepth(prevWli, depth);
            // if greater depth
            if (findWli === null) {
                wli = this._wli(type, depth);
                this._append(wli, li);
                this._append(lastItem(prevWli.children), wli);
            }
            // found wli
            else {
                // same type
                if (findWli.tag === type)
                    this._append(findWli, li);
                // different type
                else {
                    wli = this._wli(type, depth);
                    this._append(wli, li);
                    this._append(findWli.parent, wli);
                }
            }
            prevWli = li.parent;
            lines.shift();
        }
        this._removeUnnec(root);
        return root;
    }
}
List.regex = /^(\s*)([-*+]|\d+\.) (.*)/;
builtin.add("li", List);

class FenceCode extends BlockParser {
    parse(lines, match) {
        lines.shift();
        let codes = [];
        while (lines.length) {
            if (!lines[0].startsWith("```"))
                codes.push(lines.shift());
            else {
                lines.shift();
                break;
            }
        }
        return {
            tag: 'block_code',
            children: codes.join('\n'),
            language: match[1]
        }
    }
}
FenceCode.regex = /^``` *(.*)/;
builtin.add("fence_code", FenceCode);

class IndentCode extends BlockParser {
    parse(lines, match) {
        let codes = [];
        do {
            lines.shift();
            codes.push(match[1]);
        } while (lines.length && (match = this.test(lines)));
        return {
            tag: 'block_code',
            text: codes.join('\n')
        }
    }
}
IndentCode.regex = /^ {4}(.*)/;
builtin.add("indent_code", IndentCode);

class BlockQuote extends BlockParser {
    parse(lines, match) {
        let all = [];
        do {
            lines.shift();
            all.push(match[1]);
        } while (lines.length && (match = this.test(lines)));
        return {
            tag: "blockquote",
            children: this.mainParser.parse(all)
        }
    }
}
BlockQuote.regex = /^> *(.*)/;
builtin.add("blockquote", BlockQuote);

class Reference extends BlockParser {
    parse(lines, match) {
        lines.shift();
        this.data.ref[match[1]] = {
            href: match[2],
            title: match[3]
        }
        return this.empty;
    }
}
Reference.regex = `^\\[(.+?)\\]: *${Common.link}$`;
builtin.add("reference", Reference);

class Table extends BlockParser {
    constructor(...a) {
        super(...a);
        this.dataRegex = /(?<!\\)\|.+?(?=(?<!\\)\|)/g;
        this.alignRegex = '\\| *:? *[-]+ *:? *';
    }
    _addVerticalLine(string) {
        if (!string.startsWith("|"))
            string = `| ${string}`;
        if (!string.endsWith("|") && !string.endsWith("\\|"))
            string += "|";
        return string;
    }
    test(lines) {
        if (lines.length < 2)
            return false;
        let line0 = this._addVerticalLine(lines[0]);
        let line1 = this._addVerticalLine(lines[1]);
        if (RegExp(`^(${this.alignRegex})+\\|?$`).exec(line1)) {
            let heads = line0.match(this.dataRegex);
            let aligns = line1.match(RegExp(this.alignRegex, 'g'));
            if (heads.length === aligns.length)
                return { heads, aligns, length: heads.length };
        }
        return false;
    }
    _genRow(data, aligns, isBody) {
        return data.map(row => ({
            tag: "tr",
            children: row.map((col, id) => ({
                tag: isBody ? "td" : "th",
                align: aligns[id],
                children: col
            }))
        }));
    }
    parse(lines, { heads, aligns, length }) {
        lines.shift();
        lines.shift();
        heads = heads.map(one => one.substr(1).trim());
        aligns = aligns.map(one => {
            let inn = one.substr(1).trim();
            let left = inn.startsWith(":");
            let right = inn.endsWith(":");
            if (left && right) return "center";
            else if (left) return "left";
            else if (right) return "right";
            else return "";
        })
        let data = [];
        let matches;
        while (lines.length && (matches = this._addVerticalLine(lines[0]).match(this.dataRegex)) && matches.length === length) {
            lines.shift();
            matches = matches.map(one => one.substr(1).trim()).slice(0, heads.length);
            data.push(matches);
        }
        return {
            tag: "table",
            children: [
                {
                    tag: "thead",
                    children: this._genRow([heads], aligns, false)
                },
                {
                    tag: "tbody",
                    children: this._genRow(data, aligns, true)
                }
            ]
        }
    }
}
Table.specialChar = "|";
builtin.add("table", Table);