import { storage } from './server/storage.ts';

async function run() {
  try {
    const res = await storage.searchProperty({
      address: "123 Main St",
      city: "Test",
      state: "CA",
      zipCode: "12345"
    });
    console.log("Success:", res);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
