function main_func() {
    var field_nodes = document.querySelector("#fields").childElementCount

    for (i = 1; i != (field_nodes + 1); i++) {

        var new3 = document.createElement("link")
        new3.setAttribute("rel", "stylesheet")
        new3.setAttribute("href", "./_addons/867316254/files/editor.css")
        var node = document.querySelector(`#fields > div:nth-child(${i}) > div.field`).shadowRoot
        node.insertBefore(new3, node.childNodes[1])

    } 
    
}
//                                                       function    ms
document.body.addEventListener("load", window.setTimeout(main_func, 100));
