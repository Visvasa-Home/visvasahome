import { siteConfig } from '@core/config/config';

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  description: siteConfig.description,
  foundingDate: siteConfig.founder.founded,
  founder: {
    '@type': 'Person',
    name: siteConfig.founder.name,
    jobTitle: siteConfig.founder.title,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: siteConfig.contactPhone,
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi'],
  },
  sameAs: [
    siteConfig.social.instagram,
    siteConfig.social.facebook,
    siteConfig.social.youtube,
    siteConfig.social.linkedin,
    siteConfig.founder.linkedin,
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '2500',
  },
};

// Local Business Schema
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': siteConfig.url,
  name: siteConfig.name,
  image: `${siteConfig.url}/logo.png`,
  url: siteConfig.url,
  telephone: siteConfig.contactPhone,
  email: siteConfig.contactEmail,
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jaipur',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '302001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 26.9124,
    longitude: 75.7873,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '08:00',
    closes: '20:00',
  },
  sameAs: [
    siteConfig.social.instagram,
    siteConfig.social.facebook,
    siteConfig.social.youtube,
    siteConfig.social.linkedin,
  ],
};

// Service Schema
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Home Services',
  provider: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  areaServed: siteConfig.cities.map((city) => ({
    '@type': 'City',
    name: city,
  })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Home Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Plumbing Services',
          description: 'Professional plumbing repair and installation services',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Electrical Services',
          description: 'Licensed electrical repair and installation services',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AC Service & Repair',
          description: 'AC installation, service, and repair by certified technicians',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Home Cleaning',
          description: 'Professional home cleaning and deep cleaning services',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Painting Services',
          description: 'Interior and exterior painting services',
        },
      },
    ],
  },
};

// Breadcrumb Schema Generator
export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// FAQ Schema Generator
export const getFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

// Website Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};
