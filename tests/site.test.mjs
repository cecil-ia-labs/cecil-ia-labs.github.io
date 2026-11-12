import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projects = JSON.parse(readFileSync(resolve(root, 'data/projects.json'), 'utf8'));
const categories = new Set(['research', 'ai', 'tools', 'education', 'libraries']);

// Curated static data; do not expose private repositories or infer status from repo names.
test('catalog has unique public GitHub repository URLs', () => {
  const ids = new Set();
  const repos = new Set();
  assert.ok(projects.length > 0);
  for (const project of projects) {
    assert.match(project.id, /^[a-z0-9-]+$/);
    assert.ok(!ids.has(project.id), `Duplicate project id: ${project.id}`);
    ids.add(project.id);
    assert.match(project.repository, /^https:\/\/github\.com\/cecil-ia-labs\/[a-z0-9-]+$/i);
    assert.ok(!repos.has(project.repository), `Duplicate repo URL: ${project.repository}`);
    repos.add(project.repository);
    assert.ok(categories.has(project.category));
    assert.ok(['original', 'fork', 'research', 'repository'].includes(project.kind));
    assert.ok(project.description.pt.trim() && project.description.en.trim());
    assert.ok(Array.isArray(project.tags) && project.tags.length > 0);
    if (project.website) assert.match(project.website, /^https:\/\//);
  }
});

test('main entrypoints and assets exist', () => {
  for (const file of ['index.html', '404.html', 'styles.css', 'scripts/app.js', 'assets/favicon.svg', 'robots.txt', 'sitemap.xml', '.nojekyll']) {
    assert.ok(existsSync(resolve(root, file)), `Missing ${file}`);
  }
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  assert.match(html, /<html lang="pt-BR">/);
  const app = readFileSync(resolve(root, 'scripts/app.js'), 'utf8');
  assert.match(app, /data\/projects\.json/);
  assert.doesNotMatch(html, /<script[^>]*src="https?:\/\//);
});

test('light theme keeps its intentional warm-vivid palette', () => {
  const css = readFileSync(resolve(root, 'styles.css'), 'utf8');
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  for (const hex of ['#ff7a63', '#e445a2', '#7a5cff', '#0d1438']) {
    assert.ok(css.toLowerCase().includes(hex), `Missing brand hue ${hex}`);
  }
  assert.match(css, /color-scheme:\s*light/i);
  assert.match(html, /name="color-scheme" content="light"/);
  assert.match(html, /name="theme-color" content="#fcfaff"/);
});
