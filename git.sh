#! /bin/bash
# @author xiaoxudoo from leike 2017-02-17
# 自动打包上传到代码仓库

echo "build start"                      # 开始构建
npm run build                           # webpack构建到dist目录
echo "build end"                        # 构建结束
pack_time=$(date +%Y-%m-%d-%H-%M-%S)    # 构建时间
pack_name=build-$pack_time              # 压缩包名称
rm -rf ./dist.tgz                       #删除之前的压缩包
tar czf ./dist.tgz dist                 # 打一个压缩包

git add -A && git commit -am "$pack_name"
#git push origin master                  # 提交
#rm -rf dist                             # 删除output