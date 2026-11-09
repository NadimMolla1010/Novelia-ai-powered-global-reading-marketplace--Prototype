import { Book, PublisherAccount, ChapterComment, CampaignRequest, Transaction, NoveliaNotification } from '../types';

export const INITIAL_PUBLISHERS: PublisherAccount[] = [
  {
    id: 'pub-horizon',
    name: 'Horizon Global Publishing',
    organizationType: 'publishing_company',
    contactEmail: 'rights@horizonpress.com',
    country: 'United Kingdom',
    verificationStatus: 'approved',
    documentsSubmitted: true,
    payoutDetailsConfigured: true,
    payoutMethod: 'Direct SEPA / Wire (IBAN ending in •••• 8829)',
    commissionRate: 0.20,
    joinedDate: '2026-01-14'
  },
  {
    id: 'pub-atelier',
    name: 'Atelier Écritures',
    organizationType: 'publishing_company',
    contactEmail: 'contact@atelier-ecritures.fr',
    country: 'France',
    verificationStatus: 'approved',
    documentsSubmitted: true,
    payoutDetailsConfigured: true,
    payoutMethod: 'Stripe Connect (Account ending in •••• 3140)',
    commissionRate: 0.20,
    joinedDate: '2026-02-01'
  },
  {
    id: 'pub-stellaris',
    name: 'Stellaris House',
    organizationType: 'publishing_company',
    contactEmail: 'editor@stellaris.tokyo',
    country: 'Japan',
    verificationStatus: 'approved',
    documentsSubmitted: true,
    payoutDetailsConfigured: true,
    payoutMethod: 'Wise Business Transfer',
    commissionRate: 0.20,
    joinedDate: '2026-02-18'
  },
  {
    id: 'pub-solitude',
    name: 'Solitude Press & Independent Guild',
    organizationType: 'independent_author',
    contactEmail: 'elena.rostova@literary.org',
    country: 'Canada',
    verificationStatus: 'approved',
    documentsSubmitted: true,
    payoutDetailsConfigured: true,
    payoutMethod: 'PayPal International Payout',
    commissionRate: 0.20,
    joinedDate: '2026-03-02'
  },
  {
    id: 'pub-veritas',
    name: 'Veritas Nordic Media',
    organizationType: 'publishing_company',
    contactEmail: 'submissions@veritasnordic.no',
    country: 'Norway',
    verificationStatus: 'pending',
    documentsSubmitted: true,
    payoutDetailsConfigured: false,
    payoutMethod: 'Pending verification',
    commissionRate: 0.20,
    joinedDate: '2026-11-06'
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-solitude',
    title: 'The Architecture of Solitude',
    subtitle: 'A Novel of Memory, Stone, and Second Chances',
    author: 'Clara Vance',
    authorBio: 'Clara Vance is a Booker Prize shortlisted author whose work explores urban seclusion and human memory.',
    publisherId: 'pub-horizon',
    publisherName: 'Horizon Global Publishing',
    genre: 'Literary Fiction',
    originalLanguage: 'English',
    availableEditions: [
      { language: 'English', languageCode: 'en', isOriginal: true, type: 'publisher_approved' },
      { language: 'Spanish', languageCode: 'es', translator: 'Mateo Morales', isOriginal: false, type: 'publisher_approved' },
      { language: 'French', languageCode: 'fr', translator: 'Camille Dubois', isOriginal: false, type: 'publisher_approved' },
      { language: 'German', languageCode: 'de', translator: 'Klara Lindemann', isOriginal: false, type: 'publisher_approved' }
    ],
    coverImage: '/src/assets/images/book_cover_solitude_1794218149274.jpg',
    // Released 3 days ago - falls within the 7-day launch promotion window!
    releaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    launchPriceUSD: 2.00,
    regularPriceUSD: 4.00,
    promotionalPeriodDays: 7,
    description: 'When archivist David Hensley inherits an unfinished brutalist conservatory in northern Jutland, he discovers fifty-four sealed letters addressed to residents who never existed. A mesmerizing meditation on stillness, grief, and the structures we build to protect what we cannot bear to lose.',
    rating: 4.89,
    reviewCount: 312,
    totalPages: 284,
    featured: true,
    audioMood: 'reflective',
    status: 'published',
    unitsSold: 920,
    activeReaders: 540,
    completionRate: 74,
    chapters: [
      {
        id: 'solitude-ch-1',
        number: 1,
        title: 'The Blueprints of Jutland',
        readTimeMinutes: 7,
        audioTrack: {
          id: 'track-reverie',
          title: 'Acoustic Cello & Amber Keys',
          mood: 'reflective',
          tempo: '64 BPM',
          description: 'Melancholic piano chords layered over low wooden strings.'
        },
        summary: 'David arrives in the coastal fog of Hirtshals and surveys the cold concrete pillars of his uncle’s unfinished estate.',
        keyEvents: ['Arrival at Jutland estate', 'Discovery of the brass lockbox', 'First glimpse of the unposted correspondence'],
        content: [
          'The road to Hirtshals did not believe in haste. It unwound between salt-bitten dunes like an unironed ribbon, gray giving way to grayer, until the North Sea arrived not as a view, but as an intrusion of wet wind against the carriage glass.',
          'David Hensley rested his hand against the leather briefcase on the seat beside him. Inside lay the deed: parcel 408-B, six hundred square meters of poured concrete, reinforcement rebar, and unpaid local municipal levies.',
          'His uncle Julian had died as he had designed—in angular, defiant incompletion. Julian was the sort of architect who regarded curtains as moral cowardice and considered a ninety-degree corner an admission of spiritual exhaustion.',
          '“You won’t find heating out there,” the station cabman had remarked half an hour ago, adjusting a wool cap that smelled of cured herring. “Just the sea gulls and Julian’s pillars. He used to sit out there with a pocket radio listening to choral masses from Hamburg.”',
          'Now, standing before the structure, David felt an unexpected vertigo. It was not a ruin; it was an unfinished hymn. Twelve monolithic concrete arches reached toward the overcast sky like the ribs of a leviathan beached upon sand.',
          'He turned the heavy bronze key in the padlock of the site trailer. Dust suspended in the slant of late afternoon light, smelling of wet lime, old drafting vellum, and tobacco long gone stale. And there, placed squarely upon the trestle table beneath Julian’s brass compass, sat a wooden box bound in copper wire.',
          'Fifty-four envelopes. All stamped. None mailed.'
        ]
      },
      {
        id: 'solitude-ch-2',
        number: 2,
        title: 'The Unaddressed Citizen',
        readTimeMinutes: 9,
        audioTrack: {
          id: 'track-reverie-2',
          title: 'Nocturne in Jutland',
          mood: 'reflective',
          tempo: '60 BPM',
          description: 'Slow harmonic intervals and warm acoustic decay.'
        },
        summary: 'Opening the first envelope reveals intimate observations of an imaginary municipal life Julian documented across three decades.',
        keyEvents: ['Opening letter #1', 'Deciphering Julian’s cryptic margins', 'Encountering the name Astrid Møller'],
        content: [
          'The first envelope bore no name upon its face, only a geographic coordinate written in Julian’s sharp, draftsman’s cursive: 57°35\'12" N, 9°58\'04" E.',
          'David smoothed the paper over the scarred birch table. The paper was heavy stock, watermarked with three interlocking crowns.',
          '“If you are reading this,” Julian wrote, “you are standing where the wind turns from west to north. Do not seal the west wall. If you close that gap, the light at four o’clock will strike the floor like an executioner’s axe instead of a friend’s hand.”',
          'David smiled faintly in the dimming trailer. Julian had never written a holiday card in forty years, but he had left fifty-four pages instructing the weather how to enter his home.',
          'Yet on the reverse of the leaf, half-erased in soft graphite, lay another sentence: “Tell Astrid that the stairs were made wide enough for two people to walk without brushing shoulders, unless they wanted to.”'
        ]
      },
      {
        id: 'solitude-ch-3',
        number: 3,
        title: 'The Weight of Stone',
        readTimeMinutes: 8,
        audioTrack: {
          id: 'track-reverie-3',
          title: 'Resonance of Salt',
          mood: 'reflective',
          tempo: '62 BPM',
          description: 'Deep acoustic resonance and quiet reflective pauses.'
        },
        summary: 'David explores the village records to identify Astrid and uncovers an old romance buried by family silence.',
        keyEvents: ['Visit to the municipal registry', 'Meeting with the archivist', 'The truth behind the abandoned blueprints'],
        content: [
          'The parish registry in Hjørring smelled of lemon wax and two hundred years of damp paper. The archivist, a woman with silver spectacles perched precariously on her brow, pushed the 1968 census ledger across the counter with steady hands.',
          '“Astrid Møller,” she said softly. “Julian Hensley drew the pavilion for her father’s botanical society. Did he never speak of it?”',
          '“Julian spoke only when stone failed to explain itself,” David answered.',
          '“Then he told you nothing,” she said, turning the yellowed leaves. “Because the stone here has kept his secret for fifty winters.”'
        ]
      }
    ]
  },
  {
    id: 'book-gate',
    title: 'Chronicles of the Obsidian Gate',
    subtitle: 'An Odyssey Beyond the Outer Horizon',
    author: 'Kenji Takahashi',
    authorBio: 'Kenji Takahashi is an award-winning Japanese speculative fiction writer known for sweeping cosmic narratives rooted in existential philosophy.',
    publisherId: 'pub-stellaris',
    publisherName: 'Stellaris House',
    genre: 'Sci-Fi & Speculative',
    originalLanguage: 'Japanese',
    availableEditions: [
      { language: 'Japanese', languageCode: 'ja', isOriginal: true, type: 'publisher_approved' },
      { language: 'English', languageCode: 'en', translator: 'Sarah Jenkins', isOriginal: false, type: 'publisher_approved' },
      { language: 'German', languageCode: 'de', translator: 'Heinrich Weber', isOriginal: false, type: 'publisher_approved' },
      { language: 'Spanish', languageCode: 'es', translator: 'Lucía Ortiz', isOriginal: false, type: 'publisher_approved' }
    ],
    coverImage: '/src/assets/images/book_cover_chronicles_1794218150585.jpg',
    // Released 16 days ago - outside 7 day launch window, so Regular Price applies ($4.00)
    releaseDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    launchPriceUSD: 2.00,
    regularPriceUSD: 4.00,
    promotionalPeriodDays: 7,
    description: 'Suspended in the calm eye of an artificial caldera on Kepler-452b, a monolithic black prism hums at a frequency that matches human cardiac rhythms. When navigator Ren Sorano decodes its transmission, humanity discovers the gate was not left behind by gods—it was built as an emergency seal against what comes after.',
    rating: 4.94,
    reviewCount: 520,
    totalPages: 340,
    featured: true,
    audioMood: 'mystery',
    status: 'published',
    unitsSold: 1420,
    activeReaders: 890,
    completionRate: 81,
    chapters: [
      {
        id: 'gate-ch-1',
        number: 1,
        title: 'The Harmonic Caldera',
        readTimeMinutes: 10,
        audioTrack: {
          id: 'track-obsidian-1',
          title: 'Subterranean Frequency 55Hz',
          mood: 'mystery',
          tempo: '52 BPM',
          description: 'Dark resonant sub-frequencies with bowed metal textures.'
        },
        summary: 'Navigator Ren Sorano conducts the orbital resonance scan above Kepler-452b and detects the harmonic pulse.',
        keyEvents: ['Orbital descent', 'The bio-frequency alignment', 'First contact with the monolith surface'],
        content: [
          'The telemetry console aboard the *Aethelgard* did not display a warning. It displayed a heartbeat.',
          '“Ren, look at the amplitude,” Flight Officer Voss whispered, leaning over the telemetry pit. His visor cast an emerald crescent across his sweat-sheened forehead.',
          'Seventy-two beats per minute. Regular, rhythmic, and emanating from the basalt center of the caldera four thousand meters below.',
          'Ren adjusted the polarization filter. Through the atmospheric haze, the gate appeared not as a manufactured edifice, but as a sliver of missing reality. Light did not bounce from its facets; it curved around them in cold gravitational surrender.',
          '“Deploy the tether,” Ren said, feeling the vibration through his boots before the external microphones had even relayed the acoustic wave. “If it’s breathing, we shouldn’t keep it waiting.”'
        ]
      },
      {
        id: 'gate-ch-2',
        number: 2,
        title: 'The Language of Mass',
        readTimeMinutes: 9,
        audioTrack: {
          id: 'track-obsidian-2',
          title: 'Cosmic Drift in B Minor',
          mood: 'mystery',
          tempo: '56 BPM',
          description: 'Ethereal synth shimmer with low brass drone.'
        },
        summary: 'Sorano places his glove upon the obsidian face and receives the non-linear mathematical equation of the seal.',
        keyEvents: ['Glove contact', 'The temporal echo vision', 'Deciphering the warning'],
        content: [
          'To touch the gate was to realize that human language was a clumsy compromise between teeth and lung.',
          'The material was neither cold nor warm. It possessed no temperature known to thermodynamic scale. Instead, the sensory feedback arrived as pure mathematical density.',
          'In his headset, the crew’s voices faded into static, replaced by a voice that sounded like tectonic plates sliding in slow motion across a mantle of liquid glass.',
          '“Do not unlock,” the translation matrix sputtered, its AI struggling to resolve the multidimensional glyphs into English syntax. “We did not build the lock to keep the stars out. We built it to keep the silence in.”'
        ]
      }
    ]
  },
  {
    id: 'book-whispers',
    title: 'Whispers in the Rue Saint-Denis',
    subtitle: 'A Paris Noir Mystery',
    author: 'Jean-Paul Laurent',
    authorBio: 'Jean-Paul Laurent is a Parisian crime novelist and former investigative journalist renowned for atmospheric historical thrillers.',
    publisherId: 'pub-atelier',
    publisherName: 'Atelier Écritures',
    genre: 'Mystery & Thriller',
    originalLanguage: 'French',
    availableEditions: [
      { language: 'French', languageCode: 'fr', isOriginal: true, type: 'publisher_approved' },
      { language: 'English', languageCode: 'en', translator: 'Arthur Montgomery', isOriginal: false, type: 'publisher_approved' },
      { language: 'Spanish', languageCode: 'es', translator: 'Elena Valdés', isOriginal: false, type: 'publisher_approved' }
    ],
    coverImage: '/src/assets/images/book_cover_whispers_1794218151357.jpg',
    // Released 2 days ago - falls in Launch Window ($2.00)!
    releaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    launchPriceUSD: 2.00,
    regularPriceUSD: 4.00,
    promotionalPeriodDays: 7,
    description: 'Paris, November 1928. Inspector Marcel Vaneau is summoned to an abandoned tabac shop in the 2nd arrondissement where a prominent banker is found dead at a card table—clutching a single train ticket to Istanbul dated three years in the future.',
    rating: 4.78,
    reviewCount: 219,
    totalPages: 298,
    featured: false,
    audioMood: 'mystery',
    status: 'published',
    unitsSold: 410,
    activeReaders: 280,
    completionRate: 68,
    chapters: [
      {
        id: 'whispers-ch-1',
        number: 1,
        title: 'The Card Table at Midnight',
        readTimeMinutes: 8,
        audioTrack: {
          id: 'track-paris-rain',
          title: 'Cobblestone Noir & Rain',
          mood: 'mystery',
          tempo: '58 BPM',
          description: 'Muffled brass, melancholic walking bass, and soft rainfall.'
        },
        summary: 'Inspector Vaneau arrives at the scene in the rain-swept Rue Saint-Denis and examines the strange crime scene.',
        keyEvents: ['Arrival at tabac shop', 'Examination of the corpse', 'Discovery of the Istanbul ticket'],
        content: [
          'Rain fell on the zinc roofs of the Rue Saint-Denis with the persistent malice of an unpaid debt.',
          'Marcel Vaneau lifted the black umbrella just enough to clear the wooden awning of *Le Chien Qui Fume*. Sergeant Blanc was already standing by the doorway, cigarette glowing between grease-stained fingers.',
          '“He’s upstairs, patron,” Blanc muttered, tossing the stub into the rushing gutter. “Hasn’t moved. The brandy in his glass hasn’t even lost its bouquet.”',
          'Vaneau climbed the narrow spiral staircase, each wooden tread groaning beneath his wool coat. The room on the premier étage was suffocatingly warm, heated by an iron stove that glowed cherry-red in the shadows.',
          'At the round felt table sat Édouard Caillaux, director of the Banque Franco-Ottomane, upright as if waiting for a third trump card. His throat was unmarked; his suit was immaculate. Only between his thumb and forefinger lay the anomaly: a ticket for the Orient Express, printed on green watermarked cardboard, stamped: *Gare de Lyon — 14 Novembre 1931*.'
        ]
      }
    ]
  },
  {
    id: 'book-silence',
    title: 'The Anatomy of Silence',
    subtitle: 'A Philosophical Exploration of Stillness and Meaning',
    author: 'Elena Rostova',
    authorBio: 'Elena Rostova is a philosopher, essayist, and cultural theorist writing on acoustic ecology and modern contemplation.',
    publisherId: 'pub-solitude',
    publisherName: 'Solitude Press & Independent Guild',
    genre: 'Philosophy & Essays',
    originalLanguage: 'English',
    availableEditions: [
      { language: 'English', languageCode: 'en', isOriginal: true, type: 'publisher_approved' },
      { language: 'French', languageCode: 'fr', translator: 'Thierry Renard', isOriginal: false, type: 'publisher_approved' },
      { language: 'Japanese', languageCode: 'ja', translator: 'Kenzo Mori', isOriginal: false, type: 'publisher_approved' }
    ],
    coverImage: '/src/assets/images/book_cover_silence_1794218151190.jpg',
    // Released 4 days ago - in launch promo window ($2.00)!
    releaseDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    launchPriceUSD: 2.00,
    regularPriceUSD: 4.00,
    promotionalPeriodDays: 7,
    description: 'An acclaimed meditation on the lost art of mental acoustic space in an age of hyper-connectivity. Drawing from monastic traditions, Arctic expeditions, and contemporary neuroscience, Rostova invites readers to listen to what remains when the world grows quiet.',
    rating: 4.92,
    reviewCount: 185,
    totalPages: 210,
    featured: false,
    audioMood: 'peaceful',
    status: 'published',
    unitsSold: 380,
    activeReaders: 210,
    completionRate: 85,
    chapters: [
      {
        id: 'silence-ch-1',
        number: 1,
        title: 'The Threshold of the Auditory World',
        readTimeMinutes: 7,
        audioTrack: {
          id: 'track-silence-1',
          title: 'Ambient Morning Light',
          mood: 'peaceful',
          tempo: '50 BPM',
          description: 'Gentle harmonic breath and soothing pentatonic chimes.'
        },
        summary: 'An exploration of how modern humanity surrendered silence and why stillness is a generative act rather than absence.',
        keyEvents: ['Defining acoustic ecology', 'The monastery at Mount Athos', 'The neuroscience of quiet reflection'],
        content: [
          'We do not fear the dark; we fear the moment the room becomes so quiet that we can hear the gears of our own anxiety turning.',
          'Silence is rarely the absence of vibration. In the high tundras of Svalbard, silence arrives as a presence so heavy it presses against the eardrums like deep water.',
          'When we allow the mechanical din of the city to recede, the mind does not empty itself. Rather, it expands to inhabit the perimeter of its real thoughts. To cultivate silence is not an act of retreat—it is the supreme assertion of presence.'
        ]
      }
    ]
  }
];

export const INITIAL_CHAPTER_COMMENTS: ChapterComment[] = [
  {
    id: 'comm-1',
    bookId: 'book-solitude',
    chapterNumber: 1,
    userName: 'Kaelen Miller',
    userRole: 'Reader',
    avatarColor: 'bg-amber-600',
    text: 'That line about the road to Hirtshals not believing in haste set the whole mood. The description of Julian’s unfinished hymn gave me chills.',
    timestamp: '2 hours ago',
    likes: 34,
    hasLiked: false,
    reported: false
  },
  {
    id: 'comm-2',
    bookId: 'book-solitude',
    chapterNumber: 1,
    userName: 'Mira Al-Farsi',
    userRole: 'Reader',
    avatarColor: 'bg-emerald-600',
    text: 'Listening to StorySound while reading Chapter 1 felt like I was actually sitting inside that misty trailer in Jutland with the rain on the zinc roof.',
    timestamp: '5 hours ago',
    likes: 19,
    hasLiked: true,
    reported: false
  },
  {
    id: 'comm-3',
    bookId: 'book-solitude',
    chapterNumber: 1,
    userName: 'Julian_Reader99',
    userRole: 'Reader',
    avatarColor: 'bg-indigo-600',
    text: 'Who do you think Astrid Møller really is? I hope David doesn’t hesitate to read the second letter!',
    timestamp: 'Yesterday',
    likes: 12,
    hasLiked: false,
    reported: false
  },
  {
    id: 'comm-4',
    bookId: 'book-gate',
    chapterNumber: 1,
    userName: 'Thorne_V',
    userRole: 'Reader',
    avatarColor: 'bg-rose-600',
    text: 'A heartbeat frequency at 72 BPM coming from a planetary caldera... Kenji Takahashi has outdone himself with this cosmic mystery premise.',
    timestamp: '3 days ago',
    likes: 45,
    hasLiked: false,
    reported: false
  }
];

export const INITIAL_CAMPAIGNS: CampaignRequest[] = [
  {
    id: 'camp-101',
    publisherId: 'pub-horizon',
    publisherName: 'Horizon Global Publishing',
    bookId: 'book-solitude',
    bookTitle: 'The Architecture of Solitude',
    campaignType: 'New Release Spotlight',
    targetRegion: 'Global (North America & Western Europe)',
    targetLanguage: 'English, French, Spanish',
    targetAudience: 'Readers of literary fiction, architectural essays, and atmospheric drama',
    objective: 'Maximize 7-day launch pricing velocity and convert reader library adds',
    proposedStartDate: '2026-11-10',
    proposedEndDate: '2026-11-20',
    budgetUSD: 450,
    notes: 'Prioritize feature banner on Literary Fiction shelf and StorySound highlight.',
    status: 'active',
    adminNotes: 'Approved with editorial homepage carousel placement.',
    createdAt: '2026-11-07'
  },
  {
    id: 'camp-102',
    publisherId: 'pub-stellaris',
    publisherName: 'Stellaris House',
    bookId: 'book-gate',
    bookTitle: 'Chronicles of the Obsidian Gate',
    campaignType: 'Global Homepage Banner',
    targetRegion: 'Asia-Pacific & North America',
    targetLanguage: 'Japanese, English',
    targetAudience: 'Sci-fi enthusiasts, hard speculative fiction fans',
    objective: 'Boost post-launch catalog discovery and multilingual edition sales',
    proposedStartDate: '2026-11-15',
    proposedEndDate: '2026-11-25',
    budgetUSD: 800,
    notes: 'Features Takahashi’s exclusive author notes on Kepler-452b orbital dynamics.',
    status: 'under_review',
    adminNotes: 'Pending review of regional marketing schedule.',
    createdAt: '2026-11-08'
  },
  {
    id: 'camp-103',
    publisherId: 'pub-atelier',
    publisherName: 'Atelier Écritures',
    bookId: 'book-whispers',
    bookTitle: 'Whispers in the Rue Saint-Denis',
    campaignType: 'Genre Feature',
    targetRegion: 'Europe (France, Belgium, UK)',
    targetLanguage: 'French, English',
    targetAudience: 'Mystery & Noir book club members',
    objective: 'Promote launch window discount ($2.00) during mystery book month',
    proposedStartDate: '2026-11-12',
    proposedEndDate: '2026-11-19',
    budgetUSD: 300,
    notes: 'Special chapter circle discussion event on Thursday.',
    status: 'submitted',
    createdAt: '2026-11-09'
  }
];

export const INITIAL_USER_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-2026-8801',
    type: 'book_purchase',
    bookId: 'book-solitude',
    bookTitle: 'The Architecture of Solitude',
    amountUSD: 2.00,
    grossAmountUSD: 2.00,
    commissionAmountUSD: 0.40, // 20% platform commission
    publisherNetUSD: 1.60, // 80% publisher net
    status: 'successful',
    date: '2026-11-07T14:32:00Z',
    receiptNumber: 'NOV-REC-77319',
    paymentMethod: 'Novelia Balance / Visa •••• 4021',
    editionLanguage: 'English (Original)'
  }
];

export const INITIAL_NOTIFICATIONS: NoveliaNotification[] = [
  {
    id: 'notif-1',
    title: 'Welcome to NOVELIA',
    message: 'Your personal library is ready. Enjoy immersive literature with StorySound and Chapter Circle.',
    date: 'Just now',
    type: 'system',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Launch Window Active: $2.00 Special',
    message: '“The Architecture of Solitude” is currently in its 7-day launch window. Regular price ($4.00) starts in 4 days.',
    date: '2 hours ago',
    type: 'release',
    read: false
  },
  {
    id: 'notif-3',
    title: 'New Chapter Discussion in Chapter Circle',
    message: '34 readers shared reflections on Chapter 1 of “The Architecture of Solitude”. Join the conversation.',
    date: '5 hours ago',
    type: 'community',
    read: false
  }
];

export const PERSONA_PROFILES = {
  reader: {
    id: 'user-elena',
    userId: 'USR-NOV-88412',
    name: 'Elena Rostova',
    handle: '@elena_reads',
    role: 'reader' as const,
    email: 'elena.rostova@literary.org',
    avatarColor: 'bg-[#0D5EAF]',
    country: 'Greece / Canada',
    city: 'Athens & Montreal',
    joinedDate: 'March 2026',
    preferredLanguages: ['English (Original)', 'French', 'Greek', 'Spanish'],
    status: 'Verified Global Reader',
    subscriptionTier: 'Novelia Global Explorer ($9.99/mo)',
    walletBalanceUSD: 45.00,
    bio: 'Literature enthusiast, acoustic ecology researcher, and contemplative reader. Exploring international translations, Greek Mediterranean poetry, and atmospheric reading with StorySound.',
    readingInterests: ['Literary Fiction', 'Philosophy & Essays', 'Historical Noir', 'Cosmic Speculative'],
    securityBadge: 'Two-Factor Authenticated (SMS + Authenticator)'
  },
  publisher: {
    id: 'user-marcus',
    userId: 'PUB-HRZ-99014',
    name: 'Marcus Sterling',
    handle: '@horizon_press',
    role: 'publisher' as const,
    email: 'm.sterling@horizonpress.com',
    organization: 'Horizon Global Publishing Ltd.',
    avatarColor: 'bg-[#094787]',
    country: 'United Kingdom',
    city: 'London & Athens Bureau',
    joinedDate: 'January 2026',
    preferredLanguages: ['English', 'Spanish', 'French', 'German'],
    status: 'Verified Publisher Partner (KYC Level 2)',
    payoutMethod: 'Direct SEPA / Wire (IBAN ending in •••• 8829)',
    bio: 'Director of Global Digital Rights & Multilingual Distribution at Horizon Global Publishing. Managing 12 international author estates across Europe and the Mediterranean.',
    securityBadge: 'Corporate Enterprise SSO + Hardware Key'
  },
  admin: {
    id: 'user-alexandra',
    userId: 'ADM-SEC-00109',
    name: 'Alexandra Thorne',
    handle: '@thorne_ops',
    role: 'admin' as const,
    email: 'a.thorne@novelia.market',
    organization: 'NOVELIA Global Governance & Operations',
    avatarColor: 'bg-[#003c73]',
    country: 'Switzerland / Greece',
    city: 'Geneva Operations & Aegean Mediterranean Hub',
    joinedDate: 'November 2025',
    preferredLanguages: ['English', 'Greek', 'French', 'German'],
    status: 'Tier-3 Platform Governance Lead',
    bio: 'Platform compliance director, rights integrity auditor, and community moderation overseer for NOVELIA global marketplaces.',
    securityBadge: 'Hardware Key U2F (YubiKey 5Ci) · Multi-Sig Vault'
  }
};

