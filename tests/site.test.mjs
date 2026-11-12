import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projects = JSON.parse(readFileSync(resolve(root, 'data/projects.json'), 'utf8'));
const categories = new Set(['research', 'publications', 'ai', 'tools', 'education', 'libraries']);

// Curated static data: GitHub repositories and published Zenodo records.
test('catalog contains unique public source records', () => {
  const ids = new Set();
  const sourceLinks = new Set();
  assert.ok(projects.length > 0);
  for (const item of projects) {
    assert.match(item.id, /^[a-z0-9-]+$/);
    assert.ok(!ids.has(item.id), "Duplicate item id: " + item.id);
    ids.add(item.id);
    assert.ok(categories.has(item.category));
    assert.ok(['original', 'fork', 'research', 'repository', 'publication'].includes(item.kind));
    assert.ok(item.description.pt.trim() && item.description.en.trim());
    assert.ok(Array.isArray(item.tags) && item.tags.length > 0);
    if (item.website) assert.match(item.website, /^https:\/\//);
    if (item.kind === 'publication') {
      assert.equal(item.source, 'zenodo');
      assert.equal(item.category, 'publications');
      assert.match(item.doi, /^10\.5281\/zenodo\.[0-9]+$/);
      const recordId = item.doi.split('.').at(-1);
      assert.equal(item.website, 'https://zenodo.org/records/' + recordId);
      assert.equal(item.repository, undefined);
      assert.ok(!sourceLinks.has(item.website), "Duplicate Zenodo record: " + item.website);
      sourceLinks.add(item.website);
    } else {
      assert.match(item.repository, /^https:\/\/github\.com\/cecil-ia-labs\/[a-z0-9-]+$/i);
      assert.ok(!sourceLinks.has(item.repository), "Duplicate repository URL: " + item.repository);
      sourceLinks.add(item.repository);
    }
  }
});

test('the two requested Zenodo versions are cataloged separately from their source code', () => {
  const ids = projects.filter(item => item.source === 'zenodo').map(item => item.doi).sort();
  assert.deepEqual(ids, ['10.5281/zenodo.22249025', '10.5281/zenodo.23968974']);
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
