const title = require('./title');
let methodTableList = [];
let methodTable = [];
module.exports = {
 
    initTable (path) {
        let comment = null;
        const node = path.node;
        if (path.inList) {
            const key = path.key;
            if (!node.leadingComments && key) {
                if (!path.getSibling(key - 1).node.trailingComments) return;
                comment = path.getSibling(key - 1).node.trailingComments[0] || '';
            } else {
                if (!node.leadingComments) return;
                comment = node.leadingComments[0];
            }
        } else {
            comment = node.leadingComments[0];
        }

        const commetStr = comment.value.trim();

        if (isExport(commetStr)) {
            getMethodsParams(node);
            cutCommetStr(commetStr, node);
        }
    },

    getAllMethodTable () {
        let tableStr = title.initTitle('方法列表:h1') + '方法名 | 说明 \n --- | --- \n';
        methodTableList.forEach(t => {
            tableStr += `${t.name} | ${t.desc} \n`;
        });

        return tableStr;
    },

    getMethodParamsTable () {
        const tableTitle = '参数名 | 说明 | 类型 \n --- | --- | --- \n';
        let content = '';
        methodTable.forEach(table => {
            content += '\n' + title.initTitle(`${table.methodName}参数说明:h3`);
            content += tableTitle;
            table.data.forEach(d => {
                content += `${d.name} | ${d.desc} | ${d.type} \n`;
            });
        });

        return content;
    },

    removeData () {
        methodTableList = [];
        methodTable = [];
    }
};

function getMethodsParams (node) {
    const name = node.key.name;
    const params = node.params;
    let table = [];
    params.forEach(i => {
        table.push({name: i.name});
    });
    const i = methodTable.findIndex(item => item.methodName === name);
    if (i > -1) {
        methodTable.splice(i, 1, {methodName: name, data: table});
    } else {
        methodTable.push({methodName: name, data: table});
    }
}

// 判断方法是否是要暴露给用户使用
function isExport (comments) {
    const reg = /^export/;
    return reg.test(comments);
}

function cutCommetStr (str, node) {
    const descReg = /^@desc/;
    const paramReg = /^@param/;
    let comments = str.split('\n');
    comments.map(c => {
        const item = c.trim();
        descReg.test(item) && addTableList(node.key.name, item);
        paramReg.test(item) && initMethodTable(node.key.name, item);
    });
}

function addTableList (name, str) {
    let idx = methodTableList.findIndex(i => i.name === name);
    const arr = str.split(':');
    const desc = arr[1] || '';
    if (idx > -1) {
        methodTableList[idx].desc = desc;
    } else {
        methodTableList.push({name, desc});
    }
}

function initMethodTable (name, str) {
    const idx = methodTable.findIndex(i => i.methodName === name);
    if (idx === -1) return;
    const arr = str.split(':');
    if (!arr[1]) return;
    let i = methodTable[idx].data.findIndex(item => item.name === arr[1].trim());
    if (i > -1) {
        methodTable[idx].data[i].desc = arr[2] || '';
        methodTable[idx].data[i].type = arr[3] || '';
    }
}