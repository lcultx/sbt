
受UnrealBuildTool启发, 用于大型Typescript项目分模块编译

Roadmap：

1. 在配置文件中指定依赖 ，如依赖模块不存在，或依赖模块已过时 编译该被依赖模块 否则只编译模块本身 Complete

2. 不同的编译目标可以通过不同的编译文件走不同的编译路径 Complete

3. 支持sourcemap Complete

4. 发布支持 complie concat fliter minifiy binaryCompress copyResource addVersionNumber，每个步骤可以定义before和after回调  Complete

4. 多级sourcemap映射 TODO

5. 编译指令预处理 TODO

6. 依赖文件变化编译自动重编译上层文件 TODO


安装方法：（在任意目录执行）
`
npm install sbt-cli -g
`


使用方式：(在项目根路径运行)

`
 > sbt build --help

  Usage: build [options] <module_name>

  Options:

    -h, --help            output usage information
    -q, --quickMode       快速编译开关 会启用监听只编译变化的文件
    -f, --forceMode       强制编译开关 首次启用sbt -q可以加上-f参数 在进入监听时就强制编译模块下所有文件
    -d, --debugMode       调试开关 会输出很多编译调试信息
    -c, --buildChildMode  监听和编译子模块
    -n, --nativeMode      会把ts编译为c++文件 然后调用gcc编译出可执行的exe程序
    -jar, --jarMode       会根据module.js中的jar配置 把模块编译成jar包 供后端开发使用

`