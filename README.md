# tbt
Typescript Build Tools

受UnrealBuildTool（简称UBT）启发，开发了一套Typescript Build Tools, 基本用法类似UBT 用于大型项目分模块编译

基本原则：

1. 在配置文件中指定依赖 ，如依赖模块不存在，或依赖模块已过时 编译该被依赖模块 否则只编译模块本身

2. 不同的编译目标可以通过不同的编译文件走不同的编译路径

3. 支持Sourcemap

4. 自动管理头文件引入，需要时自动生成头文件（供VS提示使用）

5. 支持多项目管理，支持多版本切换
