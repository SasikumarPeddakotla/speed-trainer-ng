const fs = require("fs");

// ----------------------------------------
// Get command-line arguments
// ----------------------------------------

const filePath = process.argv[2];
const property = process.argv[3];

if (!filePath || !property) {
  console.error("❌ Missing arguments.");
  console.log("\nUsage:");
  console.log("node check-duplicates.js <json-file> <property>");
  console.log("\nExample:");
  console.log("node fileDuplicates.js src/core/data/phrasal-verbs.json phrase");
  process.exit(1);
}

// ----------------------------------------
// Read JSON file
// ----------------------------------------

let data;

try {
  const content = fs.readFileSync(filePath, "utf8");
  data = JSON.parse(content);
} catch (error) {
  console.error(`❌ Could not read or parse JSON file: ${filePath}`);
  process.exit(1);
}

// ----------------------------------------
// Validate JSON structure
// ----------------------------------------

if (!Array.isArray(data)) {
  console.error("❌ Expected the JSON file to contain an array.");
  process.exit(1);
}

// ----------------------------------------
// Check duplicates
// ----------------------------------------

const counts = new Map();
let total = 0;
const mismatches = [];
let index = 0;

for (const item of data) {
  if (!Object.prototype.hasOwnProperty.call(item, property)) {
    continue;
  }

  total++;

  const meaningCount = item.meaning?.length ?? 0;
  const exampleCount = item.example?.length ?? 0;

  if (meaningCount !== exampleCount) {
    mismatches.push({
      index: index + 1,
      phrase: item.phrase,
      meaningCount,
      exampleCount,
    });
  }

  const value = item[property];

  // Ignore null/undefined values
  if (value === null || value === undefined) {
    continue;
  }

  // Convert to string so numbers, strings, etc. can be compared
  const key = String(value).trim().toLowerCase();

  counts.set(key, (counts.get(key) || 0) + 1);
}

// ----------------------------------------
// Find duplicates
// ----------------------------------------

const duplicates = [...counts.entries()].filter(([, count]) => count > 1);

// ----------------------------------------
// Display result
// ----------------------------------------

if (mismatches.length === 0) {
  console.log("✅ All entries have the same number of meanings and examples.");
} else {
  console.log(
    `❌ Found ${mismatches.length} entr${
      mismatches.length === 1 ? "y" : "ies"
    } with mismatched lengths:\n`,
  );

  mismatches.forEach((item) => {
    console.log(
      `${item.index}. ${item.phrase} → meanings: ${item.meaningCount}, examples: ${item.exampleCount}`,
    );
  });
}

if (duplicates.length === 0) {
  console.log(
    `\n✅ No duplicate "${property}" values found in ${total} entries.`,
  );
} else {
  console.log(
    `❌ Found ${duplicates.length} duplicate "${property}" value(s) in ${total} entries.\n`,
  );

  duplicates.forEach(([value, count]) => {
    console.log(`${value} (${count} times)`);
  });
}
