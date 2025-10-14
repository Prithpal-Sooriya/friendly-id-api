import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";

const __dirname = dirname(import.meta.path);


async function nounsTxtGen() {
    const inputPath = join(__dirname, "nouns.txt");
    const text = await readFile(inputPath, "utf8");
    const nouns = text
        .split("\n")
        .map((n) => n.trim())
        .filter((n) => n && n.length <= 5);

    return nouns
}

async function nounsSafeTxtGen() {
    const inputPath = join(__dirname, "nouns-safe.txt");
    const text = await readFile(inputPath, "utf8");
    const nouns = text
        .split("\n")
        .map((line) => line.trim().split("\t")[1]) // get the word (skip code)
        .filter((word) => word && word.length <= 5);

    return nouns
}

async function safeWordsGPTFilterTxtGen() {
    const inputPath = join(__dirname, "safe_words_gpt_filter.txt");
    const text = await readFile(inputPath, "utf8");
    const nouns = text
        .split("\n")
        .map((n) => n.trim())
        .filter((n) => n && n.length <= 5);

    return nouns
}

async function main() {
    const outputPath = join(__dirname, "short-nouns.json");
    // const nouns = await nounsTxtGen()
    // const nouns = await nounsSafeTxtGen()
    const nouns = await safeWordsGPTFilterTxtGen()

    await writeFile(outputPath, JSON.stringify(nouns, null, 2), "utf8");

    console.log(`✅ Wrote ${nouns.length} short nouns to ${outputPath}`);
}

main().catch((err) => {
    console.error("❌ Error:", err);
});
