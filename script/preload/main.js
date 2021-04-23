// SET MANUAL SCROLL RESTORATION
history.scrollRestoration = "manual";

// EXTERN DEFINITION
class Extern extends HTMLElement {
    constructor() {
        super();

        fetch(this.getAttribute("href"))
            .then(data => data.text())
            .then(result => {
                this.innerHTML = result;

                this.replaceWith(this.firstChild);
            });
    }
}

customElements.define("ext-data", Extern);