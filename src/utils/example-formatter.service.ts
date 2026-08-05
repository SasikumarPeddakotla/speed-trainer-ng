import { Injectable } from '@angular/core';
import lemmatizer from 'wink-lemmatizer';

@Injectable({
  providedIn: 'root',
})
export class ExampleFormatterService {
  getLemma(word: string): string {
    return (
      lemmatizer.verb(word) ||
      lemmatizer.noun(word) ||
      lemmatizer.adjective(word) ||
      lemmatizer.adverb(word) ||
      word
    ).toLowerCase();
  }

  formatExample(
    text: string,
    example: string,
    highlightPattern?: string,
  ): string {
    const formatted = text.includes(' ')
      ? this.formatPhrase(text, example)
      : this.formatWord(text, example);

    // Automatic match succeeded
    if (formatted !== example) {
      return formatted;
    }

    // Try manual fallback
    if (highlightPattern) {
      const escaped = highlightPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      return example.replace(
        new RegExp(escaped, 'i'),
        '<u><strong>$&</strong></u>',
      );
    }

    return example;
  }

  formatWord(word: string, example: string): string {
    const targetLemma = this.getLemma(word);

    const tokens = example.match(/\b[\w'-]+\b/g);

    if (!tokens) {
      return example;
    }

    for (const token of tokens) {
      if (this.getLemma(token) === targetLemma) {
        const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const regex = new RegExp(`\\b${escaped}\\b`, 'g');

        return example.replace(regex, '<u><strong>$&</strong></u>');
      }
    }

    return example;
  }

  formatPhrase(phrase: string, example: string): string {
    // Remove leading "To "
    phrase = phrase.replace(/^to\s+/i, '').trim();

    // Normalize hyphens
    phrase = phrase.replace(/-/g, ' ');
    example = example.replace(/-/g, ' ');

    // Try exact phrase match first
    const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const exactRegex = new RegExp(`\\b${escapedPhrase}\\b`, 'i');

    if (exactRegex.test(example)) {
      return example.replace(exactRegex, '<u><strong>$&</strong></u>');
    }

    const phraseWords = phrase.match(/\b[\w']+\b/g);
    const exampleWords = example.match(/\b[\w']+\b/g);

    if (!phraseWords || !exampleWords || phraseWords.length === 0) {
      return example;
    }

    const targetLemma = this.getLemma(phraseWords[0]);

    const articles = new Set(['a', 'an', 'the']);

    // Allow a slightly larger gap for longer idioms
    const MAX_GAP = Math.max(6, phraseWords.length + 2);

    for (let start = 0; start < exampleWords.length; start++) {
      if (this.getLemma(exampleWords[start]) !== targetLemma) {
        continue;
      }

      let currentExampleIndex = start;
      let endIndex = start;
      let matched = true;

      for (
        let phraseIndex = 1;
        phraseIndex < phraseWords.length;
        phraseIndex++
      ) {
        const phraseWord = phraseWords[phraseIndex].toLowerCase();

        // Ignore articles in idiom
        if (articles.has(phraseWord)) {
          continue;
        }

        let found = false;

        const searchEnd = Math.min(
          currentExampleIndex + MAX_GAP + 1,
          exampleWords.length - 1,
        );

        for (
          let exampleIndex = currentExampleIndex + 1;
          exampleIndex <= searchEnd;
          exampleIndex++
        ) {
          const exampleWord = exampleWords[exampleIndex].toLowerCase();

          // Ignore articles in sentence
          if (articles.has(exampleWord)) {
            continue;
          }

          if (exampleWord === phraseWord) {
            currentExampleIndex = exampleIndex;
            endIndex = exampleIndex;
            found = true;
            break;
          }
        }

        if (!found) {
          matched = false;
          break;
        }
      }

      if (matched) {
        const matchedPhrase = exampleWords.slice(start, endIndex + 1).join(' ');

        const escaped = matchedPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        return example.replace(
          new RegExp(escaped, 'i'),
          '<u><strong>$&</strong></u>',
        );
      }
    }

    return example;
  }
}
