const fs = require('fs-extra');
const MarkdownUp = require('../src/markdown-up').default;

describe('html renderer', () => {
    const mdu = new MarkdownUp('html');
    test('no error', done =>
        fs.readFile(__dirname + '/text.md', "utf8")
            .then(md => {
                expect(() => mdu.render(md)).not.toThrow();
                done();
            })
    )
})

describe('react renderer', () => {
    const mdu = new MarkdownUp('react');
    test('no error', done =>
        fs.readFile(__dirname + '/text.md', "utf8")
            .then(md => {
                expect(() => mdu.render(md)).not.toThrow();
                done();
            })
    )
})