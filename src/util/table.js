const title = require('./title');
let table = [];
module.exports = {
    initPropsTableData (node) {
        const name = node.key.name;
        const properties = node.value.properties;
        properties.forEach(prop => {
            let idx = table.findIndex(i => i.name === prop.key.name);
            if (name === 'propTypes') {
                const item = initTableProp(prop);
                idx > -1 && table.splice(idx, 1, item);
                idx === -1 && table.push(item);
            }
            if (name === 'defaultProps') {
                initTableValue(prop, idx);
            }
        });
    },

    createPropsTable () {
        let tableStr = title.initTitle('属性列表:h1') + '属性名 | 说明 | 类型 | 默认值 \n --- | --- | --- | --- \n';
        table.forEach(t => {
            tableStr += `${t.name} | ${t.desc} | ${t.type} | ${t.value} \n`;
        });

        return tableStr;
    },

    isTable (str) {
        const arr = str.split(':');
        if (arr[1]) {
            const reg = /^table$/;
            return reg.test(arr[1]);
        }
    },

    removeData() {
        table = [];
    }
}

// 生成表格的属性
function initTableProp (prop) {
    let item = {
        name: prop.key.name,
        desc: getPropDesc(prop),
        value: ''
    };

    if (prop.value.type === 'CallExpression') {
        const types = [];
        prop.value.arguments[0].elements.forEach(ele => {
            types.push(ele.property.name);
        });
        item.type = types.join(',');
    } else {
        item.type = prop.value.property.name;
    }

    return item;
}

// 生成表格的属性值
function initTableValue (prop, i) {
    if (i === -1) return;
    table[i].value = prop.value.value || '';
}

// 获取属性的说明
function getPropDesc (prop) {
    return prop.leadingComments && 
        prop.leadingComments[0] ? prop.leadingComments[0].value.trim() : '';
}
