import OrderedObject from '../ordered-object';

export class Parsers {
    constructor(specialChar = [], data = {}) {
        this.specialChar = specialChar;
        this.parsers = this.constructor.builtin.clone();
        this._defaultParser = Parser;
        this._emptyParser = Empty;
        this._parsersIns = new OrderedObject();
        this.data = data;
        if (!data.ref)
            data.ref = {};
    }
    _preParse() {
        if (JSON.stringify(["empty", ...this.parsers.keys(), "default"]) === JSON.stringify(this._parsersIns.keys()))
            return;
        this._parsersIns = new OrderedObject();
        for (let [key, val] of [["empty", this._emptyParser], ...this.parsers.entries(), ["default", this._defaultParser]])
            this._parsersIns.add(key, new val(this));
    }
    findParser(lines) {
        let match, parser;
        // test each parser
        for (parser of this._parsersIns.values())
            // eslint-disable-next-line
            if (match = parser.test(lines))
                break;
        return { parser, match };
    }
    parse(input) {
        throw Error("override this method");
    }
}

export class Parser {
    constructor(mainParser) {
        this.mainParser = mainParser;
        this.data = mainParser.data;
        this.empty = mainParser._emptyParser.token;
        this.findParser = mainParser.findParser.bind(mainParser);
        let specialChar = this.constructor.specialChar;
        if (specialChar) {
            if (specialChar.constructor !== Array)
                specialChar = [specialChar];
            this.mainParser.specialChar.push(...specialChar);
        }
    }
    test(input) {
        throw Error("override this method");
    }
    parse(input) {
        throw new Error("override this method");
    }
}

class Empty extends Parser {
    test(input) {
        return (input.constructor === Array ? input[0] : input) === "";
    }
    parse(lines) {
        lines.shift();
        return this.constructor.token;
    }
}
Empty.token = { tag: 'empty' }