// Realestate.co.nz REAXML syndication push.
//
// Required env vars (configure in Vercel dashboard):
//   REALESTATE_SYNDICATION_URL   — endpoint provided by Realestate.co.nz
//   REALESTATE_AGENCY_ID         — agency identifier from Realestate.co.nz
//   REALESTATE_SYNDICATION_SECRET — bearer token / basic-auth password
//
// Called fire-and-forget from app/api/generate/route.js when "Company Website"
// is in the selected output channels. Errors are logged but never block the
// response to the user.

function buildAddress(formData) {
  const { street_no, street_name, suburb, city_town, address } = formData;
  // Support both structured address object and legacy flat string
  if (street_name) {
    return {
      streetNumber: street_no ?? '',
      street: street_name ?? '',
      suburb: suburb ?? '',
      city: city_town ?? '',
    };
  }
  if (address && typeof address === 'object') {
    return {
      streetNumber: address.street_no ?? '',
      street: address.street_name ?? '',
      suburb: address.suburb ?? '',
      city: address.city_town ?? '',
    };
  }
  // Legacy single-string address — best-effort split
  const parts = String(address ?? '').split(',').map((p) => p.trim());
  return {
    streetNumber: '',
    street: parts[0] ?? '',
    suburb: parts[1] ?? '',
    city: parts[2] ?? '',
  };
}

function buildREAXML({ formData, outputText, agencyId, listingId }) {
  const addr = buildAddress(formData);
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const priceText = formData.priceGuide || 'Price by Negotiation';
  const bedrooms = formData.bedrooms ?? '';
  const bathrooms = formData.bathrooms ?? '';
  const landArea = formData.sectionSize ? `<landArea unit="squareMeter">${formData.sectionSize}</landArea>` : '';
  const floorArea = formData.floor_area ? `<buildingDetails><area unit="squareMeter">${formData.floor_area}</area></buildingDetails>` : '';

  // Escape XML special characters in text content
  const esc = (s) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  return `<?xml version="1.0" encoding="UTF-8"?>
<REAXML>
  <listing>
    <agencyID>${esc(agencyId)}</agencyID>
    <uniqueID>${esc(listingId)}</uniqueID>
    <status>current</status>
    <dateAvailableFrom>${now}</dateAvailableFrom>
    <address>
      <streetNumber>${esc(addr.streetNumber)}</streetNumber>
      <street>${esc(addr.street)}</street>
      <suburb>${esc(addr.suburb)}</suburb>
      <city>${esc(addr.city)}</city>
      <country>NZ</country>
    </address>
    <price display="yes">${esc(priceText)}</price>
    <landDetails>
      ${landArea}
    </landDetails>
    ${floorArea}
    <features>
      <bedrooms>${esc(bedrooms)}</bedrooms>
      <bathrooms>${esc(bathrooms)}</bathrooms>
    </features>
    <description><![CDATA[${outputText}]]></description>
    <listingAgent>
      <agentID>agentcopy-auto</agentID>
    </listingAgent>
  </listing>
</REAXML>`;
}

/**
 * Push listing to Realestate.co.nz syndication feed.
 * Resolves silently on success or failure — never throws.
 *
 * @param {object} opts
 * @param {object} opts.formData  — raw wizard form data
 * @param {string} opts.outputText — generated listing copy
 * @param {string} opts.listingId  — unique ID for this generation (use generation.id)
 */
export async function pushToRealestateNZ({ formData, outputText, listingId }) {
  const url = process.env.REALESTATE_SYNDICATION_URL;
  const agencyId = process.env.REALESTATE_AGENCY_ID;
  const secret = process.env.REALESTATE_SYNDICATION_SECRET;

  if (!url || !agencyId) {
    console.warn('[syndication] REALESTATE_SYNDICATION_URL or REALESTATE_AGENCY_ID not set — skipping push');
    return;
  }

  const xml = buildREAXML({ formData, outputText, agencyId, listingId: listingId ?? 'unknown' });

  const headers = {
    'Content-Type': 'application/xml',
    'Accept': 'application/xml',
  };
  if (secret) {
    headers['Authorization'] = `Bearer ${secret}`;
  }

  try {
    const res = await fetch(url, { method: 'POST', headers, body: xml });
    if (!res.ok) {
      console.error(`[syndication] Push failed: HTTP ${res.status}`, await res.text().catch(() => ''));
    } else {
      console.log(`[syndication] Listing ${listingId} pushed to Realestate.co.nz (HTTP ${res.status})`);
    }
  } catch (err) {
    console.error('[syndication] Network error pushing to Realestate.co.nz:', err.message);
  }
}
