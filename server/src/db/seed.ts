import { faker } from '@faker-js/faker';
import { sqlite } from './index.js';
import { runMigrations } from './migrate.js';

const SEED = 42;
const TOTAL_USERS = 10_000;

const HOBBIES = [
  'reading', 'cooking', 'hiking', 'photography', 'painting', 'gaming',
  'gardening', 'cycling', 'swimming', 'yoga', 'meditation', 'traveling',
  'dancing', 'singing', 'playing guitar', 'playing piano', 'drawing',
  'sculpting', 'knitting', 'sewing', 'woodworking', 'fishing', 'hunting',
  'birdwatching', 'astronomy', 'chess', 'writing', 'blogging', 'podcasting',
  'coding', 'robotics', 'electronics', 'archery', 'martial arts', 'rock climbing',
  'skateboarding', 'surfing', 'skiing', 'snowboarding', 'running', 'weightlifting',
  'crossfit', 'pilates', 'boxing', 'kayaking', 'sailing', 'horse riding',
  'pottery', 'origami',
];

const NATIONALITIES = [
  'US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'CN',
  'IN', 'BR', 'MX', 'KR', 'NL', 'SE', 'NO', 'DK', 'FI', 'CH',
  'AT', 'BE', 'PT', 'PL', 'CZ', 'RU', 'ZA', 'AR', 'NG', 'EG',
];

function seed() {
  faker.seed(SEED);
  runMigrations();

  // Check if already seeded
  const count = sqlite.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number };
  if (count.c >= TOTAL_USERS) {
    console.log(`✅ Database already seeded with ${count.c} users. Skipping.`);
    return;
  }

  console.log('🌱 Seeding database...');
  const start = Date.now();

  // Insert hobbies lookup
  const insertHobby = sqlite.prepare('INSERT OR IGNORE INTO hobbies (name) VALUES (?)');
  for (const hobby of HOBBIES) {
    insertHobby.run(hobby);
  }

  // Get hobby ID map
  const hobbyRows = sqlite.prepare('SELECT id, name FROM hobbies').all() as { id: number; name: string }[];
  const hobbyIdMap = new Map(hobbyRows.map((h) => [h.name, h.id]));

  // Insert users + hobbies in batches
  const insertUser = sqlite.prepare(
    'INSERT INTO users (avatar, first_name, last_name, age, nationality) VALUES (?, ?, ?, ?, ?)',
  );
  const insertUserHobby = sqlite.prepare('INSERT OR IGNORE INTO user_hobbies (user_id, hobby_id) VALUES (?, ?)');

  const BATCH_SIZE = 500;

  const insertBatch = sqlite.transaction((batch: Array<{
    firstName: string;
    lastName: string;
    age: number;
    nationality: string;
    userHobbies: string[];
  }>) => {
    for (const user of batch) {
      const result = insertUser.run(
        // placeholder: avatar assigned after insert using user id
        '',
        user.firstName,
        user.lastName,
        user.age,
        user.nationality,
      );
      const userId = result.lastInsertRowid as number;

      // Update avatar with the real userId for deterministic pravatar URL
      sqlite.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(
        `https://i.pravatar.cc/150?u=${userId}`,
        userId,
      );

      for (const hobbyName of user.userHobbies) {
        const hobbyId = hobbyIdMap.get(hobbyName);
        if (hobbyId != null) {
          insertUserHobby.run(userId, hobbyId);
        }
      }
    }
  });

  for (let i = 0; i < TOTAL_USERS; i += BATCH_SIZE) {
    const batch = [];
    for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_USERS; j++) {
      // Weighted hobby count: most users have 1-5 hobbies
      const hobbyCount = faker.helpers.weightedArrayElement([
        { weight: 5, value: 0 },
        { weight: 20, value: 1 },
        { weight: 25, value: 2 },
        { weight: 20, value: 3 },
        { weight: 15, value: 4 },
        { weight: 10, value: 5 },
        { weight: 3, value: 6 },
        { weight: 1, value: 7 },
        { weight: 1, value: 8 },
      ]);

      const userHobbies = faker.helpers.arrayElements(HOBBIES, hobbyCount);

      batch.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 80 }),
        nationality: faker.helpers.arrayElement(NATIONALITIES),
        userHobbies,
      });
    }

    insertBatch(batch);

    if ((i / BATCH_SIZE) % 5 === 0) {
      console.log(`  Inserted ${Math.min(i + BATCH_SIZE, TOTAL_USERS)} / ${TOTAL_USERS} users...`);
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`✅ Seeded ${TOTAL_USERS} users in ${elapsed}s`);
}

seed();
