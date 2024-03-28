# Dataset Creation for Training a Conversational Agent

This repository contains a script.js to create a dataset that could be used to train a conversational agent which have compatibility with FastChat, following the Vicuna training format.

## Overview

The goal of the Node.js script is to processes and combines data from two sources to create a training dataset that could be used to train a digital assistant powered by LLaMA2 7b, the dataset should be formatted correctly for compatibility with FastChat, following the Vicuna training format for fine-tuning (https://github.com/lm-sys/FastChat?tab=readme-ov-file#fine-tuning). This assistant's goal is to provide users with the relevant product category based on given product data. The dataset created includes:
- Trade-specific Information (JSON File): Contains details about various trades, including product IDs and other product features.
- Product Categorization (Excel Spreadsheet): Lists the same products by ID and names along with their relevant categorizations.


## Description

The provided code is a Node.js script for creating a training dataset for LLaMA2 7b. Here's an explanation of what it does:

1. **Reading Data**: It extracts and parses trade data from a JSON file ('trades.json') and category data from an Excel spreadsheet ('categories.xlsx').

2. **Initializing NLP Tools**: It configures natural language processing tools including tokenization, metaphone, and stemming.

3. **Data Process and Matching**: It handles data by normalizing, tokenizing, and stemming texts. It then uses fuzzy matching to define product categories by comparing product IDs in the trade data to entries in the Excel data.

4. **Creating Dataset**: Using the matching findings, it creates a dataset of discussions between a person and a conversational AI. Each chat comprises information about the product code, its attributes, and the expected product category.

5. **Writing Dataset**: Finally, the created dataset is saved to a JSON file called 'training_dataset.json'.

## Usage

To use this script, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/Nehlr1/Dataset-Creation-for-Training-a-Conversational-Agent.git
   ```
   
2. Install dependencies
    ```
    cd Dataset-Creation-for-Training-a-Conversational-Agent
    npm install fs
    npm install xlsx
    npm install natural
    ```

3. Running the Code
    ```
    node script.js
    ```

## Contributing

Contributions to this repository are welcome. If you find any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue.