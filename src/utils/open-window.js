/**
 * 由PanJiaChen于16/11/29创建。
 * 这是一个用于打开新窗口的函数。
 * @param {String} url - 要在新窗口中打开的URL
 * @param {String} title - 新窗口的标题
 * @param {Number} w - 新窗口的宽度
 * @param {Number} h - 新窗口的高度
 */
export default function openWindow(url, title, w, h) {
    // 修复双屏幕位置问题，兼容大多数浏览器和Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

    // 获取当前窗口的宽度和高度
    const width = window.innerWidth || document.documentElement.clientWidth || screen.width
    const height = window.innerHeight || document.documentElement.clientHeight || screen.height

    // 计算新窗口的左侧和顶部位置，使其居中
    const left = ((width / 2) - (w / 2)) + dualScreenLeft
    const top = ((height / 2) - (h / 2)) + dualScreenTop

    // 打开新窗口，设置各种参数
    const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

    // 如果浏览器支持，将焦点设置到新窗口
    if (window.focus) {
        newWindow.focus()
    }
}

