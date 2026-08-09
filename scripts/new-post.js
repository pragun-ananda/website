import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\x1b[36m%s\x1b[0m', '\n=== CREATE A NEW BLOG POST ===');
  
  const title = await askQuestion('Enter post title: ');
  if (!title.trim()) {
    console.error('\x1b[31mError: Title is required!\x1b[0m');
    rl.close();
    process.exit(1);
  }

  const description = await askQuestion('Enter description: ');
  const tagsInput = await askQuestion('Enter tags (comma-separated): ');

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const date = new Date().toISOString().split('T')[0];
  const tags = tagsInput
    ? tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const content = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
pubDate: ${date}
tags: ${JSON.stringify(tags)}
---

Write your post content here in Markdown format!
`;

  const targetDir = path.join(process.cwd(), 'src/data/blog');
  const targetFile = path.join(targetDir, `${slug}.md`);

  // Ensure directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (fs.existsSync(targetFile)) {
    console.error(`\x1b[31mError: File already exists at src/data/blog/${slug}.md\x1b[0m`);
  } else {
    fs.writeFileSync(targetFile, content);
    console.log('\n\x1b[32m%s\x1b[0m', `✓ Post created successfully!`);
    console.log(`File: src/data/blog/${slug}.md`);
  }

  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});
