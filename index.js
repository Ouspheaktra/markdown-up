import MarkdownUp from './src/markdown-up';
import { BlockParser } from './src/parser/blocks-parser';
import { InlineParser } from './src/parser/inlines-parser';
import { removeDuplicate, lastItem } from './src/helpers';
import { gatherText } from './src/react-renderer/helper';

export default MarkdownUp;
export {
    BlockParser,
    InlineParser,
    gatherText,
    removeDuplicate,
    lastItem
}