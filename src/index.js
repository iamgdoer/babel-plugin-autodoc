const fs = require('fs');
const table = require('./util/table');
const methodsTable = require('./util/methodtable');
const title = require('./util/title');

let files = [];

let jsPath = '';

module.exports = function ({ types: t }) {
    return {
        visitor: {
            ClassDeclaration (classPath, { opts }) {
                const titleStr = '\n' + title.initTitle(`${classPath.node.id.name}:h1`);
                methodsTable.removeData();
                table.removeData();
                const body = classPath.get('body').get('body');
                const _pPath = classPath.get('body').state.filename;
                body.some(path => {
                    const node = path.node;
                    if (node.type === 'ClassProperty') {
                        // 生成属性数据
                        table.initPropsTableData(node);
                    } 
                    if (node.type === 'ClassMethod' && node.key.name !== 'render') {
                        methodsTable.initTable(path);
                    }
                });

                // 属性表格
                const propsTableStr = table.createPropsTable();

                // 方法列表
                const methodsListTable = methodsTable.getAllMethodTable();

                // 方法参数列表
                const methodPropsTable = methodsTable.getMethodParamsTable();

                const tableStr = titleStr + propsTableStr + methodsListTable + methodPropsTable;

                const fileIdx = files.findIndex(file => file.path === _pPath);

                if (fileIdx > -1) {
                    files[fileIdx].contentStr = tableStr;
                } else {
                    files.push({ path: _pPath, contentStr: tableStr });
                }

                jsPath = opts.jsPath || '';
            }
        },

        post({ opts }) {

            let mdStr = '';

            files.forEach(file => {
                mdStr += file.contentStr + '\n';
            });

            fs.writeFile('README.md', mdStr, 'utf8', (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
            });

            if (jsPath) {
                const jsString = "var md = `" + mdStr + "`";

                fs.writeFile(jsPath, jsString, 'utf8', (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
            }
        }
    }
}
