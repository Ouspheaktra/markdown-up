import Renderer from '.';

export default class HTMLRenderer extends Renderer {
    renderDefault(token, children) {
        let el = document.createElement(token.tag);
        Object.entries(token).forEach(([attr, val]) => {
            if (attr === "tag" || attr === "children" || val === undefined)
                return true;
            el.setAttribute(attr, val);
        });
        el.append(...children);
        return el;
    }
}

const hN = (token, children) => {
    let el = document.createElement(token.tag);
    el.append(...children);
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
    block_code: (token, children) => {
        let pre = document.createElement("pre");
        let code = document.createElement("code");
        pre.append(code);
        code.append(...children);
        if (token.language)
            code.className = `language-${token.language}`;
        return pre;
    }
}

module.exports = HTMLRenderer;