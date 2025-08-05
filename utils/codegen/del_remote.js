import { promises as fs } from 'fs'
import { join } from 'path'

const asciiArts = [`
⡴⠒⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠉⠳⡆⠀
⣇⠰⠉⢙⡄⠀⠀⣴⠖⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣆⠁⠙⡆
⠘⡇⢠⠞⠉⠙⣾⠃⢀⡼⠀⠀⠀⠀⠀⠀⠀⢀⣼⡀⠄⢷⣄⣀⠀⠀⠀⠀⠀⠀⠀⠰⠒⠲⡄⠀⣏⣆⣀⡍
⠀⢠⡏⠀⡤⠒⠃⠀⡜⠀⠀⠀⠀⠀⢀⣴⠾⠛⡁⠀⠀⢀⣈⡉⠙⠳⣤⡀⠀⠀⠀⠘⣆⠀⣇⡼⢋⠀⠀⢱
⠀⠘⣇⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⡴⢋⡣⠊⡩⠋⠀⠀⠀⠣⡉⠲⣄⠀⠙⢆⠀⠀⠀⣸⠀⢉⠀⢀⠿⠀⢸
⠀⠀⠸⡄⠀⠈⢳⣄⡇⠀⠀⢀⡞⠀⠈⠀⢀⣴⣾⣿⣿⣿⣿⣦⡀⠀⠀⠀⠈⢧⠀⠀⢳⣰⠁⠀⠀⠀⣠⠃
⠀⠀⠀⠘⢄⣀⣸⠃⠀⠀⠀⡸⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠈⣇⠀⠀⠙⢄⣀⠤⠚⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⢘⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⢰⣿⣿⣿⡿⠛⠁⠀⠉⠛⢿⣿⣿⣿⣧⠀⠀⣼⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡀⣸⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⡀⢀⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡇⠹⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⡿⠁⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣤⣞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢢⣀⣠⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠲⢤⣀⣀⠀⢀⣀⣀⠤⠒⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    `,
    `
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⣦⣤⣤⣤⣤⣴⣀⣀⠀⠀⠀
⠀⠀⠠⢴⠿⢿⣳⣧⡀⠀⢀⣴⣲⣶⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⢿⣿⣶⣿⣿⣶⠶⡾⣗⠀⠀⠀
⠀⠀⠠⢀⣀⣀⠙⢛⣻⣶⣿⣿⣛⣁⣢⠀⠀⠤⢆⠄⢀⠀⠀⠀⠀⣰⠿⡟⣿⣶⣷⣿⢛⣧⣺⣾⣷⢻⢹⣀⠀⠀
⠉⡹⠞⠛⠙⠙⠛⢫⣿⢿⣏⡉⠉⠉⠛⣛⣛⠷⠶⠭⣖⣷⣄⠀⠈⣿⣦⣵⣾⡿⣟⣻⣍⣇⢻⣟⡍⣾⠸⡇⡀⠀
⠀⠀⠀⠈⠀⠀⠠⣾⣻⣯⢿⣦⠀⠀⠈⠀⠀⠀⠀⠀⠀⠉⠛⠷⣄⡈⠻⣯⣗⡿⣯⡷⢯⣶⣹⠋⠠⠿⠈⠃⠁⠀
⠀⠀⠀⠀⠀⠀⣼⣳⣿⢧⣿⡽⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢁⣍⣿⣾⣯⡛⠿⠿⠟⠛⠋⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣳⣿⣞⡭⣿⣿⡗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣷⣷⣿⡟⢧⢶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣾⣿⣿⡧⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣽⣿⡇⢸⡿⢧⣠⣦⣀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠛⢿⣿⣿⡿⠟⠅⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⠟⣿⣧⡾⠃⣸⣿⣿⡿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⠴⣖⢢⡾⣇⣿⣿⣷⢾⣿⣽⡶⠿⠛⠉⠀⠛⢦⡆⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣹⡆⣿⣹⣷⣿⣿⡏⠁⠈⠏⠁⠁⠀⠀⠀⠀⠀⠀⠹⡰⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣻⣷⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣆⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠿⣿⣿⣹⡿⠟⠻⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠼⠁⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠄⠻⢷⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡗⡇⠀⠀⠀⠀⠈⠫⣻⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡧⠀⠀⠀⠀⠀⢰⡟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡿⠀⠀⠀⠀⠀⠀⢸⡇⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢼⡇⠀⠀⠀⠀⠀⢠⣟⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠃⠀⠀⠀⠀⠀⢐⣟⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢘⡿⢀⡀⢠⡀⢄⡀⣈⢿⣟⡀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⣌⠱⣼⣷⣡⢎⡱⡘⢦⡑⢻⡛⢭⢛⡛⠞⣛⠡⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠨⡙⠻⠛⢥⠢⠱⡉⠦⠙⢆⡙⢆⠣⠜⡱⠌⠃⠂⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠈⠀⠀⠁⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    `,
    
]

async function removeFromDockerCompose(rootDir, projectName) {
  const dockerComposePath = join(rootDir, 'docker-compose.yml');
  try {
    let content = await fs.readFile(dockerComposePath, 'utf-8');
    
    // Create regex pattern to match the entire service block
    const servicePattern = new RegExp(
      `\\s+${projectName.toLowerCase()}:\\s+` + 
      `build:\\s+` +
      `context: \\./apps/${projectName}\\s+` +
      `dockerfile: Dockerfile\\s+` +
      `ports:\\s+` +
      `- "\\d+:80"\\s+` +
      `hostname: ${projectName}\\s+` +
      `networks:\\s+` +
      `- app-network\\s*`,
      'g'
    );

    // Remove the service block
    content = content.replace(servicePattern, '\n');
    
    await fs.writeFile(dockerComposePath, content);
    console.log('✅ Removed service from docker-compose.yml');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('⚠️ docker-compose.yml not found');
    } else {
      throw error;
    }
  }
}

async function removeFromModulesConfig(shellDir, projectName) {
    const modulesConfigPath = join(shellDir, 'src/config/modules.config.ts');
    try {
      let content = await fs.readFile(modulesConfigPath, 'utf-8');
      
      // Create regex pattern to match the remote configuration object with more flexible whitespace
      const remotePattern = new RegExp(
        `\\s*{\\s*` +
        `name:\\s*["']${projectName}["'],?\\s*` +
        `url:\\s*\`http://localhost:\\d+\`,?\\s*` +
        `}`,
        'g'
      );
  
      // Remove the remote configuration and the preceding comma if it exists
      content = content.replace(/,(\s*{[^}]*name:\s*["']${projectName}["'][^}]*})/g, '$1');
      content = content.replace(remotePattern, '');
      
      // Clean up trailing commas that might be left after removal
      content = content.replace(/,(\s*])/g, '$1');
      
      // Clean up multiple commas that might be left after removal
      content = content.replace(/,\s*,/g, ',');
      
      // Clean up empty array
      content = content.replace(/remotesLocal\s*:\s*RemoteConfig\[\]\s*=\s*\[\s*,?\s*\]/g, 
        'remotesLocal: RemoteConfig[] = []');
      
      await fs.writeFile(modulesConfigPath, content);
      console.log('✅ Removed remote from modules.config.ts');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('⚠️ modules.config.ts not found');
      } else {
        throw error;
      }
    }
  }

async function deleteDirectory(directoryPath) {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    
    for (const entry of entries) {
        const currentPath = join(directoryPath, entry.name);
        
        if (entry.isDirectory()) {
            await deleteDirectory(currentPath);
            await fs.rmdir(currentPath);
        } else {
            await fs.unlink(currentPath);
        }
    }
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

async function deleteRouteModule(shellDir, projectName) {
    const routeModulePath = join(shellDir, 'src', 'routes', 'route.module.tsx')
    let routeModuleData = await fs.readFile(routeModulePath, 'utf-8')

    // Split into lines for processing
    let lines = routeModuleData.split('\n')
    
    // Find the index where export block starts
    const exportStartIndex = lines.findIndex(line => 
        line.includes(`export const ${projectName}`) || 
        line.includes(`export const ${capitalizeFirstLetter(projectName)}`)
    );

    if (exportStartIndex !== -1) {
        // Find the end of the export block by counting brackets
        let bracketCount = 0;
        let currentIndex = exportStartIndex;
        let foundClosing = false;

        while (currentIndex < lines.length && !foundClosing) {
            const line = lines[currentIndex];
            
            const openBrackets = (line.match(/\(/g) || []).length;
            const closeBrackets = (line.match(/\)/g) || []).length;
            
            bracketCount += openBrackets - closeBrackets;
            
            if (bracketCount === 0 && line.includes(');')) {
                foundClosing = true;
            }
            
            currentIndex++;
        }

        if (foundClosing) {
            lines.splice(exportStartIndex, (currentIndex - exportStartIndex) + 1);

            await fs.writeFile(routeModulePath, lines.join('\n'));
            console.log(`✅ Removed route entry for "${projectName}" from route.module.tsx`);
        } else {
            console.error(`❌ Could not find complete export block end for "${projectName}"`);
        }
    } else {
        console.error(`❌ No route entry found for "${projectName}" in route.module.tsx`);
    }
}

async function deleteApp() {
    const projectName = process.argv[2]
    if(!projectName) throw new Error("❌ Project need a name")

    const rootDir = process.cwd();
    const targetDir = join(rootDir, 'apps', projectName);
    const shellDir = join(rootDir, 'apps', 'web-root');
    
    console.log(asciiArts[Math.floor(Math.random() * asciiArts.length)]);
    
    try {
        // Check if the target directory exists
        try {
            await fs.access(targetDir)
            await deleteDirectory(targetDir)
            await fs.rmdir(targetDir).catch((e)=> console.error(`❌ Error deleting directory ${targetDir}: ${e.message}`))
            console.log(`✅ Project "${projectName}" has been deleted successfully!`)
        } catch (error) {
            console.error(`❌ Project "${projectName}" does not exist.`)
            return
        }

        // Remove from docker-compose.yml
        await removeFromDockerCompose(rootDir, projectName);

        // Remove from modules.config.ts
        await removeFromModulesConfig(shellDir, projectName);

        // Remove the route entry from route.module.tsx
        await deleteRouteModule(shellDir, projectName);
        
        console.log(`✅ Successfully cleaned up the project "${projectName}"`);
    } catch (error) {
        console.error('❌ Failed to delete app:', error);
    }
}

deleteApp().catch((error) => {
    console.error('❌ An error occurred while deleting the app:', error)
})
