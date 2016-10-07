var fs = require('fs');
var os = require('os');
var path = require('path');

var canUpdateEnv = !process.env['NVS_EXECUTE'];

function help(topic) {
    if (!process.exitCode) process.exitCode = 127;

    if (topic) {
        var helpFile = path.join(__dirname,
            '../doc/' + topic.toUpperCase() + '.md');
        var helpText;
        try {
            helpText = fs.readFileSync(helpFile, 'utf8');
        } catch (e) {
            if (e.code !== 'ENOENT') {
                throw new Error('Failed to read help file: ' + helpFile + '. ' + e.message);
            }
        }

        if (helpText) {
            helpText = helpText.replace(/# /g, '');
            helpText = helpText.replace(/```/g, '');
            helpText = wrapLines(helpText, process.stdout.columns);
            return helpText;
        }
    }

    return [
        'NVS (Node Version Switcher) usage',
        '',
        'nvs help <command>           Get detailed help for a command',
        'nvs add <version>            Download and install a node version',
        'nvs rm <version>             Uninstall a node version',
        'nvs use [version]            ' + (canUpdateEnv
            ? 'Use a node version in the current environment'
            : '(Not available, source nvs.sh instead)'),
        'nvs run <version> [args]...  Run a script using a node version',
        'nvs ls                       List installed node versions',
        'nvs ls-available [feed]      List node versions available to install',
        'nvs which [version]          Show the path to a node version',
        'nvs link [version]           Create a "current" dir symlink to a version',
        'nvs unlink [version]         Remove a "current" dir symlink',
        '',
        'A version string consists of a semantic version number or version label',
        '("lts" or "latest"), optionally preceeded by a feed name, optionally',
        'followed by an architecture, separated by slashes.',
        'Examples: "lts", "4.6.0", "6.3.1/x86", "node/6.7.0/x64"',
        '',
        'Configured feed names: ' + require('./available').feedNames.join(', '),
        '',
    ].join(os.EOL);
}

function wrapLines(text, columns) {
    var lines = text.split(/\r?\n/);

    if (columns > 0) {
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.length > columns) {
                var nextLine;
                var wrapIndex = line.lastIndexOf(' ', columns - 1);
                if (wrapIndex > 0) {
                    nextLine = line.substr(wrapIndex + 1);
                    line = line.substr(0, wrapIndex);
                } else {
                    nextLine = line.substr(columns);
                    line = line.substr(0, columns);
                }
                lines.splice(i, 1, line, nextLine);
            }
        }
    }

    return lines.join(os.EOL);
}

module.exports = help;