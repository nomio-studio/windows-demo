/* Shell chrome: boot/lock, taskbar, menus, start, tray flyouts,
 * Action Center, calendar, update toast, wallpapers. */

export const en = {
  /* ---- Boot / power screens ---- */
  'boot.restarting': 'Restarting',
  'boot.shuttingDown': 'Shutting down',
  'boot.powerOn': 'Click to power on',

  /* ---- Lock / sign-in ---- */
  'lock.user': 'User',
  'lock.pin': 'PIN',
  'lock.signin': 'Sign in',

  /* ---- Shell / taskbar ---- */
  'shell.search': 'Type here to search',

  /* ---- ARIA labels ---- */
  'aria.start': 'Start',
  'aria.search': 'Search',
  'aria.taskview': 'Task view',
  'aria.showHidden': 'Show hidden icons',
  'aria.network': 'Network',
  'aria.volume': 'Volume',
  'aria.actionCenter': 'Action center',
  'aria.showDesktop': 'Show desktop',
  'aria.language': 'Language',
  'aria.dismiss': 'Dismiss',
  'aria.minimize': 'Minimize',
  'aria.maximize': 'Maximize',
  'aria.close': 'Close',
  'aria.back': 'Back',
  'aria.forward': 'Forward',
  'aria.up': 'Up',
  'aria.refresh': 'Refresh',
  'aria.home': 'Home',
  'aria.favorites': 'Favorites',
  'aria.hub': 'Hub',
  'aria.more': 'More',
  'aria.signin': 'Sign in',

  /* ---- Context menus ---- */
  'menu.view': 'View',
  'menu.icons.large': 'Large icons',
  'menu.icons.medium': 'Medium icons',
  'menu.icons.small': 'Small icons',
  'menu.sortBy': 'Sort by',
  'menu.sort.name': 'Name',
  'menu.sort.size': 'Size',
  'menu.sort.type': 'Item type',
  'menu.sort.date': 'Date modified',
  'menu.refresh': 'Refresh',
  'menu.paste': 'Paste',
  'menu.pasteShortcut': 'Paste shortcut',
  'menu.displaySettings': 'Display settings',
  'menu.personalize': 'Personalize',
  'menu.open': 'Open',
  'menu.pinStart': 'Pin to Start',
  'menu.pinTaskbar': 'Pin to taskbar',
  'menu.properties': 'Properties',
  'menu.toolbars': 'Toolbars',
  'menu.toolbar.address': 'Address',
  'menu.toolbar.links': 'Links',
  'menu.toolbar.desktop': 'Desktop',
  'menu.search': 'Search',
  'menu.search.hidden': 'Hidden',
  'menu.search.icon': 'Show search icon',
  'menu.search.box': 'Show search box',
  'menu.lockTaskbar': 'Lock the taskbar',
  'menu.taskbarSettings': 'Taskbar settings',

  /* ---- Win+X menu ---- */
  'winx.programs': 'Programs and Features',
  'winx.powerOptions': 'Power Options',
  'winx.system': 'System',
  'winx.deviceManager': 'Device Manager',
  'winx.netConnections': 'Network Connections',
  'winx.diskMgmt': 'Disk Management',
  'winx.run': 'Run',
  'winx.shutdown': 'Shut down or sign out',

  /* ---- Power ---- */
  'power.power': 'Power',
  'power.sleep': 'Sleep',
  'power.shutdown': 'Shut down',
  'power.restart': 'Restart',
  'power.signout': 'Sign out',

  /* ---- Start menu ---- */
  'start.start': 'START',
  'start.group1': 'Life at a glance',
  'start.group2': 'Play and explore',
  'start.rail.documents': 'Documents',
  'start.rail.pictures': 'Pictures',

  /* ---- Search flyout ---- */
  'search.morning': 'Good morning',
  'search.afternoon': 'Good afternoon',
  'search.evening': 'Good evening',
  'search.topApps': 'Top apps',
  'search.quick': 'Quick searches',
  'search.q1': 'Weather today',
  'search.q2': 'Latest news',
  'search.q3': 'My documents',

  /* ---- Action center ---- */
  'ac.notifications': 'Notifications',
  'ac.clearAll': 'Clear all',
  'ac.none': 'No new notifications',
  'qa.tablet': 'Tablet mode',
  'qa.wifi': 'Wi-Fi',
  'qa.bluetooth': 'Bluetooth',
  'qa.airplane': 'Airplane mode',
  'qa.nightlight': 'Night light',
  'qa.location': 'Location',
  'qa.battery': 'Battery saver',
  'qa.vpn': 'VPN',
  'notif.1.title': 'Updates available',
  'notif.1.text':
    'A feature update is ready to be installed. Restart to finish updating.',
  'notif.2.title': 'Welcome!',
  'notif.2.text':
    'Thanks for trying the Windows 10 web demo. Everything runs client-side.',

  /* ---- Tray flyouts ---- */
  'net.connected': 'Connected, secured',
  'net.secured': 'Secured',
  'net.open': 'Open network',
  'net.off': 'Wi-Fi is turned off.',
  'net.settings': 'Network & Internet settings',
  'lang.prefs': 'Language preferences',

  /* ---- Calendar flyout ---- */
  'cal.dow': 'Su Mo Tu We Th Fr Sa',
  'cal.noEvents': 'No events today',

  /* ---- Update toast ---- */
  'upd.toast.title': 'Restart required',
  'upd.toast.body': 'An update is installed. Restart the desktop to finish.',
  'upd.toast.countdown': 'Restarting to finish updating in {s}s…',
  'upd.toast.restart': 'Restart now',
  'upd.toast.later': 'Not now',

  /* ---- Wallpapers ---- */
  'wp.hero': 'Windows Hero',
  'wp.lake': 'Twilight Lake',
  'wp.midnight': 'Midnight',
  'wp.blue': 'Solid Blue',
} as const

export const zh: Record<keyof typeof en, string> = {
  /* ---- Boot / power screens ---- */
  'boot.restarting': '正在重启',
  'boot.shuttingDown': '正在关机',
  'boot.powerOn': '单击以开机',

  /* ---- Lock / sign-in ---- */
  'lock.user': 'User',
  'lock.pin': 'PIN',
  'lock.signin': '登录',

  /* ---- Shell / taskbar ---- */
  'shell.search': '在此键入以进行搜索',

  /* ---- ARIA labels ---- */
  'aria.start': '开始',
  'aria.search': '搜索',
  'aria.taskview': '任务视图',
  'aria.showHidden': '显示隐藏的图标',
  'aria.network': '网络',
  'aria.volume': '音量',
  'aria.actionCenter': '操作中心',
  'aria.showDesktop': '显示桌面',
  'aria.language': '语言',
  'aria.dismiss': '消除',
  'aria.minimize': '最小化',
  'aria.maximize': '最大化',
  'aria.close': '关闭',
  'aria.back': '后退',
  'aria.forward': '前进',
  'aria.up': '向上',
  'aria.refresh': '刷新',
  'aria.home': '主页',
  'aria.favorites': '收藏夹',
  'aria.hub': '中心',
  'aria.more': '更多',
  'aria.signin': '登录',

  /* ---- Context menus ---- */
  'menu.view': '查看',
  'menu.icons.large': '大图标',
  'menu.icons.medium': '中等图标',
  'menu.icons.small': '小图标',
  'menu.sortBy': '排序方式',
  'menu.sort.name': '名称',
  'menu.sort.size': '大小',
  'menu.sort.type': '项目类型',
  'menu.sort.date': '修改日期',
  'menu.refresh': '刷新',
  'menu.paste': '粘贴',
  'menu.pasteShortcut': '粘贴快捷方式',
  'menu.displaySettings': '显示设置',
  'menu.personalize': '个性化',
  'menu.open': '打开',
  'menu.pinStart': '固定到“开始”屏幕',
  'menu.pinTaskbar': '固定到任务栏',
  'menu.properties': '属性',
  'menu.toolbars': '工具栏',
  'menu.toolbar.address': '地址',
  'menu.toolbar.links': '链接',
  'menu.toolbar.desktop': '桌面',
  'menu.search': '搜索',
  'menu.search.hidden': '隐藏',
  'menu.search.icon': '显示搜索图标',
  'menu.search.box': '显示搜索框',
  'menu.lockTaskbar': '锁定任务栏',
  'menu.taskbarSettings': '任务栏设置',

  /* ---- Win+X menu ---- */
  'winx.programs': '程序和功能',
  'winx.powerOptions': '电源选项',
  'winx.system': '系统',
  'winx.deviceManager': '设备管理器',
  'winx.netConnections': '网络连接',
  'winx.diskMgmt': '磁盘管理',
  'winx.run': '运行',
  'winx.shutdown': '关机或注销',

  /* ---- Power ---- */
  'power.power': '电源',
  'power.sleep': '睡眠',
  'power.shutdown': '关机',
  'power.restart': '重启',
  'power.signout': '注销',

  /* ---- Start menu ---- */
  'start.start': '开始',
  'start.group1': '生活动态',
  'start.group2': '播放和浏览',
  'start.rail.documents': '文档',
  'start.rail.pictures': '图片',

  /* ---- Search flyout ---- */
  'search.morning': '早上好',
  'search.afternoon': '下午好',
  'search.evening': '晚上好',
  'search.topApps': '常用应用',
  'search.quick': '快速搜索',
  'search.q1': '今日天气',
  'search.q2': '最新资讯',
  'search.q3': '我的文档',

  /* ---- Action center ---- */
  'ac.notifications': '通知',
  'ac.clearAll': '全部清除',
  'ac.none': '没有新通知',
  'qa.tablet': '平板模式',
  'qa.wifi': 'Wi-Fi',
  'qa.bluetooth': '蓝牙',
  'qa.airplane': '飞行模式',
  'qa.nightlight': '夜灯',
  'qa.location': '位置',
  'qa.battery': '节电模式',
  'qa.vpn': 'VPN',
  'notif.1.title': '有可用更新',
  'notif.1.text': '功能更新已准备就绪，可以安装。重启以完成更新。',
  'notif.2.title': '欢迎！',
  'notif.2.text': '感谢试用 Windows 10 网页演示。所有内容均在客户端运行。',

  /* ---- Tray flyouts ---- */
  'net.connected': '已连接，安全',
  'net.secured': '安全',
  'net.open': '开放网络',
  'net.off': 'Wi-Fi 已关闭。',
  'net.settings': '网络和 Internet 设置',
  'lang.prefs': '语言首选项',

  /* ---- Calendar flyout ---- */
  'cal.dow': '日 一 二 三 四 五 六',
  'cal.noEvents': '今天没有事件',

  /* ---- Update toast ---- */
  'upd.toast.title': '需要重启',
  'upd.toast.body': '更新已安装。重启桌面以完成更新。',
  'upd.toast.countdown': '将在 {s} 秒后重启以完成更新…',
  'upd.toast.restart': '立即重启',
  'upd.toast.later': '暂不',

  /* ---- Wallpapers ---- */
  'wp.hero': 'Windows 英雄',
  'wp.lake': '暮色湖泊',
  'wp.midnight': '午夜',
  'wp.blue': '纯蓝',
}
