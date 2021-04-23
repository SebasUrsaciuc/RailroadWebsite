const loadingBar = document.getElementById("loading-bar");
const subpageTitle = document.getElementById("subpage-title");
const subpageContent = document.getElementById("subpage-content");
let loadQueue = 0;
function loading() {
    if(loadQueue === 0)
        loadingBar.classList.add("loading");

    loadQueue++;
}
function loaded() {
    loadQueue = Math.max(0, loadQueue - 1);

    if(loadQueue === 0)
        loadingBar.classList.remove("loading");
}

function loadSubpage([title, path]) {
    loading();
    fetch(`./pages/wiki/${path}.html`)
        .then(response => {
            if(response.ok)
                return response.text();
            else
                throw "The response is not OK";
        }).then(data => {
            subpageTitle.innerHTML = title;
            subpageContent.innerHTML = data;

            loaded();
        }).catch(err => {
            loaded();

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

loading();
fetch("./res/wiki.json")
    .then(response => response.json())
    .then(data => {
        appendTree(data, sideBar);

        loaded();
    });