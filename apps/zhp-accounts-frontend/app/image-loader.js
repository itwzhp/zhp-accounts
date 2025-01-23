// Docs: https://developers.cloudflare.com/images/transform-images
// based on https://nextjs.org/docs/app/api-reference/config/next-config-js/images#cloudflare
export default function cloudflareLoader({ src, width, quality }) {
    const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto']
    return `/cdn-cgi/image/${params.join(',')}/${src}`
  }