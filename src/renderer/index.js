export default class Renderer {
    constructor(data) {
        this.renderers = { ...this.constructor.builtin };
        this.data = data;
    }
    renderDefault = (token) => {
        throw Error("override this method");
    }
    renderChildren = (token) => {
        if (token.children && token.children.length)
            return this.render(token.children)
        return [];
    }
    render = (tokens) => {
        return tokens.map(token => {
            if (token.tag in this.renderers)
                return this.renderers[token.tag]({ ...token }, this);
            else
                return this.renderDefault({ ...token });
        })
    }
}