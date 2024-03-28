const fs = require("fs");
const xlsx = require("xlsx");
const natural = require("natural");

// Step 1: Reading and parsing the JSON file
const tradeData = JSON.parse(fs.readFileSync("./trades.json"));

// Step 2: Reading and parsing the Excel spreadsheet
const workbook = xlsx.readFile("./categories.xlsx");
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const excelData = xlsx.utils.sheet_to_json(worksheet);

// Step 3: Initializing natural language processing tools
const tokenizer = new natural.WordTokenizer();
const metaphone = natural.Metaphone;
const stemmer = natural.PorterStemmer;

// Function to normalize and tokenize text
function normalizeAndTokenize(text) {
    // Converting to lowercase
    text = text.toLowerCase();
    // Tokenizing the text
    return tokenizer.tokenize(text);
}

// Function to perform fuzzy matching based on normalized text
function fuzzyMatchNormalized(text1, text2) {
    // Normalizing and tokenizing both texts
    const tokens1 = normalizeAndTokenize(text1);
    const tokens2 = normalizeAndTokenize(text2);
    // Comparing tokens using Metaphone
    return tokens1.some(token1 => tokens2.some(token2 => metaphone.compare(token1, token2)));
}

// Function to apply stemming to tokens
function applyStemming(tokens) {
    // Checking if tokens is an array
    if (Array.isArray(tokens)) {
        return tokens.map(token => stemmer.stem(token));
    } else {
        return tokens;
    }
}

// Step 4: Performing fuzzy matching to match product IDs between JSON and Excel data
const dataset = [];

tradeData.products.forEach(product => {
    const productID = product.productCode;
    let categoryEntry;

    // Performing fuzzy matching based on product code after applying stemming
    categoryEntry = excelData.find(entry => fuzzyMatchNormalized(applyStemming(entry.ISIN), applyStemming(productID)));

    const productFeatures = Object.entries(product)
            .filter(([key, value]) => key !== "productCode")
            .map(([key, value]) => `${key} is ${value}`)
            .join(", ");

    if (categoryEntry) {
        const conversation = [
            { from: "human", value: `The productCode is ${productID}, ${productFeatures}` },
            { from: "gpt", value: `The product category is ${categoryEntry.type}` }
        ];

        dataset.push({ id: `identity_${dataset.length}`, conversations: conversation });
    } else {
        console.log(`No category found for product with ID ${productID}`);
        const conversation = [
            { from: "human", value: `The productCode is ${productID}, ${productFeatures}` },
            { from: "gpt", value: `No category found for product with ID ${productID}` }
        ];
        dataset.push({ id: `identity_${dataset.length}`, conversations: conversation });
    }
});

// Step 5: Writing the dataset to a JSON file
fs.writeFileSync("training_dataset.json", JSON.stringify(dataset, null, 2));

console.log("Dataset creation completed.");