// Proxy route for NZ address lookup.
// Supports Addressfinder (ADDRESSFINDER_API_KEY) as primary provider.
// If no key is configured, returns { suggestions: [], fallback: true } so the
// client can gracefully degrade to manual entry.
//
// Endpoints:
//   GET /api/address?q={query}          → suggestion list
//   GET /api/address?pxid={pxid}        → structured address detail

const ADDRESSFINDER_BASE = 'https://api.addressfinder.io/api/nz';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const pxid = searchParams.get('pxid');
  const apiKey = process.env.ADDRESSFINDER_API_KEY;

  // No API key — tell the client to fall back to manual entry
  if (!apiKey) {
    return Response.json({ suggestions: [], fallback: true });
  }

  try {
    if (pxid) {
      // ── Detail lookup ────────────────────────────────────────────────────────
      const url = new URL(`${ADDRESSFINDER_BASE}/address/info`);
      url.searchParams.set('pxid', pxid);
      url.searchParams.set('key', apiKey);
      url.searchParams.set('format', 'json');

      const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
      if (!res.ok) return Response.json({ error: 'Address detail lookup failed' }, { status: 502 });

      const detail = await res.json();

      // Map Addressfinder fields → our structured schema
      const structured = {
        street_no: detail.street_number ?? '',
        street_name: detail.street ?? '',
        suburb: detail.locality_name ?? detail.suburb ?? '',
        city_town: detail.city ?? detail.region ?? '',
      };

      return Response.json(structured);
    }

    if (q && q.length >= 3) {
      // ── Suggestion search ────────────────────────────────────────────────────
      const url = new URL(`${ADDRESSFINDER_BASE}/address`);
      url.searchParams.set('q', q);
      url.searchParams.set('key', apiKey);
      url.searchParams.set('format', 'json');
      url.searchParams.set('max', '8');

      const res = await fetch(url.toString(), { next: { revalidate: 0 } });
      if (!res.ok) return Response.json({ suggestions: [], fallback: false });

      const data = await res.json();

      const suggestions = (data.completions ?? []).map((c) => ({
        pxid: c.pxid,
        label: c.a,    // full address display string
      }));

      return Response.json({ suggestions, fallback: false });
    }

    return Response.json({ suggestions: [], fallback: false });
  } catch {
    // Network or parse error — fall through to manual entry
    return Response.json({ suggestions: [], fallback: true });
  }
}
