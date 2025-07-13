import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { DecoratorNode } from 'lexical';

const HEIGHT = '315px';
const WIDTH = '100%';
const MAX_WIDTH = '560px';
const getYoutubeLink = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}`;
const ID_ATTR = 'data-lexical-youtube';

function convertYouTubeElement(
  domNode: HTMLElement
): null | DOMConversionOutput {
  const id = domNode?.getAttribute(ID_ATTR);
  if (!id) return null;
  const node = $createYouTubeNode(id);
  return { node };
}

export type SerializedYouTubeNode = Spread<
  {
    id: string;
    type: 'youtube';
    version: 1;
  },
  SerializedLexicalNode
>;

export class YouTubeNode extends DecoratorNode<JSX.Element> {
  __id: string;

  constructor(id: string, key?: NodeKey) {
    super(key);
    this.__id = id;
  }

  static override getType(): string {
    return 'youtube';
  }

  static override clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__id, node.__key);
  }

  override exportDOM(): DOMExportOutput {
    const iframe = document.createElement('iframe');
    iframe.setAttribute(ID_ATTR, this.__id);
    iframe.setAttribute('height', HEIGHT);
    iframe.setAttribute('width', WIDTH);
    iframe.setAttribute('max-width', MAX_WIDTH);
    iframe.setAttribute('src', getYoutubeLink(this.__id));
    return { element: iframe };
  }

  static override importDOM(): DOMConversionMap | null {
    return {
      iframe: (node: Node) => ({
        conversion: convertYouTubeElement,
        priority: 0,
      }),
    };
  }

  override createDOM(): HTMLElement {
    const div = document.createElement('div');
    return div;
  }

  override updateDOM(): false {
    return false;
  }

  override decorate(): JSX.Element {
    return (
      <iframe
        height={HEIGHT}
        width={WIDTH}
        style={{
          maxWidth: MAX_WIDTH,
        }}
        src={getYoutubeLink(this.__id)}
        allowFullScreen
      />
    );
  }

  static override importJSON(
    serializedNode: SerializedYouTubeNode
  ): YouTubeNode {
    const { id } = serializedNode;
    const node = $createYouTubeNode(id);
    return node;
  }

  override exportJSON(): SerializedYouTubeNode {
    return {
      id: this.__id,
      type: 'youtube',
      version: 1,
    };
  }
}

export function $createYouTubeNode(id: string): YouTubeNode {
  return new YouTubeNode(id);
}

export function $isYouTubeNode(
  node: LexicalNode | null | undefined
): node is YouTubeNode {
  return node instanceof YouTubeNode;
}
