import React from 'react';

export const gatherText = (children) => {
    let text = "";
    if (children) {
        if (children.constructor !== Array)
            children = [children];
        children.forEach(child => {
            if (child.tag === "text")
                text += child.text;
            else
                text += gatherText(child.children);
        })
    }
    return text;
}

export const createElement = (tag) => (token, children, data) => {
    let props = { ...token, data };
    delete props.children;
    delete props.tag;
    return React.createElement(tag, props, ...children);
}