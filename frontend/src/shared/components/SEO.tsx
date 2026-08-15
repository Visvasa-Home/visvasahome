import { useEffect } from 'react';
import { siteConfig } from '@core/config/config';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  structuredData?: object;
}

export function SEO({
  title,
  description = siteConfig.description,
  canonical,
  ogType = 'website',
  ogImage,
  structuredData
}: SEOProps) {

  useEffect(() => {
    // Set document title with proper length (50-60 chars optimal)
    const pageTitle = title
      ? title
      : `${siteConfig.name} - Verified Local Service Professionals India`;
    document.title = pageTitle;
    
    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? 'name' : 'property';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };
    
    // Basic meta tags
    updateMetaTag('description', description, true);
    updateMetaTag('keywords', siteConfig.keywords, true);
    
    // Open Graph tags
    updateMetaTag('og:title', pageTitle);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', ogType);
    updateMetaTag('og:url', canonical || siteConfig.url);
    updateMetaTag('og:site_name', siteConfig.name);
    
    if (ogImage) {
      updateMetaTag('og:image', ogImage);
    }
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', pageTitle, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:site', siteConfig.social.twitter, true);
    
    if (ogImage) {
      updateMetaTag('twitter:image', ogImage, true);
    }
    
    // Canonical URL
    let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }

    linkElement.setAttribute('href', canonical || siteConfig.url);

    // Additional SEO meta tags
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', true);
    updateMetaTag('author', siteConfig.founder.name, true);
    updateMetaTag('language', 'English', true);
    updateMetaTag('geo.region', 'IN', true);
    updateMetaTag('geo.placename', 'India', true);
    updateMetaTag('theme-color', '#2563eb', true);

    // Mobile optimization
    updateMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=5', true);
    updateMetaTag('format-detection', 'telephone=yes', true);
    updateMetaTag('mobile-web-app-capable', 'yes', true);
    updateMetaTag('apple-mobile-web-app-capable', 'yes', true);
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent', true);

    // Add JSON-LD structured data
    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]');

      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptElement);
      }

      scriptElement.textContent = JSON.stringify(structuredData);
    }

  }, [title, description, canonical, ogType, ogImage, structuredData]);

  return null;
}
