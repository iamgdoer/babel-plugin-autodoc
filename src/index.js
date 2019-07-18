const fs = require('fs');
const table = require('./util/table');
const methodsTable = require('./util/methodtable');

module.exports = function ({ types: t }) {
    return {
        visitor: {
            ClassDeclaration (classPath, { opts }) {
                methodsTable.removeData();
                table.removeData();
                const body = classPath.get('body').get('body');
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

                const tableStr = propsTableStr + methodsListTable + methodPropsTable;

                fs.writeFile('README.md', tableStr, 'utf8', (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
        
                    console.log('文档已生成');
                });

                const jsPath = opts.jsPath || '';
                if (jsPath) {
                    const jsString = "var md = `" + tableStr + "`";

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
}
