// Wizard step definitions for residential and commercial tracks.
//
// Field types:
//   text | number | textarea | select | date | time
//   address-autocomplete  — search box + 4 structured sub-fields
//   checkbox-group        — multi-select; value stored as string[]
//
// Optional field properties:
//   conditional: { field: '<fieldId>', values: ['val1', …] }
//     → field is only shown (and validated) when the named sibling field
//       contains one of the listed values.

export const RESIDENTIAL_STEPS = [
  // ── Step 1: Output channels ────────────────────────────────────────────────
  // Placed first so the Newspaper character limit can be enforced downstream.
  {
    id: 'outputChannels',
    title: 'Where will this listing appear?',
    fields: [
      {
        id: 'outputChannels',
        label: 'Select all channels that apply',
        type: 'checkbox-group',
        required: true,
        options: ['Open2view', 'Company Website', 'Newspaper'],
        hint: 'Company Website also pushes to the Realestate.co.nz syndication feed. Newspaper enforces a 350-character description limit.',
      },
    ],
  },

  // ── Step 2: Address ────────────────────────────────────────────────────────
  {
    id: 'address',
    title: 'Property address',
    fields: [
      {
        id: 'address',
        label: 'Search for address',
        type: 'address-autocomplete',
        required: true,
        hint: 'Start typing to search, or click "Enter manually" below.',
      },
    ],
  },

  // ── Step 3: Bedrooms & bathrooms ──────────────────────────────────────────
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

  // ── Step 4: Property details ───────────────────────────────────────────────
  {
    id: 'propertyDetails',
    title: 'Garage, sizes & title',
    fields: [
      {
        id: 'garage',
        label: 'Garage',
        type: 'select',
        required: false,
        options: [
          'None',
          'Single',
          'Double',
          'Triple',
          'Internal access single',
          'Internal access double',
          'Car port',
        ],
      },
      {
        id: 'sectionSize',
        label: 'Section size (m²)',
        type: 'number',
        placeholder: '650',
        required: false,
      },
      {
        id: 'floor_area',
        label: 'Floor area (m²)',
        type: 'number',
        placeholder: '180',
        required: false,
        hint: 'Total interior floor area of the dwelling.',
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

  // ── Step 5: Sale method (+ conditional date/time/location) ────────────────
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
      {
        id: 'saleDate',
        label: 'Date',
        type: 'date',
        required: false,
        conditional: { field: 'saleMethod', values: ['Auction', 'Deadline Sale', 'Tender'] },
      },
      {
        id: 'saleTime',
        label: 'Time',
        type: 'time',
        required: false,
        conditional: { field: 'saleMethod', values: ['Auction', 'Deadline Sale', 'Tender'] },
      },
      {
        id: 'saleLocation',
        label: 'Location',
        type: 'text',
        placeholder: 'On-site / Ray White, 12 Example St',
        required: false,
        conditional: { field: 'saleMethod', values: ['Auction', 'Deadline Sale', 'Tender'] },
      },
    ],
  },

  // ── Step 6: Viewings & open homes ─────────────────────────────────────────
  {
    id: 'viewing',
    title: 'Viewings & open homes',
    fields: [
      {
        id: 'viewingType',
        label: 'How will buyers view this property?',
        type: 'select',
        required: false,
        options: ['By Appointment', 'Open Home'],
      },
      {
        id: 'openHomeDate',
        label: 'Open home date',
        type: 'date',
        required: false,
        conditional: { field: 'viewingType', values: ['Open Home'] },
      },
      {
        id: 'openHomeTime',
        label: 'Open home time',
        type: 'time',
        required: false,
        conditional: { field: 'viewingType', values: ['Open Home'] },
      },
    ],
  },

  // ── Step 7: Price guide ───────────────────────────────────────────────────
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

  // ── Step 8: Hero features (description) ───────────────────────────────────
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
        // charLimit applied dynamically in the UI when Newspaper is selected
      },
    ],
  },

  // ── Step 9: Outdoor living ────────────────────────────────────────────────
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

  // ── Step 10: Location highlights ─────────────────────────────────────────
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

  // ── Step 11: Vibe ─────────────────────────────────────────────────────────
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
];

export const COMMERCIAL_STEPS = [
  // ── Step 1: Output channels ────────────────────────────────────────────────
  {
    id: 'outputChannels',
    title: 'Where will this listing appear?',
    fields: [
      {
        id: 'outputChannels',
        label: 'Select all channels that apply',
        type: 'checkbox-group',
        required: true,
        options: ['Open2view', 'Company Website', 'Newspaper'],
        hint: 'Company Website also pushes to the Realestate.co.nz syndication feed.',
      },
    ],
  },

  // ── Step 2: Address ────────────────────────────────────────────────────────
  {
    id: 'address',
    title: 'Property address',
    fields: [
      {
        id: 'address',
        label: 'Search for address',
        type: 'address-autocomplete',
        required: true,
        hint: 'Start typing to search, or click "Enter manually" below.',
      },
    ],
  },

  // ── Step 3: Asset class & floor area ─────────────────────────────────────
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

  // ── Step 4: Seismic ────────────────────────────────────────────────────────
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

  // ── Step 5: Tenancy ────────────────────────────────────────────────────────
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

  // ── Step 6: Zoning & location ─────────────────────────────────────────────
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

  // ── Step 7: Key features ──────────────────────────────────────────────────
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

  // ── Step 8: Outgoings & lease ─────────────────────────────────────────────
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

  // ── Step 9: Sale method (+ conditional date/time/location) ────────────────
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
        id: 'saleDate',
        label: 'Date',
        type: 'date',
        required: false,
        conditional: { field: 'saleMethod', values: ['Deadline Sale', 'Tender', 'Auction'] },
      },
      {
        id: 'saleTime',
        label: 'Time',
        type: 'time',
        required: false,
        conditional: { field: 'saleMethod', values: ['Deadline Sale', 'Tender', 'Auction'] },
      },
      {
        id: 'saleLocation',
        label: 'Location',
        type: 'text',
        placeholder: 'On-site / Agency office',
        required: false,
        conditional: { field: 'saleMethod', values: ['Deadline Sale', 'Tender', 'Auction'] },
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
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatAddress(d) {
  const addr = d.address;
  if (addr && typeof addr === 'object') {
    return [addr.street_no, addr.street_name, addr.suburb, addr.city_town]
      .filter(Boolean)
      .join(', ');
  }
  // Legacy or manually entered flat string stored directly on the fields
  if (d.street_name) {
    return [d.street_no, d.street_name, d.suburb, d.city_town].filter(Boolean).join(', ');
  }
  return String(addr ?? '');
}

function formatChannels(d) {
  const channels = Array.isArray(d.outputChannels) ? d.outputChannels : [];
  return channels.length ? channels.join(', ') : 'Open2view';
}

function formatSaleMethod(d) {
  if (!d.saleMethod) return null;
  const parts = [d.saleMethod];
  if (d.saleDate) parts.push(d.saleDate);
  if (d.saleTime) parts.push(`at ${d.saleTime}`);
  if (d.saleLocation) parts.push(`— ${d.saleLocation}`);
  return parts.join(' ');
}

function formatViewing(d) {
  if (!d.viewingType) return null;
  if (d.viewingType === 'Open Home') {
    const parts = ['Open Home'];
    if (d.openHomeDate) parts.push(d.openHomeDate);
    if (d.openHomeTime) parts.push(`at ${d.openHomeTime}`);
    return parts.join(' ');
  }
  return 'By Appointment';
}

// ─── Prompt builders ──────────────────────────────────────────────────────────

export function buildGenerationPrompt(track, formData) {
  if (track === 'commercial') return buildCommercialPrompt(formData);
  return buildResidentialPrompt(formData);
}

function buildResidentialPrompt(d) {
  const lines = ['PROPERTY DATA:'];

  const addr = formatAddress(d);
  if (addr) lines.push(`Address: ${addr}`);
  if (d.bedrooms) lines.push(`Bedrooms: ${d.bedrooms}`);
  if (d.bathrooms) lines.push(`Bathrooms: ${d.bathrooms}`);
  if (d.garage && d.garage !== 'None') lines.push(`Garage: ${d.garage}`);
  if (d.sectionSize) lines.push(`Section size: approximately ${d.sectionSize}m²`);
  if (d.floor_area) lines.push(`Floor area: approximately ${d.floor_area}m²`);
  if (d.titleType) lines.push(`Title type: ${d.titleType}`);

  const saleLine = formatSaleMethod(d);
  if (saleLine) lines.push(`Sale method: ${saleLine}`);

  const viewingLine = formatViewing(d);
  if (viewingLine) lines.push(`Viewing: ${viewingLine}`);

  if (d.priceGuide) lines.push(`Price guide: ${d.priceGuide}`);
  if (d.heroFeatures) lines.push(`Hero features: ${d.heroFeatures}`);
  if (d.outdoorLiving) lines.push(`Outdoor living: ${d.outdoorLiving}`);
  if (d.locationHighlights) lines.push(`Location highlights: ${d.locationHighlights}`);
  if (d.vibe) lines.push(`Property vibe: ${d.vibe}`);

  const channels = Array.isArray(d.outputChannels) ? d.outputChannels : ['Open2view'];
  lines.push('');
  lines.push(`OUTPUT CHANNELS: ${channels.join(', ')}`);
  lines.push('');

  const channelInstructions = buildResidentialChannelInstructions(channels);
  lines.push(`TASK: ${channelInstructions}`);
  lines.push('');
  lines.push('Apply all NZ terminology rules, the Cringe Filter, and the Adjective Diet. Output the completed piece(s) only — no preamble.');

  return lines.join('\n');
}

function buildResidentialChannelInstructions(channels) {
  const parts = [];

  if (channels.includes('Open2view')) {
    parts.push('OPEN2VIEW — Write a complete property listing suitable for Open2view. Punchy headline (max 50 chars), opening hook capturing the lifestyle, structured body (interior → outdoor → practical), sale method CTA. Short paragraphs.');
  }
  if (channels.includes('Company Website')) {
    parts.push('COMPANY WEBSITE / REALESTATE.CO.NZ — Write a slightly longer, more descriptive listing. Compelling headline, lifestyle-led opening, flowing paragraphs covering interior, exterior, location, and practical details. End with sale method details.');
  }
  if (channels.includes('Newspaper')) {
    parts.push('NEWSPAPER — Write a classified property advertisement. STRICT LIMIT: the entire ad must be 350 characters or fewer including spaces. Lead with the most compelling fact (price, location, or stand-out feature). No headline — run the ad as a single compact paragraph ending with the sale method and a contact prompt.');
  }

  if (parts.length === 0) {
    parts.push('Write a complete property listing. Include a punchy headline, lifestyle hook, structured body, and sale method CTA.');
  }

  if (parts.length > 1) {
    return `Produce a separate, clearly labelled section for each channel below:\n\n${parts.join('\n\n')}`;
  }
  return parts[0];
}

function buildCommercialPrompt(d) {
  const lines = ['PROPERTY DATA:'];

  const addr = formatAddress(d);
  if (addr) lines.push(`Address: ${addr}`);
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

  const saleLine = formatSaleMethod(d);
  if (saleLine) lines.push(`Sale method: ${saleLine}`);
  if (d.priceYield) lines.push(`Price/yield: ${d.priceYield}`);

  const channels = Array.isArray(d.outputChannels) ? d.outputChannels : ['Open2view'];
  lines.push('');
  lines.push(`OUTPUT CHANNELS: ${channels.join(', ')}`);
  lines.push('');

  lines.push('TASK: Write professional commercial property listing copy. Lead with a factual headline, cover the asset class and floor area, tenancy profile (or vacant possession), location and access, key features, and the sale method. Tone: confident, factual, professional.');
  lines.push('');

  if (seismicRating !== null && !isNaN(seismicRating) && seismicRating < 34) {
    lines.push('MANDATORY SEISMIC DISCLOSURE: This building is below 34% NBS (earthquake-prone under Building Act 2004). You MUST include the full verbatim Building Act 2004 EPB disclosure in your output, prominently placed.');
    lines.push('');
  }

  lines.push('Apply all NZ commercial terminology, legal accuracy, and white-label rules. Output the completed piece only — no preamble.');

  return lines.join('\n');
}
