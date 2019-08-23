# 自动生成md文档插件说明文档

### 1.1.0

版本升级  
    支持配置参数 **jsPath** 来生成用于获取生成md内容的路径  
bug修复  
    生成标题前有空格导致md渲染失败

使用方法：  


    ```
        // .babelrc
        "plugins": [
            ["autodoc", {"jsPath": "public/README.js"}]
        ]

    ```


### 1.1.1

bug修复  
    - 修复存在多个class时后者覆盖前者生成的表格


### 1.1.2

    - 添加对@mogudoc开头的注释块的识别


### 1.1.3

    - 防止用户修改README.md后重新编译文件会复写READEME.md，输出路径改为doc.md


### 1.1.4

    - bug fixed