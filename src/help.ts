const help = `
  Usage: npm init @jigra/app [<path>] [options]

  Options:

    --name <name> ............. Human-friendly app name
    --package-id <id> ......... Unique app ID in reverse-DNS notation

    -h, --help ................ Print help, then quit
    --verbose ................. Print verbose output to stderr
`;

export const run = () => {
  process.stdout.write(help);
};
