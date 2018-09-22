import { MarkdownUp, HTMLRenderer } from '../../index';

function readTextFile(file, success) {
    var reader = new FileReader();
    reader.onload = e => success(e.target.result);
    reader.readAsText(file);
}

const mdu = new MarkdownUp(HTMLRenderer);

document.getElementById("file").onchange = (e) => {
    readTextFile(e.target.files[0], md => {
        let tokens = mdu.parse(md);
        let rendered = mdu.render(tokens);
        document.body.append(...rendered);
    });
}
