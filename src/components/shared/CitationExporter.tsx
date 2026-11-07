'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CitationExporterProps {
  title: string;
  year: string;
  publisherOrJournal: string;
  identifier?: string;
  url?: string;
}

export function CitationExporter({
  title,
  year,
  publisherOrJournal,
  identifier,
}: CitationExporterProps) {
  const [format, setFormat] = useState<'APA' | 'BibTeX'>('APA');
  const [copied, setCopied] = useState(false);

  const apaCitation = `Kingsly, K. M. (${year}). ${title}. ${publisherOrJournal}.${
    identifier ? ` Ref.: ${identifier}.` : ''
  }`;

  const bibtexKey = `kingsly${year}${title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12)}`;

  const bibtexCitation = `@book{${bibtexKey},
  author    = {Kingsly, Kelly Mua},
  title     = {${title}},
  year      = {${year}},
  publisher = {${publisherOrJournal}},
  note      = {${identifier || 'Institutional Edition'}}
}`;

  const activeText = format === 'APA' ? apaCitation : bibtexCitation;

  function handleCopy() {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-surface-paper border border-surface-border p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-700">
          Bibliographic Citation
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setFormat('APA')}
            className={`min-h-[44px] sm:min-h-[34px] px-3.5 sm:px-2.5 py-2 sm:py-1 text-xs font-semibold active:scale-95 transition-all ${
              format === 'APA'
                ? 'bg-navy-900 text-gold-400'
                : 'bg-white text-ink-500 border border-surface-border hover:text-navy-900'
            }`}
          >
            APA 7th
          </button>
          <button
            type="button"
            onClick={() => setFormat('BibTeX')}
            className={`min-h-[44px] sm:min-h-[34px] px-3.5 sm:px-2.5 py-2 sm:py-1 text-xs font-semibold active:scale-95 transition-all ${
              format === 'BibTeX'
                ? 'bg-navy-900 text-gold-400'
                : 'bg-white text-ink-500 border border-surface-border hover:text-navy-900'
            }`}
          >
            BibTeX
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] sm:min-h-[34px] px-3.5 sm:px-2.5 py-2 sm:py-1 text-xs font-semibold bg-white border border-surface-border text-navy-900 hover:border-navy-900 active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-semibold text-emerald-800">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="text-xs font-mono text-ink-700 bg-white p-3.5 border border-surface-border overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
        {activeText}
      </pre>
    </div>
  );
}
