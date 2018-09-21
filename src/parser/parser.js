import OrderedObject from '../ordered-object';

export class Parsers {
    constructor(specialChar=[], data={}) {
        this.specialChar = specialChar;
        this.parsers = this.constructor.builtin.clone();
        this._defaultParser = Parser;
        this._parsersIns = new OrderedObject();
        this.data = data;
    }
    _preParse() {
        if (JSON.stringify([...this.parsers.keys(), "default"]) === JSON.stringify(this._parsersIns.keys()))
            return;
        this._parsersIns = new OrderedObject();
        for (let [key, val] of [...this.parsers.entries(), ["default", this._defaultParser]])
            this._parsersIns.add(key, new val(this));
    }
    parse(input) {
        throw Error("override this method");
    }
}

export class Parser {
    constructor(mainParser) {
        this.mainParser = mainParser;
        this.data = mainParser.data;
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