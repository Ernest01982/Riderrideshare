// Central place to choose the quote provider in the front end (dev/mock only).
import type { QuotePort } from './ports/quote';
import { mockQuote } from './services/mockQuote';
import { devDistanceMatrixQuote } from './services/devDistanceMatrixQuote';

// Toggle with VITE_USE_DEV_DISTANCE_JS=true when Google Maps JS is loaded in dev.
// In production you will replace this with the HTTP provider (server), not the browser SDK.
export const quoteProvider: QuotePort =