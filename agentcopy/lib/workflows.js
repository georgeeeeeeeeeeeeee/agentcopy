export const workflows = [
  // ─── Tier 1: Marketing & Lead Gen ─────────────────────────────────────────
  {
    id: 'trademe-listing',
    tier: 1,
    icon: '🏠',
    title: 'TradeMe Listing',
    desc: 'Write a property listing for TradeMe',
    opener:
      "Let's write a TradeMe listing. What's the property address, and can you give me a quick rundown — bedrooms, bathrooms, standout features, and the sale method (Auction, Deadline Sale, Price by Negotiation, or asking price)?",
  },
  {
    id: 'realestate-listing',
    tier: 1,
    icon: '🏡',
    title: 'RealEstate.co.nz Listing',
    desc: 'Write a listing for RealEstate.co.nz',
    opener:
      "Let's create your RealEstate.co.nz listing. What's the property address and key details?",
  },
  {
    id: 'social-post',
    tier: 1,
    icon: '📱',
    title: 'Social Media Post',
    desc: 'Create a listing post for Facebook or Instagram',
    opener:
      "Let's create a social post. Which property is this for, which platform (Facebook, Instagram, or both), and what's the vibe — just listed, open home invite, price update, or sold?",
  },
  {
    id: 'video-tour-script',
    tier: 1,
    icon: '🎬',
    title: 'Video Tour Script',
    desc: 'Write a walkthrough script for a property video',
    opener:
      "Let's write your video tour script. What's the property address, and walk me through the key spaces — where does the tour start, what are the hero rooms, and what feeling do you want viewers to leave with?",
  },

  // ─── Tier 2: Professional Correspondence ──────────────────────────────────
  {
    id: 'vendor-update',
    tier: 2,
    icon: '📧',
    title: 'Vendor Update Email',
    desc: 'Draft an update email to your vendor',
    opener:
      "I'll help you write a vendor update. What's the property, and what news do you need to share — open home numbers, offers, feedback, or market update?",
  },
  {
    id: 'open-home-followup',
    tier: 2,
    icon: '🔑',
    title: 'Open Home Follow-Up',
    desc: 'Message attendees after an open home',
    opener:
      "Let's follow up with your open home attendees. How did the open home go — how many groups came through, and any standout interest?",
  },
  {
    id: 'price-reduction',
    tier: 2,
    icon: '💬',
    title: 'Price Reduction Chat',
    desc: 'Prepare for a price adjustment conversation with a vendor',
    opener:
      "I'll help you prepare for this conversation. What's the current asking price, what are you recommending it moves to, and what evidence supports the change (days on market, comparable sales, feedback)?",
  },
  {
    id: 'appraisal-letter',
    tier: 2,
    icon: '📋',
    title: 'Market Appraisal Letter',
    desc: 'Draft a CMA cover letter for a prospective vendor',
    opener:
      "Let's draft your appraisal letter. What's the property address, your recommended price range, and any key selling points you want to highlight?",
  },
  {
    id: 'buyer-email',
    tier: 2,
    icon: '🎯',
    title: 'Buyer Match Email',
    desc: 'Email a matched buyer about a new listing',
    opener:
      "Let's reach out to your buyer. What's the new listing, and what do you know about what they're looking for?",
  },
  {
    id: 'multi-offer-notification',
    tier: 2,
    icon: '📨',
    title: 'Multi-Offer Notification',
    desc: 'Notify all parties that multiple offers have been received',
    opener:
      "Let's draft your multi-offer notification. How many offers are in play, what's the property, and what's the process — are you calling for best and final, or giving parties a set deadline to improve?",
  },
  {
    id: 'rejection-email',
    tier: 2,
    icon: '📩',
    title: 'Offer Rejection Email',
    desc: "Inform a buyer their offer wasn't accepted",
    opener:
      "I'll help you draft a respectful rejection. What was the offer price, what was the accepted price (or just that it was higher), and would you like to keep the door open for this buyer?",
  },
  {
    id: 'acceptance-email',
    tier: 2,
    icon: '✅',
    title: 'Offer Acceptance Email',
    desc: 'Confirm a signed offer to all parties',
    opener:
      "Great news to communicate. What's the property address, the accepted price, settlement date, and who needs to be notified — vendor, purchaser, both solicitors?",
  },

  // ─── Tier 3: Legal & Compliance ───────────────────────────────────────────
  {
    id: 'sp-finance-clause',
    tier: 3,
    subCategory: "S&P Clauses",
    icon: '⚖️',
    title: 'Finance Clause',
    desc: 'Draft a finance condition for an S&P agreement',
    opener:
      "I can help draft a finance clause. To get started, tell me:\n\n1. What type of finance are the purchasers seeking (e.g. standard residential mortgage, construction loan)?\n2. What's the finance amount?\n3. How many working days do they need?\n4. Any specific lender or conditions to note?",
  },
  {
    id: 'sp-building-clause',
    tier: 3,
    subCategory: "S&P Clauses",
    icon: '⚖️',
    title: 'Building & LIM Clause',
    desc: 'Draft a building inspection and/or LIM condition',
    opener:
      "Let's draft your due diligence clause. Tell me:\n\n1. Is this for a building inspection, LIM report, or both?\n2. How many working days do the purchasers need?\n3. Any specific concerns to address (e.g. known issues, leaky building era)?",
  },
  {
    id: 'sp-solicitors-approval',
    tier: 3,
    subCategory: "S&P Clauses",
    icon: '⚖️',
    title: "Solicitor's Approval Clause",
    desc: "Draft a solicitor's approval condition",
    opener:
      "I'll draft a solicitor's approval clause. Tell me:\n\n1. How many working days for approval?\n2. Is this for the purchaser, vendor, or both?\n3. Any specific matters the solicitor needs to review (e.g. title, cross-lease, easements)?",
  },
  {
    id: 'sp-sunset-clause',
    tier: 3,
    subCategory: "S&P Clauses",
    icon: '⚖️',
    title: 'Sunset Clause',
    desc: 'Draft a sunset/long-stop date clause',
    opener:
      "Let's draft a sunset clause. Tell me:\n\n1. What is the long-stop date (the date by which all conditions must be satisfied or the agreement lapses)?\n2. What triggers the sunset — unsatisfied conditions, title not issued, or something else?\n3. Does either party have the right to extend, and if so under what circumstances?",
  },
  {
    id: 'sp-further-terms',
    tier: 3,
    subCategory: "S&P Clauses",
    icon: '⚖️',
    title: 'Contingent on Sale / Further Terms',
    desc: "Draft a 'subject to sale' or other further terms clause",
    opener:
      "I can draft contingent or further terms clauses. Tell me:\n\n1. What is the agreement contingent on (e.g. sale of purchaser's existing home, consent, subdivision)?\n2. Is there a timeframe or deadline?\n3. Does the vendor retain the right to continue marketing (48-hour clause)?",
  },
  {
    id: 'disclosure-material-defects',
    tier: 3,
    subCategory: "Disclosure",
    icon: '📄',
    title: 'Material Defect Disclosure (s136/137)',
    desc: 'Draft a material defect disclosure statement',
    opener:
      "Let's prepare a material defect disclosure under ss136–137 of the Real Estate Agents Act 2008. Tell me:\n\n1. What is the defect or issue to disclose?\n2. What does the vendor know about its extent or cause?\n3. Has the defect been remediated, and if so how?\n4. Are there any reports (builder's, council) that document the issue?",
  },
  {
    id: 'disclosure-as-is',
    tier: 3,
    subCategory: "Disclosure",
    icon: '📄',
    title: 'As-Is Where-Is Clause',
    desc: "Draft an 'as-is where-is' acknowledgement clause",
    opener:
      "I'll draft an as-is where-is clause. Tell me:\n\n1. What is the property and its current condition?\n2. Are there known defects the purchaser is accepting?\n3. Is this an estate sale, mortgagee sale, or distressed asset?\n4. Should the clause reference specific known issues or be general?",
  },
  {
    id: 'disclosure-unit-title',
    tier: 3,
    subCategory: "Disclosure",
    icon: '📄',
    title: 'Unit Title / Body Corporate Disclosure',
    desc: 'Prepare a unit title disclosure summary',
    opener:
      "Let's prepare your unit title disclosure. Tell me:\n\n1. What is the property address and body corporate name?\n2. What are the current levies (operational and long-term maintenance fund)?\n3. Are there any known special levies, defects, or disputes?\n4. Has the pre-contract disclosure statement been obtained from the body corporate?",
  },
  {
    id: 'disclosure-healthy-homes',
    tier: 3,
    subCategory: "Disclosure",
    icon: '📄',
    title: 'Healthy Homes Compliance Statement',
    desc: 'Draft a Healthy Homes Standards compliance statement for a rental',
    opener:
      "I'll draft a Healthy Homes compliance statement. Tell me:\n\n1. Is the property currently tenanted or being sold as an investment?\n2. What is the heating source in the main living area (and its kW capacity if known)?\n3. What insulation is in place (ceiling and underfloor)?\n4. Is there a current Healthy Homes assessment or compliance certificate?",
  },
  {
    id: 'aml-cdd-explanation',
    tier: 3,
    subCategory: "AML/CFT",
    icon: '🛡️',
    title: 'AML/CDD Client Letter',
    desc: 'Explain AML/CDD requirements to a client',
    opener:
      "I'll draft an AML/CDD explanation letter. Tell me:\n\n1. Is this for a vendor, purchaser, or both?\n2. Is the client an individual, trust, or company?\n3. Have they been through this process before with your agency, or is this new to them?\n4. Any specific ID documents you've already collected or still need?",
  },
  {
    id: 'aml-source-of-funds',
    tier: 3,
    subCategory: "AML/CFT",
    icon: '🛡️',
    title: 'Source of Funds Request',
    desc: 'Request source of funds information from a client',
    opener:
      "Let's draft a source of funds request. Tell me:\n\n1. What is the purchase price and how are funds being sourced (mortgage, savings, gift, overseas funds, sale proceeds)?\n2. Is this for a high-value transaction or a flagged risk client?\n3. What supporting documents will you need (bank statements, gift letter, overseas transfer records)?",
  },

  // ─── Tier 4: Commercial Real Estate ──────────────────────────────────────
  {
    id: 'cre-information-memorandum',
    tier: 4,
    subCategory: 'Marketing',
    icon: '🏢',
    title: 'Information Memorandum',
    desc: 'Draft an investor-grade IM for a commercial property',
    opener:
      "Let's build your Information Memorandum. To start, tell me:\n\n1. Property address and type (Office, Retail, Industrial, Mixed-use)?\n2. Floor area (sqm) and title type (Freehold, Leasehold, Unit Title)?\n3. Current tenancy status — is the property tenanted, vacant, or partially tenanted?\n4. Seismic rating (% NBS) if known?\n5. Asking price or yield expectations?",
  },
  {
    id: 'cre-walt-calculator',
    tier: 4,
    subCategory: 'Financial Analysis',
    icon: '📊',
    title: 'WALT Calculator & Narrative',
    desc: 'Calculate Weighted Average Lease Term and write the investor story',
    opener:
      "I'll calculate the WALT and write the investment narrative. For each tenant, give me:\n\n1. Tenant name (or just 'Tenant A', 'Tenant B' etc.)\n2. Annual rent ($)\n3. Floor area (sqm)\n4. Lease expiry date (or years remaining)\n\nList as many tenants as needed. I'll calculate WALT by both income and area, then explain what it means for the asset.",
  },
  {
    id: 'cre-opex-breakdown',
    tier: 4,
    subCategory: 'Financial Analysis',
    icon: '📑',
    title: 'Outgoings (OPEX) Table',
    desc: 'Format outgoings into a Net vs Gross rent schedule',
    opener:
      "Let's build your OPEX schedule. Tell me:\n\n1. The gross annual rent ($)\n2. List all outgoings with amounts — e.g. Council rates, insurance, body corporate levies, management fees, maintenance, gardening\n3. Are outgoings fully recoverable from the tenant (Net lease), partially recoverable, or landlord-paid (Gross lease)?\n\nI'll format a clean Net vs Gross table ready for an IM or listing.",
  },
  {
    id: 'cre-agreement-to-lease',
    tier: 4,
    subCategory: 'Documents',
    icon: '📝',
    title: 'Agreement to Lease',
    desc: 'Draft commercial heads of terms / Agreement to Lease',
    opener:
      "Let's draft your Agreement to Lease. I'll need:\n\n1. Landlord name and tenant name\n2. Premises address and description (floor, area sqm)\n3. Commencement date and term (years)\n4. Rights of Renewal — how many and for how long each?\n5. Initial annual rent ($) and rent review mechanism (CPI, market, fixed %)\n6. Key outgoings — recoverable or gross?\n7. Permitted use\n8. Any landlord fitout contribution or rent-free period?",
  },
  {
    id: 'cre-rent-review',
    tier: 4,
    subCategory: 'Documents',
    icon: '📬',
    title: 'Rent Review Notice',
    desc: 'Draft a formal rent review notice (CPI, market, or fixed)',
    opener:
      "Let's draft your rent review notice. Tell me:\n\n1. Landlord and tenant names\n2. Property address\n3. Review date and current annual rent ($)\n4. Review mechanism — CPI, market rent, or fixed % uplift?\n5. If CPI: the relevant index period and calculated figure\n6. If market: proposed new rent and any comparable evidence\n7. Is there a ratchet clause (rent cannot decrease)?",
  },
  {
    id: 'cre-make-good-clause',
    tier: 4,
    subCategory: 'Documents',
    icon: '🔨',
    title: 'Make Good Clause',
    desc: "Draft reinstatement obligations for a Deed of Lease",
    opener:
      "I'll draft your make good clause. Tell me:\n\n1. What fitout or alterations has the tenant installed?\n2. What is the landlord's preference — physical reinstatement, or cash settlement in lieu?\n3. Are there any landlord-installed items the tenant can retain?\n4. What is the condition standard required (e.g. repainted, professionally cleaned, carpets replaced)?\n5. What is the notice period before lease expiry for make good works to begin?",
  },
  {
    id: 'cre-seismic-disclosure',
    tier: 4,
    subCategory: 'Disclosure',
    icon: '⚠️',
    title: 'Seismic Disclosure Statement',
    desc: 'Draft a Building Act 2004 earthquake-prone building disclosure',
    opener:
      "Let's prepare the seismic disclosure. Tell me:\n\n1. Property address\n2. Current seismic rating (% NBS — National Building Standard)\n3. Has a detailed seismic assessment (DSA) been completed? If so, by whom and when?\n4. Has the council issued a notice under the Building Act 2004?\n5. Are there any planned or completed upgrades?\n6. Is this for an IM, a lease disclosure, or a sale disclosure?",
  },
  {
    id: 'cre-deed-summary',
    tier: 4,
    subCategory: 'Analysis',
    icon: '🔍',
    title: 'Deed of Lease Summary',
    desc: 'Extract and summarise key terms from an ADLS Deed of Lease',
    opener:
      "Paste the relevant sections of the Deed of Lease and I'll extract and summarise:\n\n- Parties, premises, term, and rights of renewal\n- Rent and review mechanisms (including any ratchet clauses)\n- Outgoings and recovery provisions\n- Assignment and subletting rights\n- Make good / reinstatement obligations\n- Termination events and landlord re-entry rights\n- Insurance obligations\n- Quiet enjoyment covenant\n\nPaste the deed text (or the sections you want analysed) and I'll begin.",
  },
];

export const tiers = [
  { id: 1, label: 'Marketing & Lead Gen' },
  { id: 2, label: 'Professional Correspondence' },
  { id: 3, label: 'Legal & Compliance' },
  { id: 4, label: 'Commercial Real Estate' },
];
