import { Command } from 'commander';
import { generateApi } from './api-generator';
const program = new Command();
console.log('sdfafd');
program
    .version('1.0.0')
    .description('A CLI tool that wraps an API generator script')
    .option('-p, --path <path>', 'Path to API models folder')
    .option('-H, --help', 'HELP ME!')
    .action((options) => {
    const path = options.path;
    if (path) {
        generateApi(path);
    }
})
    .parse(process.argv);
