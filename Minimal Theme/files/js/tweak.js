// get filepath of tweak.js then modify that filepath to get filepath of editor.css
var script = document.currentScript;
var fullUrl = script.src;
newpath = fullUrl.replace("js/tweak.js", "css/editor.css");
//alert(newpath);


// add editor.css to shadowroot that contains field
function main_func() {
    var field_nodes = document.querySelector("#fields").childElementCount;

    for (i = 1; i != (field_nodes + 1); i++) {
        var new3 = document.createElement("link");
        new3.setAttribute("rel", "stylesheet");
        new3.setAttribute("href", newpath);
        var node = document.querySelector(`#fields > div:nth-child(${i}) > div.field`).shadowRoot;

        // to prevent infite additions of editor.css when field is updated in 
        // browse, only add if not present (i.e. child nodes < 4)
        if (node.childElementCount < 4) {
            node.insertBefore(new3, node.childNodes[1]);
            alert('added css');
        };
        
    };
};
//                function    ms
// window.setTimeout(main_func, 100)



// Select the node that will be observed for mutations
const targetNode = document.getElementById('fields');

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            main_func();
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Later, you can stop observing
// observer.disconnect();
