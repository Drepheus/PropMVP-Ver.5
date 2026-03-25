async function test() {
  const loginRes = await fetch("http://127.0.0.1:3000/api/auth/admin-bypass", {
    method: "POST"
  });
  const cookie = loginRes.headers.get("set-cookie");
  console.log("Cookie:", cookie);

  const searchRes = await fetch("http://127.0.0.1:3000/api/properties/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookie || ""
    },
    body: JSON.stringify({
      address: "123 Test St",
      city: "Testville",
      state: "CA",
      zipCode: "90210"
    })
  });
  console.log("Search status:", searchRes.status);
  const text = await searchRes.text();
  console.log("Search response:", text);
}

test().catch(console.error);
