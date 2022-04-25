# 安装/部署

## Windows Installer

nodejs v16.14.2
python3
Visual Studio Installer (Install Visual Studio Build Tools)

## Truffle (compile/deploy/tests contracts)

npm i -g truffle

编译
truffle compile

移植 to blockchain
truffle migrate

重新移植
truffle migrate --reset

运行测试
truffle test

测试成功后需要把生成的 contract 复制到 react 里面使用
从 build/contracts/P2P.json
复制到 client/src/contracts/

## Ganache (Ethereum simulator) 安装其中一个

### For Window

https://trufflesuite.com/ganache/

### For CMD Use

npm i -g ganache

######

truffle 文档 blockchain-project/
truffle-config.js

react 文档 blockchain-project/client
看 /client/Readme.md
