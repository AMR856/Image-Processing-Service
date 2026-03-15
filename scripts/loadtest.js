const autocannon = require("autocannon");

const url = process.env.LOADTEST_URL || "http://localhost:5000";

const suites = [
  {
    name: "Get user profile (unprotected for smoke)",
    url: `${url}/users/profile`,
    method: "GET",
  },
  {
    name: "Get images list",
    url: `${url}/images`,
    method: "GET",
  },
];

async function run() {
  for (const suite of suites) {
    console.log(`\n--- Running loadtest: ${suite.name} (${suite.url})`);
    await new Promise((resolve, reject) => {
      const inst = autocannon(
        {
          url: suite.url,
          connections: 20,
          duration: 15,
          method: suite.method,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (err, result) => {
          if (err) return reject(err);
          console.log(autocannon.printResult(result));
          resolve(result);
        }
      );

      autocannon.track(inst, {
        renderProgress: true,
      });
    });
  }

  process.exit(0);
}

run().catch((err) => {
  console.error("Loadtest failed:", err);
  process.exit(1);
});