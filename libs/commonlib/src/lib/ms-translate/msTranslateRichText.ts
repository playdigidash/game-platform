import { getTranslation } from "./get-ms-translate";

// * translate function for rich text

export async function msTranslateRichText(detail: string, language: string) {
  const parsed = JSON.parse(detail);

  async function traverseNodes(obj: any) {
    if (
      Object.prototype.hasOwnProperty.call(obj, 'children') &&
      Array.isArray(obj.children)
    ) {
      await Promise.all(
        obj.children.map((child: any) => traverseNodes(child))
      );
    } else {
      if (Object.prototype.hasOwnProperty.call(obj, 'text')) {
        const translated = await getTranslation(obj.text, language);
        obj.text = translated;
      }
    }
  }

  await traverseNodes(parsed.root);
  return JSON.stringify(parsed);
}