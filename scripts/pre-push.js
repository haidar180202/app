import { execSync } from "child_process";

function runCommand(command) {
  try {
    return execSync(command, { stdio: "pipe", encoding: "utf8" });
  } catch (error) {
    return { error: true, output: error.stdout || error.stderr || error.message };
  }
}
const lintResult = runCommand("pnpm run lint");

if (lintResult.error) {
  console.error("=== Lint Errors ===");
  console.error(lintResult.output);
  console.error("=== Lint Errors ===");
  console.log("+---------------------------------------------------------------+");
  console.log("|      * * * PUSH REJECTED BY EVIL DRAGON BUREAUCRATS * * *     |");
  console.log("+---------------------------------------------------------------+");
  console.log("             \\");
  console.log("              \\                    ^    /^");
  console.log("               \\                  / \\  // \\");
  console.log("                \\   |\\___/|      /   \\//  .\\");
  console.log("                 \\  /V  V  \\__  /    //  | \\ \\           *----*");
  console.log("                   /     /  \\/_/    //   |  \\  \\          \\   |");
  console.log("                   @___@'    \\/_   //    |   \\   \\         \\/\\ \\");
  console.log("                  0/0/|       \\/_ //     |    \\    \\         \\  \\");
  console.log("              0/0/0/0/|        \\///      |     \\     \\       |  |");
  console.log("           0/0/0/0/0/_|_ /   (  //       |      \\     _\\     |  /");
  console.log("        0/0/0/0/0/0/'/,_ _ _/  ) ; -.    |    _ _\\.-~       /   /");
  console.log("                    ,-}        _      *-.|.-~-.           .~    ~");
  console.log("   \\     \\__/        '/\\      /                 ~-. _ .-~      /");
  console.log("    \\____(Oo)           *.   }            {                   /");
  console.log("    (    (--)          .----~-.\\        \\-\\`                 `.~");
  console.log("    //__\\\\  \\ DENIED!  ///.----..<        \\             _ -~");
  console.log("   //    \\\\               ///-._ _ _ _ _ _ _{^ - - - - ~");
  console.log("");
  console.log("Halt! You dare defy the Evil Dragon Bureaucrat?!");
  console.log("Your code has been deemed unworthy of the sacred repository!");
  console.log("");
  console.log("🔴 Lint Errors? Fix them before I turn you into ashes!");
  console.log("");
  console.log("Only when your code is flawless and secure shall you pass.");
  console.log("Now, return to your keyboard and make it right!");
  process.exit(1);
}

console.log("Running dependency vulnerability check...");
const auditResult = runCommand("pnpm audit --json");


if (auditResult.error) {
  const auditParsed = JSON.parse(auditResult.output)
  if(auditParsed.metadata.moderate > 0 ||
    auditParsed.metadata.high > 0 ||
    auditParsed.metadata.critical > 0){
      const vulnerabilities = JSON.parse(auditResult.output || "{}");
    
      console.log("+---------------------------------------------------------------+");
      console.log("|      * * * AUDIT FAILED! EVIL DRAGON BUREAUCRATS STRIKE * * * |");
      console.log("+---------------------------------------------------------------+");
      console.log("             \\");
      console.log("              \\                    ^    /^");
      console.log("               \\                  / \\  // \\");
      console.log("                \\   |\\___/|      /   \\//  .\\");
      console.log("                 \\  /V  V  \\__  /    //  | \\ \\           *----*");
      console.log("                   /     /  \\/_/    //   |  \\  \\          \\   |");
      console.log("                   @___@'    \\/_   //    |   \\   \\         \\/\\ \\");
      console.log("                  0/0/|       \\/_ //     |    \\    \\         \\  \\");
      console.log("              0/0/0/0/|        \\///      |     \\     \\       |  |");
      console.log("           0/0/0/0/0/_|_ /   (  //       |      \\     _\\     |  /");
      console.log("        0/0/0/0/0/0/'/,_ _ _/  ) ; -.    |    _ _\\.-~       /   /");
      console.log("                    ,-}        _      *-.|.-~-.           .~    ~");
      console.log("   \\     \\__/        '/\\      /                 ~-. _ .-~      /");
      console.log("    \\____(Oo)           *.   }            {                   /");
      console.log("    (    (--)          .----~-.\\        \\-\\`                 `.~");
      console.log("    //__\\\\  \\ DENIED!  ///.----..<        \\             _ -~");
      console.log("   //    \\\\               ///-._ _ _ _ _ _ _{^ - - - - ~");
      console.log("");
      console.log("🔥 You dare defy the sacred repository rules?!");
      console.log("");
      console.log("🔴 Vulnerable Dependencies? Do you think this is a playground?!");
      console.log("");
      console.log("🔎 Here are the vulnerabilities discovered by the Evil Dragon Bureaucrat:");
      console.log("=== Dependency Vulnerabilities Detected ===");
      console.warn(vulnerabilities);
      console.log("===========================================");
      console.log("Only when your code is flawless and secure shall you pass.");
      console.log("Now, return to your keyboard and make it right!");
    
      process.exit(1)
    }
  console.log("there is some low level vulnerabilities @ package please run `pnpm audit` for more info")
}

// Run formatter
console.log("Lint check passed!");
// console.log("Formatting code...");
// runCommand("pnpm run format");
// console.log("amending the commit...")
// runCommand("git add .")
// runCommand("git commit --amend --no-edit");
// Push success
console.log("Pushing...");
process.exit(0);
