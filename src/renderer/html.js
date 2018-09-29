import Renderer from '.';

export default class HTMLRenderer extends Renderer {
    renderDefault = (token) => {
        let el = document.createElement(token.tag);
        Object.entries(token).forEach(([attr, val]) => {
            if (attr === "tag" || attr === "children" || val === undefined)
                return true;
            el.setAttribute(attr, val);
        });
        el.append(...this.renderChildren(token));
        return el;
    }
}

const hN = (token, { renderChildren }) => {
    let el = document.createElement(token.tag);
    el.append(...renderChildren(token));
    el.id = el.innerText;
    return el;
}

HTMLRenderer.builtin = {
    empty: () => "",
    text: token => token.text,
    h1: hN,
    h2: hN,
    h3: hN,
    h4: hN,
    h5: hN,
    h6: hN,
    block_code: (token, { renderChildren }) => {
        let pre = document.createElement("pre");
        let code = document.createElement("code");
        pre.append(code);
        code.append(...renderChildren(token));
        if (token.language)
            code.className = `language-${token.language}`;
        return pre;
    }
}