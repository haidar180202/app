import { promises as fs } from "fs";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

async function checkPortAvailability(rootDir, newPort) {
  try {
    // Read docker-compose.yml
    const composeFile = await fs.readFile(join(rootDir, "docker-compose.yml"), "utf-8");

    // Look for port mappings in the format "port:80"
    const portRegex = /(\d+):80/g;
    const existingPorts = [];
    let match;

    while ((match = portRegex.exec(composeFile)) !== null) {
      existingPorts.push(match[1]);
    }

    // Check if the new port already exists
    if (existingPorts.includes(newPort)) {
      throw new Error(`Port ${newPort} is already in use by another project`);
    }

    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If docker-compose.yml doesn't exist yet, port is available
      return true;
    }
    throw error;
  }
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function slugify(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Add underscore between camelCase
    .replace(/[\s-]+/g, '_')             // Replace spaces and hyphens with underscores
    .replace(/[^\w_]+/g, '')             // Remove non-word characters
    .toLowerCase();                      // Convert to lowercase
}

async function copyDirectory(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

const appendRemote = async (shellDir, name, url) => {
  const filePath = shellDir + '/src/config/modules.config.ts'
  try {
    // Read the file content
    let fileContent = await fs.readFile(filePath, 'utf8');

    // Flexible regex to locate the `remotesLocal` array
    const arrayMatch = fileContent.match(/remotesLocal\s*:\s*RemoteConfig\[\]\s*=\s*\[\s*([\s\S]*?)\s*\];/);

    if (arrayMatch) {
      const arrayContent = arrayMatch[1].trim();
      const newObjectString = `
        {
          name: '${name}',
          url: \`${url}\`
        }
        `;

      // Insert the new object, ensuring trailing commas are handled
      const updatedArray = arrayContent.endsWith(',')
        ? `${arrayContent}\n  ${newObjectString},`
        : arrayContent
          ? `${arrayContent},\n  ${newObjectString}`
          : newObjectString;

      // Replace the old array in the file content
      fileContent = fileContent.replace(
        /remotesLocal\s*:\s*RemoteConfig\[\]\s*=\s*\[\s*([\s\S]*?)\s*\];/,
        `remotesLocal: RemoteConfig[] = [\n${updatedArray}\n];`
      );

      // Write the updated content back to the file
      await fs.writeFile(filePath, fileContent, 'utf8');
      console.log(`Successfully appended to remotesLocal:`, name);
    } else {
      console.error('remotesLocal array not found!');
    }
  } catch (error) {
    console.error('Error reading or writing the file:', error);
  }
};


async function generateApp() {
  // Capture project name from command-line arguments
  const projectName = process.argv[2];
  if (!projectName) {
    return console.error("Need Project Name");
  }

  // Check if project name starts with a number
  if (/^\d/.test(projectName)) {
    return console.error("❌ Error: Project name cannot start with a number. Please use a valid project name.");
  }

  if (!process.argv[3]) {
    console.log("NO PORT ADDED, WILL USE DEFAULT PORT '3000'")
  }

  const port = process.argv[3] || "3000";
  const noFormat = process.argv.includes("--no-format");

  const rootDir = process.cwd();

  // Check port availability before proceeding
  try {
    await checkPortAvailability(rootDir, port);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Please choose a different port and try again.");
    return;
  }
  const targetDir = join(rootDir, "apps", slugify(projectName));
  const shellDir = join(rootDir, "apps", "web-root");
  const skeletonDir = join(rootDir, "apps", "web_remote");

  // Copy skeleton folder to target directory
  await copyDirectory(skeletonDir, targetDir);

  // Update package.json with the new project name
  const packageJsonPath = join(targetDir, "package.json");
  const packageJsonData = await fs.readFile(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(packageJsonData);
  packageJson.name = slugify(projectName);
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Create or update .env file
  const envPath = join(targetDir, ".env.development.local");

  const envContent = `
APP_PROJECT_NAME=${slugify(projectName)}
APP_PORT=${port}

PUBLIC_PATH_MODULE=${slugify(projectName)}

PUBLIC_API_URL=""
PUBLIC_AUTH_API_URL=""
`;

  await fs.writeFile(envPath, envContent);

  // Update route.module.tsx with new line
  const routeModulePath = join(shellDir, "src", "routes", "route.module.tsx");
  const routeModuleData = await fs.readFile(routeModulePath, "utf-8");

  const addModule = `
    export const ${capitalizeFirstLetter(projectName)} = lazy(() =>
        import("${slugify(projectName)}/app").catch(() => {
            return { default: () => <ErrLoadModule /> };
        }),
    );`;

  // Write back the updated content to `route.module.tsx`
  if (!routeModuleData.includes(addModule)) {
    const updatedRouteModule = routeModuleData + "\n" + addModule;
    await fs.writeFile(routeModulePath, updatedRouteModule);
  }

  // Run Prettier to format all relevant files if no --no-format
  await appendRemote(shellDir, slugify(projectName), `http://localhost:${port}`)
  if (!noFormat) {
    const filePath = shellDir + '/src/config/modules.config.ts'
    try {
      await execPromise(`prettier --write "${targetDir}**/*.{ts,tsx,md}" "${filePath}" "${routeModulePath}"`);
      console.log(`✅ Prettier has formatted the files successfully!`);
    } catch (error) {
      console.error("❌ Prettier formatting failed:", error);
    }
  }

  // adding new services nginx
  const composeFile = await fs.readFile(join(rootDir, "docker-compose.yml"), "utf-8")
  const composeWrite = `
  ${projectName.toLowerCase()}:
    build:
      context: ./apps/${slugify(projectName)}
      dockerfile: Dockerfile
    ports:
      - "${port}:80"
    hostname: ${slugify(projectName)}
    networks:
      - app-network
    `
  await fs.writeFile(join(rootDir, "docker-compose.yml"), composeFile + composeWrite)

  console.log(asciiArts[Math.floor(Math.random() * asciiArts.length)]);
  console.log(`✅ Project "${projectName}" generated successfully!`);
  console.log(`👉 cd ${targetDir} && pnpm install`);
  console.log(`👉 any configuration using rsbuild.config.ts (rsbuild.dev)`);
  console.log(`👉 add your app to web-root on web-root/src/routes`);
  console.log(`👉 change your basename route on ${slugify(projectName)}/src/routes/route.tsx`);
  console.log(`👉 change your PUBLIC_API_URL on .env`);
}

generateApp().catch((error) => {
  console.error("❌ Failed to generate app:", error);
});



const asciiArts = [
  `
⢕⢕⢕⢕⠁⢜⠕⢁⣴⣿⡇⢓⢕⢵⢐⢕⢕⠕⢁⣾⢿⣧⠑⢕⢕⠄⢑⢕⠅⢕
⢕⢕⠵⢁⠔⢁⣤⣤⣶⣶⣶⡐⣕⢽⠐⢕⠕⣡⣾⣶⣶⣶⣤⡁⢓⢕⠄⢑⢅⢑
⠍⣧⠄⣶⣾⣿⣿⣿⣿⣿⣿⣷⣔⢕⢄⢡⣾⣿⣿⣿⣿⣿⣿⣿⣦⡑⢕⢤⠱⢐
⢠⢕⠅⣾⣿⠋⢿⣿⣿⣿⠉⣿⣿⣷⣦⣶⣽⣿⣿⠈⣿⣿⣿⣿⠏⢹⣷⣷⡅⢐
⣔⢕⢥⢻⣿⡀⠈⠛⠛⠁⢠⣿⣿⣿⣿⣿⣿⣿⣿⡀⠈⠛⠛⠁⠄⣼⣿⣿⡇⢔
⢕⢕⢽⢸⢟⢟⢖⢖⢤⣶⡟⢻⣿⡿⠻⣿⣿⡟⢀⣿⣦⢤⢤⢔⢞⢿⢿⣿⠁⢕
⢕⢕⠅⣐⢕⢕⢕⢕⢕⣿⣿⡄⠛⢀⣦⠈⠛⢁⣼⣿⢗⢕⢕⢕⢕⢕⢕⡏⣘⢕
⢕⢕⠅⢓⣕⣕⣕⣕⣵⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣷⣕⢕⢕⢕⢕⡵⢀⢕⢕
⢑⢕⠃⡈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢃⢕⢕⢕
⣆⢕⠄⢱⣄⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢁⢕⢕⠕⢁
`,
  `
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⡿⠊⠀⠀⠀⠀⠀⠀⠀⣠⣾⣆⠀⠺⠙⢿⣿⣿⣿
⣿⣿⣿⣿⣿⢿⣿⣟⢿⢯⠟⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⡀⠀⠀⠉⢿⣿⣿
⣿⣿⣿⣷⣶⠄⡀⠉⠂⡞⠀⠀⠀⠀⠀⢠⠀⣰⣿⣿⣿⣿⣿⣇⠀⠀⠀⢸⣿⣿
⣿⣿⢛⡿⣿⣷⣄⠀⠀⠀⠀⡀⠀⠀⢀⡆⣰⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⣿⣿
⣿⣿⣯⠿⣣⣝⢿⣷⣄⢀⣀⡇⠀⠀⣸⣷⡟⢩⣿⣿⣿⣿⣿⣿⣼⠀⠀⠀⣿⣿
⣿⣿⡫⣾⣿⡟⠁⠙⢿⢶⢺⠃⠀⢀⣿⣿⠀⣿⣿⣿⣿⣿⣿⠃⣾⠀⠀⢸⣿⣿
⣿⣿⣿⣝⠋⠀⠀⠀⠁⠨⣝⠀⠀⢸⣿⣯⣼⣿⣿⣿⣿⣿⡏⣸⡿⠀⠀⡼⢻⣽⣍
⣿⣿⣿⣿⡇⡀⠀⠀⠀⠀⠈⡄⠀⡈⡻⣿⣿⢻⣽⣻⣿⣿⣴⡿⠽⠀⠀⠀⠈⢻⣿
⣿⣿⣿⣿⣷⣵⠀⠀⠀⠀⠀⠸⡀⣿⣞⢦⣍⡊⠿⠵⠿⠿⠛⠁⠀⠀⠀⠀⢀⣴
⣿⣿⣿⣿⣿⣮⡣⡀⠀⠀⠀⠀⢧⣿⣿⣷⣝⢟⣵⣿⣇⠀⠀⠀⠀⠀⣠⣾⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣶⣦⠀⠀⠀⠀⠀⠀⠠⠀⠀⢌⠉⠙⠀⠀⣀⣴⣿
`,
  `
⠄⠄⠄⠄⢠⣿⣿⣿⣿⣿⢻⣿⣿⣿⣿⣿⣿⣿⣿⣯⢻⣿⣿⣿⣿⣆⠄⠄⠄
⠄⠄⣼⢀⣿⣿⣿⣿⣏⡏⠄⠹⣿⣿⣿⣿⣿⣿⣿⣿⣧⢻⣿⣿⣿⣿⡆⠄⠄
⠄⠄⡟⣼⣿⣿⣿⣿⣿⠄⠄⠄⠈⠻⣿⣿⣿⣿⣿⣿⣿⣇⢻⣿⣿⣿⣿⠄⠄
⠄⢰⠃⣿⣿⠿⣿⣿⣿⠄⠄⠄⠄⠄⠄⠙⠿⣿⣿⣿⣿⣿⠄⢿⣿⣿⣿⡄⠄
⠄⢸⢠⣿⣿⣧⡙⣿⣿⡆⠄⠄⠄⠄⠄⠄⠄⠈⠛⢿⣿⣿⡇⠸⣿⡿⣸⡇⠄
⠄⠈⡆⣿⣿⣿⣿⣦⡙⠳⠄⠄⠄⠄⠄⠄⢀⣠⣤⣀⣈⠙⠃⠄⠿⢇⣿⡇⠄
⠄⠄⡇⢿⣿⣿⣿⣿⡇⠄⠄⠄⠄⠄⣠⣶⣿⣿⣿⣿⣿⣿⣷⣆⡀⣼⣿⡇⠄
⠄⠄⢹⡘⣿⣿⣿⢿⣷⡀⠄⢀⣴⣾⣟⠉⠉⠉⠉⣽⣿⣿⣿⣿⠇⢹⣿⠃⠄
⠄⠄⠄⢷⡘⢿⣿⣎⢻⣷⠰⣿⣿⣿⣿⣦⣀⣀⣴⣿⣿⣿⠟⢫⡾⢸⡟⠄.
⠄⠄⠄⠄⠻⣦⡙⠿⣧⠙⢷⠙⠻⠿⢿⡿⠿⠿⠛⠋⠉⠄⠂⠘⠁⠞⠄⠄⠄
⠄⠄⠄⠄⠄⠈⠙⠑⣠⣤⣴⡖⠄⠿⣋⣉⣉⡁⠄⢾⣦⠄⠄⠄⠄⠄⠄⠄⠄
`,
];
