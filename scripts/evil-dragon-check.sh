# Define the condition (e.g., check for linting errors)
echo "Running linter..."
LINT_OUTPUT=$(pnpm run lint 2>&1)  # Capture lint output, including errors
STATUS=$?

# If the condition fails, show the evil dragon and exit
if [ $STATUS -ne 0 ]; then
    echo "=== Lint Errors ==="
    echo "$LINT_OUTPUT"  # Display the lint errors
    echo "=== Lint Errors ==="
    echo "+---------------------------------------------------------------+"
    echo "|      * * * PUSH REJECTED BY EVIL DRAGON BUREAUCRATS * * *     |"
    echo "+---------------------------------------------------------------+"
    echo "            \\"
    echo "             \\                    ^    /^"
    echo "              \\                  / \\  // \\"
    echo "               \\   |\\___/|      /   \\//  .\\"
    echo "                \\  /V  V  \\__  /    //  | \\ \\           *----*"
    echo "                  /     /  \\/_/    //   |  \\  \\          \\   |"
    echo "                  @___@'    \\/_   //    |   \\   \\         \\/\\ \\"
    echo "                 0/0/|       \\/_ //     |    \\    \\         \\  \\"
    echo "             0/0/0/0/|        \\///      |     \\     \\       |  |"
    echo "          0/0/0/0/0/_|_ /   (  //       |      \\     _\\     |  /"
    echo "       0/0/0/0/0/0/'/,_ _ _/  ) ; -.    |    _ _\\.-~       /   /"
    echo "                   ,-}        _      *-.|.-~-.           .~    ~"
    echo "  \\     \\__/        '/\\      /                 ~-. _ .-~      /"
    echo "   \\____(Oo)           *.   }            {                   /"
    echo "   (    (--)          .----~-.\\        \\-\\`                 `.~"
    echo "   //__\\\\  \\ DENIED!  ///.----..<        \\             _ -~"
    echo "  //    \\\\               ///-._ _ _ _ _ _ _{^ - - - - ~"
    echo ""
    echo "Halt! You dare defy the Evil Dragon Bureaucrat?!"
    echo "Your code has been deemed unworthy of the sacred repository!"
    echo ""
    echo "🔴 Lint Errors? Fix them before I turn you into ashes!"
    echo ""
    echo "Only when your code is flawless and secure shall you pass."
    echo "Now, return to your keyboard and make it right!"

    exit 1
fi

echo "Running dependency vulnerability check..."
AUDIT_OUTPUT=$(pnpm audit --json)

VULNERABILITIES=$(echo "$AUDIT_OUTPUT" | grep -oP '(?<="title": ")[^"]+|(?<="severity": ")[^"]+|(?<="module_name": ")[^"]+|(?<="vulnerable_versions": ")[^"]+|(?<="recommendation": ")[^"]+|(?<="url": ")[^"]+' | awk '
  NR%6==1 {title=$0}
  NR%6==2 {severity=$0}
  NR%6==3 {module=$0}
  NR%6==4 {versions=$0}
  NR%6==5 {recommendation=$0}
  NR%6==0 {url=$0; printf "Title: %s\nSeverity: %s\nModule: %s\nAffected Versions: %s\nRecommendation: %s\nDetails: %s\n\n", title, severity, module, versions, recommendation, url}
')

if [ -n "$VULNERABILITIES" ]; then
    echo "+---------------------------------------------------------------+"
    echo "|      * * * AUDIT FAILED! EVIL DRAGON BUREAUCRATS STRIKE * * * |"
    echo "+---------------------------------------------------------------+"
    echo "            \\"
    echo "             \\                    ^    /^"
    echo "              \\                  / \\  // \\"
    echo "               \\   |\\___/|      /   \\//  .\\"
    echo "                \\  /V  V  \\__  /    //  | \\ \\           *----*"
    echo "                  /     /  \\/_/    //   |  \\  \\          \\   |"
    echo "                  @___@'    \\/_   //    |   \\   \\         \\/\\ \\"
    echo "                 0/0/|       \\/_ //     |    \\    \\         \\  \\"
    echo "             0/0/0/0/|        \\///      |     \\     \\       |  |"
    echo "          0/0/0/0/0/_|_ /   (  //       |      \\     _\\     |  /"
    echo "       0/0/0/0/0/0/'/,_ _ _/  ) ; -.    |    _ _\\.-~       /   /"
    echo "                   ,-}        _      *-.|.-~-.           .~    ~"
    echo "  \\     \\__/        '/\\      /                 ~-. _ .-~      /"
    echo "   \\____(Oo)           *.   }            {                   /"
    echo "   (    (--)          .----~-.\\        \\-\\`                 `.~"
    echo "   //__\\\\  \\ DENIED!  ///.----..<        \\             _ -~"
    echo "  //    \\\\               ///-._ _ _ _ _ _ _{^ - - - - ~"
    echo ""
    echo "🔥 You dare defy the sacred repository rules?!"
    echo ""
    echo "🔴 Vulnerable Dependencies? Do you think this is a playground?!"
    echo ""
    echo "🔎 Here are the vulnerabilities discovered by the Evil Dragon Bureaucrat:"
    echo "=== Dependency Vulnerabilities Detected ==="
    echo ""
    echo "$VULNERABILITIES"
    echo ""
    echo "==========================================="
    echo "Only when your code is flawless and secure shall you pass."
    echo "Now, return to your keyboard and make it right!"
    exit 1
fi

echo "Lint check passed!"
echo "Formatting.."
if [ "$(uname -s)" = "Linux" ] || [ "$(uname -s)" = "Darwin" ]; then
    pnpm run format > /dev/null 2>&1
else
    pnpm run format > NUL 2>&1
fi
echo "Pushing..."
exit 0
