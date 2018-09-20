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