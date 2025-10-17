#!/usr/bin/env node
const { generateCompliantPrompt, generateDetailedPrompt } = require('../lib/mock');

const args = process.argv.slice(2);
const idea = args[0] || 'Unboxing de produto para propaganda';
const target = args.includes('--target') ? args[args.indexOf('--target')+1] : (args[1] || 'veo-3');
const imageRef = args.includes('--image') ? args[args.indexOf('--image')+1] : args[2];
const detailed = args.includes('--detailed');

const out = detailed ? generateDetailedPrompt(idea, { steps: 3, imageRef }) : generateCompliantPrompt(idea, { steps: 3, imageRef });
console.log('=== Revised ===');
console.log(out.revised);
console.log('\n=== Platform prompt (' + target + ') ===');
console.log(out.structured.platformHints[target].prompt);
