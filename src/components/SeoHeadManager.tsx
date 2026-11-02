import React, { useEffect } from 'react';
import { CalculatorMeta, NavTab } from '../types/calculator';

interface SeoHeadProps {
  activeTool?: CalculatorMeta;
  activeTab: NavTab;
}

const TAB_SEO_CONFIG: Record<
  NavTab,
  { title: string; description: string; slug: string }
> = {
  home: {
    title: 'SmartCalc – Free Online Calculator | Exam, Negative Marking, Scientific & More',
    description:
      'Free online calculators for students and everyday use. Calculate negative marking, exam scores, percentages, scientific calculations, EMI, GST and more.',
    slug: '/',
  },
  calculators: {
    title: 'All Online Calculators – Exam, Scientific, Finance & Unit Converters | SmartCalc',
    description:
      'Browse 22 free online calculators for competitive exams, negative marking, percentages, scientific math, CGPA, loan EMI, GST, and unit conversions.',
    slug: '/calculators',
  },
  students: {
    title: 'Student Calculators Online – Negative Marking, Exam Score, CGPA & Attendance',
    description:
      'Dedicated online student calculators for competitive exam negative marking, section-wise exam scores, CGPA to percentage, semester GPA, and attendance.',
    slug: '/student-tools',
  },
  finance: {
    title: 'Finance Calculators Online – Loan EMI, GST, Discount & Currency Converter',
    description:
      'Free online financial calculators for students and households. Compute monthly loan EMI, add or remove GST, calculate sale discounts, and convert currencies.',
    slug: '/finance-calculators',
  },
  converters: {
    title: 'Unit Converters & Date Calculators – Length, Weight, Speed, Age & Date',
    description:
      'Instant online unit converters for length, weight, temperature, speed, and digital storage, plus exact chronological age and date duration calculators.',
    slug: '/converters',
  },
  learn: {
    title: 'How It Works & Formula Guides – Negative Marking, Accuracy, CGPA & EMI | SmartCalc',
    description:
      'Learn how to calculate negative marking, exam accuracy, percentages, CGPA, GPA, loan EMI, and GST with step-by-step student guides and worked examples.',
    slug: '/how-it-works',
  },
  history: {
    title: 'Saved Calculations & History – SmartCalc Online Calculator',
    description:
      'Review, copy, and bookmark your recent exam score, scientific, percentage, and financial calculations stored privately in your browser.',
    slug: '/history',
  },
  about: {
    title: 'About SmartCalc – Student & General Online Calculator Platform',
    description:
      'Learn about SmartCalc’s mission to provide fast, accurate, privacy-first online calculators for students, competitive exam aspirants, and everyday users.',
    slug: '/about',
  },
  contact: {
    title: 'Contact & Feedback – SmartCalc Online Calculator',
    description:
      'Get in touch with the SmartCalc team to report a calculation edge case, request a new exam preset, or share feedback.',
    slug: '/contact',
  },
  privacy: {
    title: 'Privacy Policy – 100% Local Browser Calculations | SmartCalc',
    description:
      'Read SmartCalc’s privacy policy. All calculations and history items are processed and stored locally in your browser without collecting personal data.',
    slug: '/privacy-policy',
  },
  terms: {
    title: 'Terms & Conditions – SmartCalc Online Calculator',
    description:
      'Review the terms and conditions for using SmartCalc’s online student, exam, scientific, financial, and unit conversion calculators.',
    slug: '/terms-and-conditions',
  },
  disclaimer: {
    title: 'Calculator Disclaimer – Official Exam & Financial Verification | SmartCalc',
    description:
      'Important accuracy and examination rule disclaimer for SmartCalc online calculators.',
    slug: '/disclaimer',
  },
};

export const SeoHeadManager: React.FC<SeoHeadProps> = ({ activeTool, activeTab }) => {
  useEffect(() => {
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://ais-pre-bqwoohbbo3zhqpakp6wf4u-359744040684.asia-southeast1.run.app';

    const pageTitle = activeTool
      ? activeTool.seoTitle
      : TAB_SEO_CONFIG[activeTab]?.title || TAB_SEO_CONFIG.home.title;

    const pageDescription = activeTool
      ? activeTool.seoDescription
      : TAB_SEO_CONFIG[activeTab]?.description || TAB_SEO_CONFIG.home.description;

    const pageSlug = activeTool
      ? activeTool.slug
      : TAB_SEO_CONFIG[activeTab]?.slug || '/';

    const canonicalUrl = `${origin}${pageSlug}`;

    // 1. Update Document Title
    document.title = pageTitle;

    // 2. Helper to set meta tags
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('name', 'description', pageDescription);
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);

    // 3. Update Canonical Link
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // 4. Build Valid Schema.org JSON-LD Graph
    const graph: Record<string, unknown>[] = [
      {
        '@type': 'Organization',
        name: 'SmartCalc',
        url: `${origin}/`,
        description:
          'All-in-One Online Calculator Platform for Students, Competitive Exams, STEM, Finance, and Unit Conversions.',
      },
      {
        '@type': 'WebSite',
        name: 'SmartCalc – All-in-One Calculator',
        url: `${origin}/`,
      },
    ];

    if (activeTool) {
      // WebApplication / SoftwareApplication schema for the specific calculator
      graph.push({
        '@type': ['WebApplication', 'SoftwareApplication'],
        name: activeTool.name,
        url: canonicalUrl,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        description: activeTool.seoDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      });

      // BreadcrumbList schema
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${origin}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: activeTool.categoryLabel,
            item: `${origin}/calculators`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: activeTool.name,
            item: canonicalUrl,
          },
        ],
      });

      // FAQPage schema where FAQs exist on the page
      if (activeTool.faqs && activeTool.faqs.length > 0) {
        graph.push({
          '@type': 'FAQPage',
          mainEntity: activeTool.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        });
      }
    } else {
      graph.push({
        '@type': 'WebApplication',
        name: 'SmartCalc – All-in-One Calculator',
        url: canonicalUrl,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        description: pageDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      });
    }

    let scriptEl = document.getElementById('smartcalc-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'smartcalc-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
  }, [activeTool, activeTab]);

  return null;
};
