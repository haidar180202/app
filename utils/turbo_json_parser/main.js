import fs from 'fs/promises';
import readline from 'readline';

async function main() {
  const filter = 'miss';
  const args = process.argv.slice(2);

  let jsonData = '';

  if (args.length > 0) {
    const filePath = args[0];
    const fileContent = await fs.readFile(filePath, 'utf8');
    const lines = fileContent.split('\n');

    // Find the first JSON line
    const startIndex = lines.findIndex(line => line.includes('{'));
    if (startIndex === -1) {
      console.error("No JSON object found in the file.");
      process.exit(1);
    }
    jsonData = lines.slice(startIndex).join('\n');
  } else {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    for await (const line of rl) {
      if (line.includes('{') || jsonData) {
        jsonData += line + '\n';
      }
    }
  }
  let parsedJson;
  try {
    parsedJson = JSON.parse(jsonData);
  } catch (err) {
    console.error("Failed to parse JSON:", err.message);
    console.error("JSON Data:", jsonData);
    process.exit(1);
  }

  const filteredApps = parsedJson.tasks
    .filter(task =>
      task.cache.status.toLowerCase() === filter &&
      !task.package.startsWith('@package/')
    )
    .map(task => task.package);

  const outputJson = {
    apps: filteredApps,
  };

  const outputJsonString = JSON.stringify(outputJson, null, 4);
  console.log(outputJsonString);

  await fs.writeFile('apps_changes.json', outputJsonString);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
