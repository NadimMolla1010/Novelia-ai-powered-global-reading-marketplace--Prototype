import { Book, UserRole, RoxMessage } from '../types';

interface RoxContext {
  role: UserRole;
  currentBook?: Book | null;
  currentChapterNumber?: number;
  userPurchasedBookIds: string[];
  readingProgress?: Record<string, number>;
  publisherCatalog?: Book[];
}

export async function askRoxAssistant(
  prompt: string,
  context: RoxContext
): Promise<RoxMessage> {
  const p = prompt.toLowerCase();
  const id = `rox-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. READER USE CASES
  if (context.role === 'reader') {
    // A. Purchase Reminder
    if (p.includes('remind') || p.includes('reminder') || p.includes('friday') || p.includes('schedule purchase')) {
      const targetBook = context.currentBook?.title || 'Whispers in the Rue Saint-Denis';
      return {
        id,
        role: 'assistant',
        content: `I have scheduled a pending calendar reminder for you:\n\n📅 **Purchase Reminder: "${targetBook}"**\n• Scheduled for: This Friday, 10:00 AM\n• Price: Launch Window price $2.00 (7-day promotion)\n\n*(Per NOVELIA security rules BR-14, ROX cannot execute automatic charges. You will receive an in-app reminder to review and confirm the checkout yourself.)*`,
        timestamp,
        suggestedActions: [
          { label: 'View in Wishlist', actionType: 'navigate_wishlist' },
          { label: 'Open Checkout Now', actionType: 'open_checkout', payload: { bookId: context.currentBook?.id || 'book-whispers' } }
        ]
      };
    }

    // B. In-book Search & Passage Lookup
    if (p.includes('passage') || p.includes('find') || p.includes('search') || p.includes('where')) {
      if (context.currentBook) {
        const book = context.currentBook;
        const currentCh = context.currentChapterNumber || 1;

        // Check if searching for letters or Astrid in Architecture of Solitude
        if (p.includes('astrid') || p.includes('letter') || p.includes('envelope')) {
          if (currentCh < 2) {
            return {
              id,
              role: 'assistant',
              content: `🛡️ **Spoiler Protection Notice**: You are currently reading **Chapter ${currentCh}** of *${book.title}*.\n\nThe first mention of fifty-four sealed envelopes occurs at the end of **Chapter 1** in Julian's work trailer. However, specific personal notes addressing **Astrid Møller** appear in **Chapter 2 ("The Unaddressed Citizen")**.\n\nWould you like me to unlock Chapter 2 notes, or stay within your current reading boundary?`,
              timestamp,
              contextTag: 'Spoiler Boundary Enforced',
              suggestedActions: [
                { label: 'Jump to Chapter 2', actionType: 'jump_chapter', payload: 2 },
                { label: 'Stay in Chapter 1', actionType: 'dismiss' }
              ]
            };
          } else {
            return {
              id,
              role: 'assistant',
              content: `In **Chapter 2 ("The Unaddressed Citizen")**, David discovers a pencil note on the reverse of Julian's first coordinate letter:\n\n> *"Tell Astrid that the stairs were made wide enough for two people to walk without brushing shoulders, unless they wanted to."*\n\nThis leads David to investigate the parish records in Hjørring in Chapter 3.`,
              timestamp,
              citations: [`${book.title} — Chapter 2: The Unaddressed Citizen`]
            };
          }
        }

        // Generic chapter search
        return {
          id,
          role: 'assistant',
          content: `In *${book.title}*, relevant passages can be found in **Chapter 1 ("${book.chapters[0]?.title}")**. Key themes indexed: architecture of memory, solitude as presence, and the coastal atmosphere of Jutland.`,
          timestamp,
          citations: [`${book.title} (Authorized Edition)`]
        };
      } else {
        return {
          id,
          role: 'assistant',
          content: `Please open a book or select a title from the marketplace, and I can search chapters, quote passages, or index character appearances with active spoiler protection.`,
          timestamp
        };
      }
    }

    // C. Summarize / Reading Support with Spoiler Guard
    if (p.includes('summar') || p.includes('explain') || p.includes('recap') || p.includes('what happened')) {
      if (context.currentBook) {
        const ch = context.currentChapterNumber || 1;
        const chapter = context.currentBook.chapters.find(c => c.number === ch) || context.currentBook.chapters[0];
        return {
          id,
          role: 'assistant',
          content: `📖 **Reading Support Summary — Chapter ${chapter.number}: "${chapter.title}"**\n\n${chapter.summary}\n\n**Key Events:**\n${chapter.keyEvents.map(e => `• ${e}`).join('\n')}\n\n*Note: Following NOVELIA rule BR-08, spoilers for subsequent chapters are strictly masked until you reach them.*`,
          timestamp,
          suggestedActions: [
            { label: 'Open Chapter Circle Discussion', actionType: 'open_discussion' },
            { label: 'Listen to StorySound', actionType: 'toggle_sound' }
          ]
        };
      }
    }

    // D. Recommendations
    if (p.includes('recommend') || p.includes('suggest') || p.includes('what to read') || p.includes('next')) {
      return {
        id,
        role: 'assistant',
        content: `Based on your interest in atmospheric world literature and contemplative fiction, here are two tailored recommendations:\n\n1. **"The Architecture of Solitude" by Clara Vance**\n   • Genre: Literary Fiction · Atmospheric & Reflective\n   • Launch Special: **$2.00** (Regular $4.00, 4 days remaining)\n   • Includes StorySound track: *Acoustic Cello & Amber Keys*\n\n2. **"Whispers in the Rue Saint-Denis" by Jean-Paul Laurent**\n   • Genre: Paris Noir Mystery\n   • Launch Special: **$2.00**\n   • Available in authorized French & English editions`,
        timestamp,
        suggestedActions: [
          { label: 'Browse "The Architecture of Solitude"', actionType: 'view_book', payload: 'book-solitude' },
          { label: 'Explore Noir Collection', actionType: 'filter_genre', payload: 'Mystery & Thriller' }
        ]
      };
    }

    // E. Reading Insights
    if (p.includes('insight') || p.includes('progress') || p.includes('stats') || p.includes('month')) {
      return {
        id,
        role: 'assistant',
        content: `📊 **Your November Reading Insights**:\n• Total reading time: 4 hours 12 minutes\n• Average session: 28 minutes\n• Preferred StorySound mood: **Reflective (Acoustic Piano & Cello)**\n• Chapter Circle contributions: 2 reflections shared\n• Active Library: 1 book in progress (Chapter 1 at 35% completion)`,
        timestamp
      };
    }

    // Default reader answer
    return {
      id,
      role: 'assistant',
      content: `Hello! I am **ROX**, your reading companion on NOVELIA. I can help you with:\n\n• **In-book passage search** & character lookup\n• **Spoiler-free chapter summaries**\n• **Literary recommendations** tailored to your preferred languages & genres\n• **Purchase reminders** for upcoming launch discounts\n\nHow can I assist your reading today?`,
      timestamp,
      suggestedActions: [
        { label: 'Explain Chapter 1 Summary', actionType: 'ask_summary' },
        { label: 'Find Books on Sale ($2.00)', actionType: 'show_sales' },
        { label: 'Set a Purchase Reminder', actionType: 'ask_reminder' }
      ]
    };
  }

  // 2. PUBLISHER USE CASES
  if (context.role === 'publisher') {
    // A. Revenue & Sales Analysis
    if (p.includes('revenue') || p.includes('sale') || p.includes('highest') || p.includes('earn')) {
      return {
        id,
        role: 'assistant',
        content: `📈 **Measured Sales & Earnings Breakdown** *(Horizon Global Publishing)*:\n\n• **Top Revenue Book**: *"The Architecture of Solitude"*\n  - Units Sold: **920 copies** (620 launch window @ $2.00, 300 @ $4.00 regular)\n  - Gross Sales: **$2,440.00**\n  - Platform Commission (20%): **-$488.00**\n  - **Estimated Publisher Net (80%)**: **$1,952.00**\n\n• **Total Portfolio Earnings to Date**: **$3,680.00 Net**\n• Payout status: $1,952.00 scheduled for next bi-weekly payout batch.`,
        timestamp,
        suggestedActions: [
          { label: 'View Full Payment Ledger', actionType: 'open_payments' },
          { label: 'Download Financial Statement', actionType: 'download_statement' }
        ]
      };
    }

    // B. Engagement & Drop-off Analysis
    if (p.includes('engagement') || p.includes('completion') || p.includes('drop') || p.includes('reader')) {
      return {
        id,
        role: 'assistant',
        content: `🔍 **Reader Engagement Analytics — "The Architecture of Solitude"**:\n\n• **Total Active Readers**: 540 readers\n• **Overall Completion Rate**: 74% (Benchmark for Literary Fiction: 62%)\n• **Chapter 1 Completion**: **91%**\n• **Chapter 2 Completion**: **83%**\n• **Drop-off Analysis**: The largest pause point (12% drop) occurs midway through Chapter 2 where the architectural blueprint diagrams are introduced. Readers spend an average of 4.2 minutes engaging with StorySound ambient music on this section.`,
        timestamp,
        citations: ['Aggregate Reader Telemetry (Anonymized per GDPR / Privacy Policy)']
      };
    }

    // C. Description / Content Support
    if (p.includes('description') || p.includes('blurb') || p.includes('generate') || p.includes('draft')) {
      return {
        id,
        role: 'assistant',
        content: `✍️ **AI-Generated Promotional Blurb (Draft for Review)**:\n\n*"In a forgotten conservatory on the edge of the Danish coast, stone keeps the secrets people were too fragile to carry. 'The Architecture of Solitude' blends the quiet tension of Scandinavian noir with the emotional ache of second chances. An unmissable debut from Clara Vance."*\n\n*(Per NOVELIA guidelines 7.7, AI-generated blurbs are recommendations and require publisher approval before updating your book metadata.)*`,
        timestamp,
        suggestedActions: [
          { label: 'Apply to Book Metadata', actionType: 'apply_blurb' },
          { label: 'Generate Alternative Variation', actionType: 'alt_blurb' }
        ]
      };
    }

    // D. Promotion / Reach Readers Planning
    if (p.includes('campaign') || p.includes('reach readers') || p.includes('promote') || p.includes('marketing')) {
      return {
        id,
        role: 'assistant',
        content: `🎯 **Reach Readers Strategy Recommendation**:\n\nFor *"The Architecture of Solitude"*, your 7-day launch window ends in 4 days. I recommend submitting a **New Release Spotlight** campaign request:\n\n• **Campaign Type**: New Release Spotlight\n• **Target Regions**: North America & Western Europe\n• **Target Languages**: English, Spanish, French\n• **Proposed Budget**: $350 - $450\n• **Expected Lift**: +45% reader library additions during final discounted days.`,
        timestamp,
        suggestedActions: [
          { label: 'Open Reach Readers Form', actionType: 'open_reach_readers' }
        ]
      };
    }

    // Default publisher response
    return {
      id,
      role: 'assistant',
      content: `Hello! I am **ROX**, your publisher analytics and catalog assistant. I can assist with:\n\n• **Sales & Revenue Breakdown** with transparent 80/20 royalty calculations\n• **Chapter-by-Chapter Reader Engagement & Drop-off Analysis**\n• **Drafting Promotional Book Blurbs & Metadata**\n• **Preparing Reach Readers Campaign Requests**\n\nWhat would you like to examine?`,
      timestamp,
      suggestedActions: [
        { label: 'Analyze Revenue & Royalties', actionType: 'ask_revenue' },
        { label: 'Review Reader Drop-off Rates', actionType: 'ask_engagement' },
        { label: 'Suggest Reach Readers Campaign', actionType: 'ask_campaign' }
      ]
    };
  }

  // 3. ADMIN ASSISTANT
  return {
    id,
    role: 'assistant',
    content: `🛡️ **ROX Operational Admin Monitor**:\n\n• **Pending Publisher Verifications**: 1 account awaiting review (*Veritas Nordic Media*)\n• **Submitted Books for Moderation**: All active titles reviewed and compliant\n• **Reach Readers Requests**: 1 new request awaiting scheduling (*Atelier Écritures*)\n• **Community Moderation**: 0 reported comments in Chapter Circle\n• **Platform Commission Balance (20%)**: $1,180.00 accumulated this period`,
    timestamp,
    suggestedActions: [
      { label: 'Review Veritas Nordic Media', actionType: 'admin_review_publisher' },
      { label: 'Review Campaign Queue', actionType: 'admin_review_campaigns' }
    ]
  };
}
