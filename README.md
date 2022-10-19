# dev-campus-uni-app
## 组件框架
### uni-ui 是基于uni-app的、全端兼容的、高性能UI框架
#### 当前使用版本 1.4.22（2022-09-19)
#### 引入时间 2022-9-30
代码示例地址 ：https://ext.dcloud.net.cn/plugin?id=4941

组件演示地址：https://hellouniapp.dcloud.net.cn

组件文档地址：https://uniapp.dcloud.io/component/uniui/uni-ui

### uView 多平台快速开发的UI框架

#### 当前使用版本 2.0.34 （2022-09-25)
#### 引入时间 2022-10-19
[官方使用文档:https://www.uviewui.com/](https://www.uviewui.com/components/intro.html)

![您可以通过微信扫码，查看最佳的演示效果。](https://uviewui.com/common/weixin_mini_qrcode.png)

## Git开发规范
### type 说明 (必填)
feat: 添加新特性（新功能）

fix: 修复bug

docs: 仅仅修改了文档

style: 仅仅修改了空格、格式缩进、都好等等，不改变代码逻辑

refactor: 代码重构，没有加新功能或者修复bug

perf: 改变代码提升性能

test: 增加或修改测试用例

build: 修改了影响构建过程或者外部依赖的文件，如修改了pom中某个jar包的版本，npm依赖等

ci: 修改了CI/CD配置文件

chore: 其他不影响改变src的改变

revert: 回退到之前某个commit

clean: 清除废弃多余无用代码文件的提交


### scope 说明 (必填)

scope用于说明 commit 影响的范围，如，具体某个/某几个文件/文件夹。如果一次修改影响了整个项目，可以使用*代替。

最后提交commit 格式： 比如添加新功能 添加文件是 user文件： 

git commit -m "feat(user):添加某某功能代码"
