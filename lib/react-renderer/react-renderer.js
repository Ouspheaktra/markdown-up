const React = require('react');

let builtin;

export default class ReactRenderer {
    constructor() {
        this.renderers = builtin;
    }
    render(tokens, isChildren = false) {
        let all = tokens.map(token => {
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
        if (isChildren === true)
            return all;
        let ref = React.createRef()
        let el = React.createElement("div", { ref: ref }, ...all);
        return el;
    }
}

export const gatherText = (children) => {
    let text = "";
    if (children.constructor !== Array)
        children = [children];
    children.forEach(child => {
        if (typeof child === "string")
            text += child;
        else
            text += gatherText(child.props.children);
    })
    return text;
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