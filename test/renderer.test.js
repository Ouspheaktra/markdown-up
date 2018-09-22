const fs = require('fs-extra');
const { MarkdownUpHTML, MarkdownUpReact } = require('../index');

describe('html renderer', () => {
    const mdu = new MarkdownUpHTML();
    test('no error', done =>
        fs.readFile(__dirname + '/text.md', "utf8")
            .then(md => {
                expect(() => mdu.render(md)).not.toThrow();
                done();
            })
    )
})

describe('react renderer', () => {
    const mdu = new MarkdownUpReact();
    test('no error', done =>
        fs.readFile(__dirname + '/text.md', "utf8")
            .then(md => {
                expect(() => mdu.render(md)).not.toThrow();
                done();
            })
    )
})