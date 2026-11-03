/**
 * Utility to download or copy SVG graphics (Birth Chart, Human Design BodyGraph,
 * Gene Keys Hologenetic Map, and Couple Blended Chart) as high-resolution PNG or pure SVG.
 */

export function getSvgElement(svgElementOrId: string | SVGSVGElement): SVGSVGElement | null {
  if (typeof svgElementOrId === "string") {
    const el = document.getElementById(svgElementOrId);
    if (!el) return null;
    if (el instanceof SVGSVGElement) return el;
    return el.querySelector("svg");
  }
  return svgElementOrId;
}

export function downloadSvgRaw(svgElementOrId: string | SVGSVGElement, filename: string) {
  const svg = getSvgElement(svgElementOrId);
  if (!svg) {
    console.error("SVG element not found for export:", svgElementOrId);
    return;
  }

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  // Add namespaces if not present
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".svg") ? filename : `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSvgAsPng(
  svgElementOrId: string | SVGSVGElement,
  filename: string,
  scale: number = 2
): Promise<void> {
  return new Promise((resolve, reject) => {
    const svg = getSvgElement(svgElementOrId);
    if (!svg) {
      reject(new Error("SVG element not found"));
      return;
    }

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const bbox = svg.viewBox.baseVal;
        const width = (bbox && bbox.width > 0 ? bbox.width : svg.clientWidth || 600) * scale;
        const height = (bbox && bbox.height > 0 ? bbox.height : svg.clientHeight || 600) * scale;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Canvas context could not be created"));
          return;
        }

        // Draw background matching deep cosmic theme
        ctx.fillStyle = "#060913";
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to create PNG blob"));
            return;
          }
          const pngUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(pngUrl);
          resolve();
        }, "image/png");
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };

    img.src = url;
  });
}

export async function copySvgToClipboard(
  svgElementOrId: string | SVGSVGElement,
  scale: number = 2
): Promise<boolean> {
  const svg = getSvgElement(svgElementOrId);
  if (!svg) return false;

  return new Promise((resolve) => {
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      try {
        const bbox = svg.viewBox.baseVal;
        const width = (bbox && bbox.width > 0 ? bbox.width : svg.clientWidth || 600) * scale;
        const height = (bbox && bbox.height > 0 ? bbox.height : svg.clientHeight || 600) * scale;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(false);
          return;
        }

        ctx.fillStyle = "#060913";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);

        canvas.toBlob(async (blob) => {
          if (!blob) {
            resolve(false);
            return;
          }

          if (navigator.clipboard && window.ClipboardItem) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
              ]);
              resolve(true);
            } catch (err) {
              console.warn("ClipboardItem write failed, fallbacking...", err);
              resolve(false);
            }
          } else {
            resolve(false);
          }
        }, "image/png");
      } catch (err) {
        URL.revokeObjectURL(url);
        resolve(false);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    img.src = url;
  });
}
