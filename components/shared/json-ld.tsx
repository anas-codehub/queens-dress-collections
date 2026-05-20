export function ProductJsonLd({
  product,
  url,
}: {
  product: {
    name: string;
    description: string | null;
    price: number;
    comparePrice: number | null;
    images: { url: string }[];
    reviews: { rating: number }[];
    slug: string;
  };
  url: string;
}) {
  const avgRating = product.reviews.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: product.images.map((i) => i.url),
    url,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BDT",
      availability: "https://schema.org/InStock",
      url,
      ...(product.comparePrice && {
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      }),
    },
    ...(avgRating &&
      product.reviews.length > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: avgRating.toFixed(1),
          reviewCount: product.reviews.length,
          bestRating: "5",
          worstRating: "1",
        },
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://queensdresscollection.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Queens Dress Collection",
    url: BASE_URL,
    description: "Premium women's fashion — dresses, gowns, co-ord sets",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://queensdresscollection.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Queens Dress Collection",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      "https://facebook.com/queensdresscollection",
      "https://instagram.com/queensdresscollection",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Bengali"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
