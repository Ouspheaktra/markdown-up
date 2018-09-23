describe('block parser', () => {
    const { BlocksParser } = require('../blocks-parser');
    const parser = new BlocksParser();

    test('heading', () => {
        const md = `# heading1
## heading2
###### heading6`;
        expect(JSON.stringify(parser.parse(md)))
            .toBe(JSON.stringify([
                { tag: "h1", children: ["heading1"] },
                { tag: "h2", children: ["heading2"] },
                { tag: "h6", children: ["heading6"] }
            ]));
    })

    test('list', () => {
        const md = `* dot
* dot2
    1. hello
    2. world
    + yes
        2. nananan
        4. nonono
        - lalalala
    + no
    * what
    * hmm
* lalal`;
        expect(JSON.stringify(parser.parse(md)))
            .toBe(JSON.stringify([{ "tag": "ul", "children": [{ "tag": "li", "children": ["dot"] }, { "tag": "li", "children": ["dot2", { "tag": "ol", "children": [{ "tag": "li", "children": ["hello"] }, { "tag": "li", "children": ["world"] }] }, { "tag": "ul", "children": [{ "tag": "li", "children": ["yes", { "tag": "ol", "children": [{ "tag": "li", "children": ["nananan"] }, { "tag": "li", "children": ["nonono"] }] }, { "tag": "ul", "children": [{ "tag": "li", "children": ["lalalala"] }] }] }, { "tag": "li", "children": ["no"] }, { "tag": "li", "children": ["what"] }, { "tag": "li", "children": ["hmm"] }] }] }, { "tag": "li", "children": ["lalal"] }] }]));
    })
})



describe('inline parser', () => {
    const { InlinesParser } = require('../inlines-parser');
    const parser = new InlinesParser();

    test('em in strong', () => {
        const md = ["hello ***world*** everyone"];
        expect(JSON.stringify(parser.parse(md)))
            .toBe(JSON.stringify([{ "tag": "text", "text": "hello " }, { "tag": "strong", "children": [{ "tag": "em", "children": [{ "tag": "text", "text": "world" }] }] }, { "tag": "text", "text": " everyone" }]));
    })
})