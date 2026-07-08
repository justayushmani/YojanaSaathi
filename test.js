const fs = require('fs');

async function testApi() {
  try {
    const formData = new FormData();
    // create a fake audio blob (webm)
    const blob = new Blob(["fake audio data"], { type: "audio/webm" });
    formData.append("audio", blob, "test.webm");

    const res = await fetch("http://localhost:4000/api/match-voice", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log("API Response:", data);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testApi();
