const React = require('react');
const { gatherText } = require('./helper');

let builtin;

export default class ReactRenderer {
    constructor() {
        this.renderers = builtin;
    }
    render(tokens, isChildren = false) {
        return tokens.map(token => {
            let el;
            let children = [];
            if (token.children && token.children.length)
                children = this.render(token.children, true)
            if (token.tag in this.renderers) {
                el = this.renderers[token.tag](token, children);
            } else {
                let props = {};
                Object.entries(token).forEach(([attr, val]) => {
                    if (attr === "tag" || attr === "children" || val === undefined)
                        return true;
                    props[attr] = val;
                });
                el = React.createElement(token.tag, props, ...children);
            }
            return el;
        })
    }
}

const hN = (token, children) => {
    return React.createElement(token.tag, { id: gatherText(children) }, ...children);
}

builtin = {
    empty: () => "",
    text: token => token.text,
    h1: hN,
    h2: hN,
    h3: hN,
    h4: hN,
    h5: hN,
    h6: hN,
    block_code: (token, children) => {
        return React.createElement(
            "pre",
            null,
            React.createElement(
                "code",
                { className: token.language ? `language-${token.language}` : "" },
                ...children
            )
        );
    }
}