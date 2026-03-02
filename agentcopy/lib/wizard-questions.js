// Wizard step definitions for residential and commercial tracks.
// Each step: { id, title, fields[] }
// Each field: { id, label, type, placeholder, required, hint, options }

export const RESIDENTIAL_STEPS = [
  {
    id: 'address',
    title: 'Property address',
    fields: [
      {
        id: 'address',
        label: 'Street address',
        type: 'text',
        placeholder: '123 Main Street, Remuera, Auckland',
        required: true,
      },
    ],
  },
  {
    id: 'bedsBaths',
    title: 'Bedrooms & bathrooms',
    fields: [
      {
        id: 'bedrooms',
        label: 'Bedrooms',
        type: 'number',
        placeholder: '4',
        required: true,
      },
      {
        id: 'bathrooms',
        label: 'Bathrooms',
        type: 'number',
        placeholder: '2',
        required: true,
      },
    ],
  },
  {
    id: 'propertyDetails',
    title: 'Garage, section & title',
    fields: [
      {
        id: 'garage',
        label: 'Garage',
        type: 'select',
        required: false,
        options: ['None', 'Single', 'Double', 'Triple', 'Internal access single', 'Internal access double'],
      },
      {
        id: 'sectionSize',
        label: 'Section size (m²)',
        type: 'number',
        placeholder: '650',
        required: false,
      },
      {
        id: 'titleType',
        label: 'Title type',
        type: 'select',
        required: false,
        options: ['Freehold', 'Cross-lease', 'Unit title', 'Leasehold', 'Other'],
      },
    ],
  },
  {
    id: 'saleMethod',
    title: 'Sale method',
    fields: [
      {
        id: 'saleMethod',
        label: 'How is the property being sold?',
        type: 'select',
        required: true,
        options: ['Auction', 'Deadline Sale', 'Price by Negotiation', 'Asking Price', 'Tender'],
      },
    ],
  },
  {
    id: 'priceGuide',
    title: 'Price guide',
    fields: [
      {
        id: 'priceGuide',
        label: 'Price guide',
        type: 'text',
        placeholder: 'Offers over $1,250,000',
        required: false,
        hint: 'Leave blank to omit from the listing',
      },
    ],
  },
  {
    id: 'heroFeatures',
    title: 'Hero features',
    fields: [
      {
        id: 'heroFeatures',
        label: 'What makes this property stand out? (3–5 features)',
        type: 'textarea',
        placeholder: 'North-facing living room, brand new kitchen with stone benchtops, elevated views to the Waitematā Harbour',
        required: true,
      },
    ],
  },
  {
    id: 'outdoorLiving',
    title: 'Outdoor living',
    fields: [
      {
        id: 'outdoorLiving',
        label: 'Describe the outdoor spaces',
        type: 'textarea',
        placeholder: 'Large wraparound deck, heated pool, established garden with fruit trees',
        required: false,
      },
    ],
  },
  {
    id: 'locationHighlights',
    title: 'Location highlights',
    fields: [
      {
        id: 'locationHighlights',
        label: 'Schools, cafés, parks, transport nearby',
        type: 'textarea',
        placeholder: 'Zoned for Remuera Intermediate and Auckland Grammar, 5 min walk to Remuera Village',
        required: false,
      },
    ],
  },
  {
    id: 'vibe',
    title: 'Property vibe',
    fields: [
      {
        id: 'vibe',
        label: 'Which best describes the feel of this property?',
        type: 'select',
        required: true,
        options: [
          'Modern & Minimalist',
          'Character–Heritage',
          'Family Sanctuary',
          'Executive–Prestige',
          'Coastal–Holiday',
          'Rural–Lifestyle',
        ],
      },
    ],
  },
  {
    id: 'outputType',
    title: 'Output type',
    fields: [
      {
        id: 'outputType',
        label: 'What do you want to produce?',
        type: 'select',
        required: true,
        options: [
          'TradeMe listing',
          'RealEstate.co.nz listing',
          'Facebook–Instagram post',
          'Video tour script',
        ],
      },
    ],
  },
];

export const COMMERCIAL_STEPS = [
  {
    id: 'address',
    title: 'Property address',
    fields: [
      {
        id: 'address',
        label: 'Street address',
        type: 'text',
        placeholder: '151 Queen Street, Auckland CBD',
        required: true,
      },
    ],
  },
  {
    id: 'assetClass',
    title: 'Asset class & floor area',
    fields: [
      {
        id: 'assetClass',
        label: 'Asset class',
        type: 'select',
        required: true,
        options: [
          'Office',
          'Retail',
          'Industrial',
          'Warehouse',
          'Hospitality',
          'Medical',
          'Mixed use',
          'Development site',
          'Other',
        ],
      },
      {
        id: 'floorArea',
        label: 'Floor area (m²)',
        type: 'number',
        placeholder: '850',
        required: true,
      },
    ],
  },
  {
    id: 'seismic',
    title: 'Seismic rating',
    fields: [
      {
        id: 'seismicRating',
        label: 'Seismic rating (% NBS)',
        type: 'number',
        placeholder: '67',
        required: false,
        hint: 'Buildings below 34% NBS are earthquake-prone under the Building Act 2004. Leave blank if unknown.',
      },
      {
        id: 'seismicAssessmentType',
        label: 'Assessment type',
        type: 'select',
        required: false,
        options: ['IEP', 'DSA', 'Not assessed'],
      },
    ],
  },
  {
    id: 'tenancyStatus',
    title: 'Tenancy status',
    fields: [
      {
        id: 'tenancyStatus',
        label: 'Current tenancy status',
        type: 'select',
        required: true,
        options: ['Vacant', 'Fully tenanted', 'Partially tenanted'],
      },
    ],
  },
  {
    id: 'tenancyDetails',
    title: 'Tenancy details',
    fields: [
      {
        id: 'tenancyDetails',
        label: 'Tenant, net rent, expiry, WALT, rights of renewal',
        type: 'textarea',
        placeholder: 'Tenant: Acme Ltd. Net rent: $120,000 pa. Lease expiry: 31 March 2028. 2 ROR of 3 years each.',
        required: false,
        hint: 'Skip if the property is vacant',
      },
    ],
  },
  {
    id: 'zoningLocation',
    title: 'Zoning & location',
    fields: [
      {
        id: 'zoning',
        label: 'Zoning',
        type: 'text',
        placeholder: 'Business – City Centre Zone',
        required: false,
      },
      {
        id: 'locationNotes',
        label: 'Location notes',
        type: 'textarea',
        placeholder: 'Corner site with high foot traffic, 200m from Britomart transport hub',
        required: false,
      },
    ],
  },
  {
    id: 'keyFeatures',
    title: 'Key features & logistics',
    fields: [
      {
        id: 'keyFeatures',
        label: 'Key features, condition, car parks, access',
        type: 'textarea',
        placeholder: '8 car parks, recently refurbished lobby, fibre connectivity, 24/7 access, sprinkler system',
        required: true,
      },
    ],
  },
  {
    id: 'outgoings',
    title: 'Outgoings & lease structure',
    fields: [
      {
        id: 'outgoings',
        label: 'Annual outgoings (rates, insurance, etc.)',
        type: 'text',
        placeholder: '$42,000 pa',
        required: false,
      },
      {
        id: 'leaseStructure',
        label: 'Lease structure',
        type: 'select',
        required: false,
        options: ['Net', 'Gross', 'Semi-gross', 'N/A'],
      },
    ],
  },
  {
    id: 'saleDetails',
    title: 'Sale method & price',
    fields: [
      {
        id: 'saleMethod',
        label: 'Sale method',
        type: 'select',
        required: true,
        options: ['Deadline Sale', 'Tender', 'Price by Negotiation', 'Asking Price', 'Auction', 'Expression of Interest'],
      },
      {
        id: 'priceYield',
        label: 'Asking price or yield',
        type: 'text',
        placeholder: '$2,450,000 (6.2% yield) or "Price by negotiation"',
        required: false,
      },
    ],
  },
  {
    id: 'outputType',
    title: 'Output type',
    fields: [
      {
        id: 'outputType',
        label: 'What do you want to produce?',
        type: 'select',
        required: true,
        options: [
          'IM executive summary',
          'Commercial listing copy',
          'Social media post',
        ],
      },
    ],
  },
];

// ─── Prompt builder ────────────────────────────────────────────────────────────

export function buildGenerationPrompt(track, formData) {
  if (track === 'commercial') {
    return buildCommercialPrompt(formData);
  }
  return buildResidentialPrompt(formData);
}

function buildResidentialPrompt(d) {
  const lines = ['PROPERTY DATA:'];

  if (d.address) lines.push(`Address: ${d.address}`);
  if (d.bedrooms) lines.push(`Bedrooms: ${d.bedrooms}`);
  if (d.bathrooms) lines.push(`Bathrooms: ${d.bathrooms}`);
  if (d.garage && d.garage !== 'None') lines.push(`Garage: ${d.garage}`);
  if (d.sectionSize) lines.push(`Section size: approximately ${d.sectionSize}m²`);
  if (d.titleType) lines.push(`Title type: ${d.titleType}`);
  if (d.saleMethod) lines.push(`Sale method: ${d.saleMethod}`);
  if (d.priceGuide) lines.push(`Price guide: ${d.priceGuide}`);
  if (d.heroFeatures) lines.push(`Hero features: ${d.heroFeatures}`);
  if (d.outdoorLiving) lines.push(`Outdoor living: ${d.outdoorLiving}`);
  if (d.locationHighlights) lines.push(`Location highlights: ${d.locationHighlights}`);
  if (d.vibe) lines.push(`Property vibe: ${d.vibe}`);

  const outputType = d.outputType || 'TradeMe listing';
  lines.push('');
  lines.push(`OUTPUT TYPE: ${outputType}`);
  lines.push('');

  const instructions = {
    'TradeMe listing': 'Write a complete TradeMe property listing. Include a punchy headline (max 50 chars), an opening hook that captures the lifestyle, a structured body (lifestyle/location, interior, outdoor, practical), and a sale method CTA. Short paragraphs — people scan on TradeMe.',
    'RealEstate.co.nz listing': 'Write a complete RealEstate.co.nz property listing. Include a compelling headline, lifestyle-led opening, flowing paragraphs covering interior, exterior, location, and practical details. Slightly longer and more descriptive than TradeMe. End with sale method details.',
    'Facebook–Instagram post': 'Write a social media post for this property. Stop the scroll — lead with something unexpected or emotional. Include 2–3 emojis maximum. End with a clear CTA. Include relevant NZ property hashtags for Instagram. Never include the price unless it was in the price guide field.',
    'Video tour script': 'Write a walkthrough video script for this property. Open with a hook in the first 5 seconds, flow naturally through the property, use second person ("you\'ll love"), highlight 3–4 hero features, close with the sale method CTA. Written for spoken delivery — approximately 60–90 seconds (150–225 words).',
  };

  lines.push(`TASK: ${instructions[outputType] || instructions['TradeMe listing']}`);
  lines.push('');
  lines.push('Apply all NZ terminology rules, the Cringe Filter, and the Adjective Diet. Output the completed piece only — no preamble.');

  return lines.join('\n');
}

function buildCommercialPrompt(d) {
  const lines = ['PROPERTY DATA:'];

  if (d.address) lines.push(`Address: ${d.address}`);
  if (d.assetClass) lines.push(`Asset class: ${d.assetClass}`);
  if (d.floorArea) lines.push(`Floor area: approximately ${d.floorArea}m²`);

  const seismicRating = d.seismicRating ? Number(d.seismicRating) : null;
  if (seismicRating !== null && !isNaN(seismicRating)) {
    lines.push(`Seismic rating: ${seismicRating}% NBS`);
    if (d.seismicAssessmentType && d.seismicAssessmentType !== 'Not assessed') {
      lines.push(`Assessment type: ${d.seismicAssessmentType}`);
    }
  } else if (d.seismicAssessmentType === 'Not assessed') {
    lines.push('Seismic rating: Not assessed');
  }

  if (d.tenancyStatus) lines.push(`Tenancy status: ${d.tenancyStatus}`);
  if (d.tenancyDetails && d.tenancyStatus !== 'Vacant') {
    lines.push(`Tenancy details: ${d.tenancyDetails}`);
  }
  if (d.zoning) lines.push(`Zoning: ${d.zoning}`);
  if (d.locationNotes) lines.push(`Location notes: ${d.locationNotes}`);
  if (d.keyFeatures) lines.push(`Key features: ${d.keyFeatures}`);
  if (d.outgoings) lines.push(`Annual outgoings: ${d.outgoings}`);
  if (d.leaseStructure && d.leaseStructure !== 'N/A') lines.push(`Lease structure: ${d.leaseStructure}`);
  if (d.saleMethod) lines.push(`Sale method: ${d.saleMethod}`);
  if (d.priceYield) lines.push(`Price/yield: ${d.priceYield}`);

  const outputType = d.outputType || 'Commercial listing copy';
  lines.push('');
  lines.push(`OUTPUT TYPE: ${outputType}`);
  lines.push('');

  const instructions = {
    'IM executive summary': 'Write a professional Information Memorandum (IM) executive summary for this commercial property. Structure: 1) Property at a glance (address, type, floor area, tenure, price/yield, WALT if applicable), 2) Property overview (building, condition, seismic rating), 3) Location & market context, 4) Investment highlights (3–5 key reasons to buy). Investor-facing, factual, structured. Suitable for sophisticated investors.',
    'Commercial listing copy': 'Write professional commercial property listing copy. Lead with a factual headline, cover the asset class and floor area, tenancy profile (or vacant possession), location and access, key features, and the sale method. Tone: confident, factual, professional.',
    'Social media post': 'Write a social media post for this commercial property. Keep it professional and factual. Include the asset class, floor area, and key investment highlight. End with a CTA to contact for more information. 2–3 lines maximum.',
  };

  lines.push(`TASK: ${instructions[outputType] || instructions['Commercial listing copy']}`);
  lines.push('');

  // Mandatory seismic disclosure trigger
  if (seismicRating !== null && !isNaN(seismicRating) && seismicRating < 34) {
    lines.push('MANDATORY SEISMIC DISCLOSURE: This building is below 34% NBS (earthquake-prone under Building Act 2004). You MUST include the full verbatim Building Act 2004 EPB disclosure in your output, prominently placed.');
    lines.push('');
  }

  lines.push('Apply all NZ commercial terminology, legal accuracy, and white-label rules. Output the completed piece only — no preamble.');

  return lines.join('\n');
}
