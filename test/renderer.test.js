const fs = require('fs-extra');
const { MarkdownUp, HTMLRenderer, ReactRenderer } = require('../src');

describe('html renderer', () => {
    const mdu = new MarkdownUp(HTMLRenderer);
    test('no error', done =>
        fs.readFile(__dirname + '/text.md', "utf8")
            .then(md => {
                expect(() => mdu.render(md)).not.toThrow();
                done();
            })
    )
})

describe('react renderer', () => {
    const mdu = new MarkdownUp(ReactRenderer);
    test('no error', done =>
        fs.readFile(__dirname + '/text.md', "utf8")
            .then(md => {
                expect(() => mdu.render(md)).not.toThrow();
                done();
            })
    )
})