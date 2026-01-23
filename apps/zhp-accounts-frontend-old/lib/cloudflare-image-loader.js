const isCloudflarePagesDev = process.env.CF_PAGES_URL?.includes('pages.dev');

// Docs: https://developers.cloudflare.com/images/transform-images
// based on https://nextjs.org/docs/app/api-reference/config/next-config-js/images#cloudflare
export default function cloudflareLoader({ src, width, quality = 75 }) {
  if (isCloudflarePagesDev) {
    return src;
  }

  const params = [`width=${width}`, `quality=${quality}`, 'format=auto'];
  return `/cdn-cgi/image/${params.join(',')}/${src}`;
}
