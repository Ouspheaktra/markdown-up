import React from 'react';

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

export const createElement = (tag) => (token, children, data) => {
    let props = { ...token, data };
    delete props.children;
    delete props.tag;
    return React.createElement(tag, props, ...children);
}