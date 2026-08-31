const fs = require("fs");
const lemmatizer = require("wink-lemmatizer");

// Change this to your file name
const filePath = "src/core/data/idioms.data.ts";

const content = fs.readFileSync(filePath, "utf8");

const objectRegex = /\{[\s\S]*?\}/g;

const invalidObjects = [];
let alreadyHasPattern = 0;
let needsPattern = 0;

const MAX_GAP = 5;

function getLemma(word) {
  return (
    lemmatizer.verb(word) ||
    lemmatizer.noun(word) ||
    lemmatizer.adjective(word) ||
    lemmatizer.adverb(word) ||
    word
  ).toLowerCase();
}

function tokenize(text) {
  return text.match(/\b[\w'-]+\b/g) || [];
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wordMatches(word, example) {
  const targetLemma = getLemma(word);

  const tokens = tokenize(example);

  return tokens.some((token) => getLemma(token) === targetLemma);
}

function phraseMatches(phrase, example) {
  // Remove leading "To "
  phrase = phrase.replace(/^to\s+/i, "").trim();

  // Normalize hyphens
  phrase = phrase.replace(/-/g, " ");
  example = example.replace(/-/g, " ");

  // Exact match first
  const exactRegex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, "i");

  if (exactRegex.test(example)) {
    return true;
  }

  const phraseWords = tokenize(phrase);
  const exampleWords = tokenize(example);

  if (!phraseWords.length || !exampleWords.length) {
    return false;
  }

  const articles = new Set(["a", "an", "the"]);

  const targetLemma = getLemma(phraseWords[0]);

  const maxGap = Math.max(6, phraseWords.length + 2);

  for (let start = 0; start < exampleWords.length; start++) {
    if (getLemma(exampleWords[start]) !== targetLemma) {
      continue;
    }

    let currentExampleIndex = start;
    let matched = true;

    for (let phraseIndex = 1; phraseIndex < phraseWords.length; phraseIndex++) {
      const phraseWord = phraseWords[phraseIndex].toLowerCase();

      // Ignore articles in idiom
      if (articles.has(phraseWord)) {
        continue;
      }

      let found = false;

      const searchEnd = Math.min(
        currentExampleIndex + maxGap + 1,
        exampleWords.length - 1,
      );

      for (let i = currentExampleIndex + 1; i <= searchEnd; i++) {
        const exampleWord = exampleWords[i].toLowerCase();

        // Ignore articles in example
        if (articles.has(exampleWord)) {
          continue;
        }

        if (exampleWord === phraseWord) {
          currentExampleIndex = i;
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
      return true;
    }
  }

  return false;
}

function suggestHighlightPattern(phrase, example) {
  phrase = phrase.replace(/^to\s+/i, "").trim();

  phrase = phrase.replace(/-/g, " ");
  example = example.replace(/-/g, " ");

  const phraseWords = tokenize(phrase);
  const exampleWords = tokenize(example);

  if (!phraseWords.length || !exampleWords.length) {
    return null;
  }

  const articles = new Set(["a", "an", "the"]);

  const targetLemma = getLemma(phraseWords[0]);

  const maxGap = Math.max(6, phraseWords.length + 2);

  for (let start = 0; start < exampleWords.length; start++) {
    if (getLemma(exampleWords[start]) !== targetLemma) {
      continue;
    }

    let currentExampleIndex = start;
    let endIndex = start;
    let matched = true;

    for (let phraseIndex = 1; phraseIndex < phraseWords.length; phraseIndex++) {
      const phraseWord = phraseWords[phraseIndex].toLowerCase();

      if (articles.has(phraseWord)) {
        continue;
      }

      let found = false;

      const searchEnd = Math.min(
        currentExampleIndex + maxGap + 1,
        exampleWords.length - 1,
      );

      for (let i = currentExampleIndex + 1; i <= searchEnd; i++) {
        const exampleWord = exampleWords[i].toLowerCase();

        if (articles.has(exampleWord)) {
          continue;
        }

        if (exampleWord === phraseWord) {
          currentExampleIndex = i;
          endIndex = i;
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
      return exampleWords.slice(start, endIndex + 1).join(" ");
    }
  }

  return null;
}

let objectMatch;

while ((objectMatch = objectRegex.exec(content)) !== null) {
  const objectText = objectMatch[0];

  const idiomMatch = objectText.match(/idiom:\s*'([^']+)'/);
  const exampleMatch = objectText.match(/example:\s*'([^']+)'/);
  const highlightMatch = objectText.match(/highlightPattern:\s*'([^']+)'/);

  if (!idiomMatch || !exampleMatch) {
    continue;
  }

  const idiom = idiomMatch[1].trim();
  const example = exampleMatch[1];
  const highlightPattern = highlightMatch?.[1];

  const matched = idiom.includes(" ")
    ? phraseMatches(idiom, example)
    : wordMatches(idiom, example);

  if (!matched) {
    const suggestion = suggestHighlightPattern(idiom, example);

    if (highlightPattern) {
      alreadyHasPattern++;
    } else {
      needsPattern++;
    }

    invalidObjects.push({
      idiom,
      example,
      highlightPattern,
      suggestion,
    });
  }
}

if (invalidObjects.length === 0) {
  console.log("✅ Every idiom is automatically highlightable.");
} else {
  console.log(`❌ Found ${invalidObjects.length} object(s):\n`);

  invalidObjects.forEach(({ idiom, example, highlightPattern, suggestion }) => {
    console.log(`Idiom   : ${idiom}`);
    console.log(`Example : ${example}`);

    if (highlightPattern) {
      console.log(`Status  : ✅ highlightPattern already exists`);
      console.log(`Pattern : ${highlightPattern}`);
    } else {
      console.log(`Status  : ❌ Needs highlightPattern`);
    }

    if (suggestion) {
      console.log(`Suggested highlightPattern: '${suggestion}'`);
    }

    console.log("----------------------------------------");
  });

  console.log("\n==============================");
  console.log(`Total Failed        : ${invalidObjects.length}`);
  console.log(`Already Has Pattern : ${alreadyHasPattern}`);
  console.log(`Needs Pattern       : ${needsPattern}`);
  console.log("==============================");
}
