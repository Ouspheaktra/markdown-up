export default class Renderer {
    constructor(data) {
        this.renderers = { ...this.constructor.builtin };
        this.data = data;
    }
    renderDefault(token, children) {
        throw Error("override this method");
    }
    render(tokens) {
        return tokens.map(token => {
            let el;
            let children = [];
            if (token.children && token.children.length)
                children = this.render(token.children)
            if (token.tag in this.renderers)
                el = this.renderers[token.tag](token, children, this.data);
            else
                el = this.renderDefault(token, children);
            return el;
        })
    }
}