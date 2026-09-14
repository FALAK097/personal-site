const SITE_NAME = "Falak Gala";
const SITE_LOCALE = "en_US";
const SITE_IMAGE = {
  url: "/opengraph-image.png",
  width: 1808,
  height: 1460,
  alt: "Falak Gala",
};

export function createMetadata({ title, description, path, type = "website" }) {
  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    openGraph: {
      type,
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: [SITE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_IMAGE.url],
    },
  };
}
