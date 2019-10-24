module.exports = {
    title: 'Hello VuePress',
    description: 'Just playing around',
    themeConfig: {
        // 添加导航栏
        nav: [
            {text: '首页', link: '/'},
            {text: '面向对象', link: '/wiki/01/'},
            {text: '设计原则', link: '/wiki/02/'},
            {text: 'promise', link: '/promise'},
            {
                text: '设计模式',
                // 这里是下拉列表展现形式。
                items: [
                    {text: '01-面向对象', link: '/wiki/01/'},
                    {text: '02-设计原则', link: '/wiki/02/'},
                    {text: '03-工厂模式', link: '/wiki/03-工厂模式/'},
                    {text: '04-单例模式', link: '/wiki/04-单例模式/'}
                ]
            }
        ],
        // 为以下路由添加侧边栏
        // sidebar: 'auto',
        displayAllHeaders: true,
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        sidebar: [{
            title: '开发指南',
            collapsable: true,
            children: [
                ['./guide/install/install', '安装'],
                ['./guide/started/started', '快速上手'],
            ]
        },
            {
                title: '组件',
                collapsable: true,
                children: [
                    ['./guide/icon/icon', 'icon'],
                    ['/promise', 'promise'],
                ]
            },
        ['/guide/icon/mytest', '我的测试']
        ],
    }
};
