const fs = require('fs');
const title = require('./title');
const table = require('./table');

let content = '';

module.exports = {
    // 生成文档对象树
    initFile (fileGroup) {
        content = '';
        let fileTree = new File('# 文档使用说明\n');
        let titleRank = 1;
        let oldFiles = []; // 用于缓存当前操作文档对象的父节点
        let curFile = fileTree; // 当前文档对象
        fileGroup.forEach(file => {
            if (title.isTitle(file)) { // 如果是标题，进行下列操作
                const rankRes = title.jusgeTitleRank(titleRank, file); // 比较标题与当前标题的级别
                if (rankRes >= 0) {
                    titleRank = title.getTitleRank(file);
                    let newFile = new File(title.initTitle(file));
                    /* 
                        当遍历到的标题级别没有超过文档缓存队列中最大标题级别时就从缓存队列中
                        寻找对应标题级别的对象，把新文档push到对应级别对象的子节点中，并且删
                        掉对应缓存对象后面的缓存；
                    */

                    /* 
                        如果级别超过了文档缓存队列中最大标题级别时就直接在根树的子节点push，
                        然后清空缓存队列
                    */
                    if (oldFiles.length && titleRank >= oldFiles[0].rank) {
                        let idx = oldFiles.findIndex(item => item.rank === titleRank);
                        if (idx === -1) return;
                        oldFiles[idx].oldFile.child.push(newFile);
                        oldFiles.splice(idx + 1);
                    } else {
                        fileTree.child.push(newFile);
                        oldFiles = [];
                    }
                    curFile = newFile;
                    newFile = null;
                } else { 
                    /* 
                        如果遍历到的标题级别没有当前标题级别高的话，就生成以该标题的文档对象，
                        把生成的文档放到当前文档的子节点数组中，缓存当前文档到老文档数组中，
                        并赋值给当前文档为新生成的文档对象
                    */
                    titleRank = title.getTitleRank(file);
                    let newFile = new File(title.initTitle(file));
                    curFile.child.push(newFile);
                    oldFiles.push({rank: titleRank, oldFile: curFile});
                    curFile = newFile;
                    newFile = null;
                }
            } else if (table.isTable(file)) {
                curFile.table.push(file.split(':')[0]);
            } else { // 目前没有考虑代码块和引用，所以除了是标题外就是段落，直接push进当前文档的selection中
                curFile.selection.push(file);
            }
        });

        oldFiles = [];
        curFile = null;

        renderFile(fileTree);

        fs.writeFile('README.md', content, 'utf8', (err) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log('文档已生成');
        });
    }
}


function File (title) {
    this.title = title;
    this.selection = [];
    this.code = [];
    this.quto = [];
    this.table = [];
    this.child = [];
}

function renderFile (tree) {
    content += '\n' + tree.title;
    tree.selection.forEach(s => {
        content += s + '\n';
    });
    tree.table.forEach(t => {
        content += t + '\n';
    });

    if (tree.child) {
        tree.child.forEach(ch => {
            renderFile(ch);
        });
    }
}
