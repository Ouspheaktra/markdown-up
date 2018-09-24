import Renderer from '.';
import React from 'react';
import { gatherText } from './helpers';

export default class ReactRenderer extends Renderer {
    renderDefault(token, children) {
        let props = {};
        Object.entries(token).forEach(([attr, val]) => {
            if (attr === "tag" || attr === "children" || val === undefined)
                return true;
            props[attr] = val;
        });
        return React.createElement(token.tag, props, ...children);
    }
}

const hN = (token, children) => React.createElement(token.tag, { id: gatherText(children) }, ...children);

ReactRenderer.builtin = {
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