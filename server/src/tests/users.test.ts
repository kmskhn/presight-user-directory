import { describe, it, expect, beforeAll } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../app.js';
import { runMigrations } from '../db/migrate.js';

// Ensure DB is seeded before tests run
beforeAll(() => {
  runMigrations();
});

const app = createApp();
const request = supertest(app);

describe('GET /api/users', () => {
  it('returns paginated users with correct shape', async () => {
    const res = await request.get('/api/users?limit=5').expect(200);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.pagination.hasMore).toBe(true);
    expect(res.body.pagination.nextCursor).toBeTruthy();
    expect(res.body.facets.hobbies).toBeInstanceOf(Array);
    expect(res.body.facets.nationalities).toBeInstanceOf(Array);

    const user = res.body.data[0];
    expect(user).toMatchObject({
      id: expect.any(Number),
      avatar: expect.stringContaining('pravatar.cc'),
      firstName: expect.any(String),
      lastName: expect.any(String),
      age: expect.any(Number),
      nationality: expect.any(String),
      hobbies: expect.any(Array),
    });
  });

  it('search filter returns only matching names', async () => {
    const res = await request.get('/api/users?search=john&limit=10').expect(200);
    for (const user of res.body.data) {
      const matches =
        user.firstName.toLowerCase().startsWith('john') ||
        user.lastName.toLowerCase().startsWith('john');
      expect(matches).toBe(true);
    }
  });

  it('nationality filter (OR) returns users from any selected nationality', async () => {
    const res = await request.get('/api/users?nationalities=US,UK&limit=20').expect(200);
    for (const user of res.body.data) {
      expect(['US', 'UK']).toContain(user.nationality);
    }
  });

  it('hobby filter (AND) returns users with ALL selected hobbies', async () => {
    const res = await request.get('/api/users?hobbies=reading,cooking&limit=10').expect(200);
    for (const user of res.body.data) {
      expect(user.hobbies).toContain('reading');
      expect(user.hobbies).toContain('cooking');
    }
  });

  it('combined filters work together', async () => {
    const res = await request
      .get('/api/users?search=a&nationalities=US&hobbies=gaming&limit=5')
      .expect(200);
    for (const user of res.body.data) {
      const nameMatches =
        user.firstName.toLowerCase().startsWith('a') ||
        user.lastName.toLowerCase().startsWith('a');
      expect(nameMatches).toBe(true);
      expect(user.nationality).toBe('US');
      expect(user.hobbies).toContain('gaming');
    }
  });

  it('cursor pagination returns next page without duplicates', async () => {
    const page1 = await request.get('/api/users?limit=5').expect(200);
    const cursor = page1.body.pagination.nextCursor;
    const page1Ids = page1.body.data.map((u: { id: number }) => u.id);

    const page2 = await request.get(`/api/users?limit=5&cursor=${cursor}`).expect(200);
    const page2Ids = page2.body.data.map((u: { id: number }) => u.id);

    // No duplicates between pages
    const overlap = page1Ids.filter((id: number) => page2Ids.includes(id));
    expect(overlap).toHaveLength(0);

    // Page 2 starts after page 1
    expect(page2Ids.length).toBeGreaterThan(0);
  });

  it('sort by age DESC works correctly', async () => {
    const res = await request.get('/api/users?sortBy=age&sortDir=desc&limit=10').expect(200);
    const ages: number[] = res.body.data.map((u: { age: number }) => u.age);
    for (let i = 1; i < ages.length; i++) {
      expect(ages[i]).toBeLessThanOrEqual(ages[i - 1]!);
    }
  });

  it('sort by last_name ASC with cursor — no duplicates across pages', async () => {
    const page1 = await request.get('/api/users?sortBy=last_name&sortDir=asc&limit=10').expect(200);
    const cursor = page1.body.pagination.nextCursor;

    const page2 = await request
      .get(`/api/users?sortBy=last_name&sortDir=asc&limit=10&cursor=${cursor}`)
      .expect(200);

    const allIds = [
      ...page1.body.data.map((u: { id: number }) => u.id),
      ...page2.body.data.map((u: { id: number }) => u.id),
    ];
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it('facet counts reflect all active filters (spec-literal)', async () => {
    // With no filters, counts should be large
    const noFilter = await request.get('/api/users?limit=1').expect(200);
    const totalHobbyCount = noFilter.body.facets.hobbies[0]?.count ?? 0;

    // With a nationality filter, hobby facet counts should be smaller
    const withFilter = await request.get('/api/users?nationalities=US&limit=1').expect(200);
    const filteredHobbyCount = withFilter.body.facets.hobbies[0]?.count ?? 0;

    expect(filteredHobbyCount).toBeLessThan(totalHobbyCount);
  });

  it('facet counts have max 20 items', async () => {
    const res = await request.get('/api/users?limit=1').expect(200);
    expect(res.body.facets.hobbies.length).toBeLessThanOrEqual(20);
    expect(res.body.facets.nationalities.length).toBeLessThanOrEqual(20);
  });

  it('returns empty data array with no results', async () => {
    const res = await request
      .get('/api/users?search=zzzzzzzzzzzzzzzzz&limit=10')
      .expect(200);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.pagination.hasMore).toBe(false);
    expect(res.body.pagination.nextCursor).toBeNull();
  });

  it('validation rejects invalid sortBy', async () => {
    const res = await request.get('/api/users?sortBy=invalid').expect(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('validation rejects limit > 100', async () => {
    const res = await request.get('/api/users?limit=999').expect(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('LIKE special characters in search are handled safely', async () => {
    const res = await request.get('/api/users?search=%25').expect(200);
    expect(res.body.data).toHaveLength(0); // No names start with '%'
  });
});
