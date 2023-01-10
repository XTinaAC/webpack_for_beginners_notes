module.exports={
    plugins:[
        // 自动补齐浏览器前缀
        require("autoprefixer")({
            // 下列配置方法已废弃
            // 兼容市面所有版本浏览器
            // browsers: ["> 0% "],

            // solution1：在package.json中添加 browserslist 配置项
            // "browserslist": [
            //     "last 5 version",
            //     ">1%",
            //     "ie>=8",
            //     "maintained node versions", # 被node基金会维护的版本
            //     "not dead"
            // ]

            // solution2：维护 .browserslistrc 配置文件
        }),
        require('postcss-preset-env')
    ]
}