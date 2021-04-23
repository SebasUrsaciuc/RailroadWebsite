const loadingBar = document.getElementById("loading-bar");
const subpageTitle = document.getElementById("subpage-title");
const subpageContent = document.getElementById("subpage-content");

function XHR(url, loadend, error = () => {}) {
    const xhr = new XMLHttpRequest();

    xhr.onloadstart = function () {
        loadingBar.classList.add("loading");
    };
    xhr.onprogress = function (e) {
        loadingBar.style.width = `${e.loaded / e.total * 100}%`;
    };
    xhr.onloadend = function () {
        loadingBar.classList.remove("loading");
    };
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200)
            loadend(this.responseText);
        else if(this.status === 404) {
            error();
        }
    }

    xhr.open("GET", url);
    xhr.send();
}

function loadSubpage([title, path]) {
    XHR(`./pages/wiki/${path}.html`, response => {
        subpageTitle.innerHTML = title;
        subpageContent.innerHTML = response;
    }, () => {
        if(path !== "error")
            loadSubpage([title, "error"]);
        else
            alert("Something went wrong loading the error page...");
    });
}

function appendTree(obj, elem, stage = 0) {
    if(obj?.constructor !== Array)
        obj = ["", obj];

    if(obj[1]?.constructor === Object) {
        const container = document.createElement("ul");

        if(stage > 0) {
            const upperElem = document.createElement("li");
            elem.appendChild(upperElem);

            const span = document.createElement("span");
            span.innerHTML = obj[0];
            span.classList.add("subtree-label");
            span.onclick = (e) => e.target.classList.toggle("enabled");
            span.style.setProperty("--stage", stage.toString());
            upperElem.appendChild(span);

            container.classList.add("subtree");
            upperElem.appendChild(container);
        } else {
            container.classList.add("tree");
            elem.appendChild(container);
        }

        for(const e of Object.entries(obj[1])) {
            appendTree(e, container, stage + 1);
        }

        return;
    }

    const newElem = document.createElement("li");
    newElem.innerText = obj[0].toString();
    newElem.onclick = (e) => loadSubpage(obj);
    newElem.classList.add("tree-item");
    newElem.style.setProperty("--stage", stage.toString());
    elem.appendChild(newElem);
}



const sideBar = document.getElementById("sidebar");

XHR("./res/wiki.json", data => {
    appendTree(JSON.parse(data), sideBar);
});