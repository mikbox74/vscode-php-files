import * as vscode from 'vscode';
import * as fs from 'fs';
import * as writer from 'php-writer';

import TemplatesRepository from '../templatesRepository';

import { getPath, getFullyQualifiedName, getExtends, getImplements, getBaseName, notValidPath } from './helpers';

export function run(templatesRepository: TemplatesRepository, args: any) {
    const template = templatesRepository.findByName('PHPClass');
    const phpClass = new writer(template);
    
    getPath(args && args.fsPath).then(targetFolder => {
        getFullyQualifiedName().then(name => {
            const filePath = targetFolder + '/' + getBaseName(name) + '.php';

            if (notValidPath(filePath)) {
                return;
            }

            getExtends().then(parent => {
                getImplements().then(interfaces => {
                    phpClass
                        .findClass('PHPClass')
                        .setName(name)
                        .setExtends(parent)
                        .setImplements(interfaces);
                    
                    
                    fs.writeFileSync(filePath, phpClass);
                });
            });
        });
    });
}