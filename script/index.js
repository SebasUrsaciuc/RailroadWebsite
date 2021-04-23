function download(url) {
    const a = document.createElement("a");
    a.href = url;
    a.click();
}

// SET SCROLL ATTRIBUTE WITH EVENTS
function getBodyScroll() {
    return Math.round(window.scrollY / (document.body.offsetHeight - window.innerHeight) * 100);
}

window.onscroll = function () {
    document.body.setAttribute("scroll", getBodyScroll().toString());
}