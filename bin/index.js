#! /usr/bin/env node

const clone = require('git-clone');
const program = require('commander');
const shell = require('shelljs');
const log = require('tracer').colorConsole();

program
    .version('1.0.0')
    .description('ptb-react-native-cli cli tools');
program
    .command('* <project>')
    .action(function (project) {
        log.info('demo：ptb-react-native-cli projectName');
        if (project) {
            let pwd = shell.pwd();
            log.info(`Downloads，location：${pwd}/${project}/ ...`);
            clone(`git@192.168.5.21:blockChain/ptb-vote-app-react-native.git`, pwd + `/${project}`, null, function () {
                shell.rm('-rf', pwd + `/${project}/.git`);
                shell.exec('node bin/replaceName.js ptbvoteapp ' + project + ' ' + pwd + `/${project}`);
                shell.exec('node bin/replaceName.js PtbVoteApp ' + project + ' ' + pwd + `/${project}`);
                log.info('ptb-react-native Completion of Engineering')
            });
        } else {
            log.error('An example of the correct command：ptb-react-native-cli projectName')
        }
    });

program.parse(process.argv);