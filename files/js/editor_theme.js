
/* ------------------------------------------------------------------------------
#
# MIT License
#
# Copyright (c) 2021 nogira
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#
# --------------------------------------------------------------------------- */

function executeWrapSelectionInElems(...nodesForWrap) {
    const numTextBoxes = $("#fields").children().length

    for (let i = 1; i != (numTextBoxes + 1); i++) {
        const selector = `#fields > div:nth-child(${i}) > div.field`;
        const node = document.querySelector(selector).shadowRoot;
        // use try in case nothing is selected
        try {
            const range = node.getSelection().getRangeAt(0);

            // use try in case user tries to semi-overlap html tags which doesn't work
            try {
                for (const nodeForWrap of nodesForWrap) {
                    range.surroundContents(nodeForWrap);
                }
                
            } catch (e) {
                alert(`Can't semi-overlap HTML tags!

Illustrative Example:
- Good
  <bold>text</bold> <italic>text</italic>

- Also Good
  <bold><italic>text</italic></bold>text

- BAD !!
  <bold><italic>text</bold> text</italic>`)
//    └──────────┘     └────────────┘
//    │      └────────────┘       │
//    └───────────────────────────┘
//    │      └───────────┼────────────┘
//    └──────────────────┘
            }
        } catch (e) {/* do nothing on error */}
    }
}

function createNode(elem, ...attrs) {
    const node = document.createElement(elem);
    if (attrs) {
        for (const attr of attrs) {
            node.setAttribute(attr[0], attr[1])
        }
    }
    return node
}
//                           one elem per arg, with each arg being an array. 
//                           elems is array
function wrapSelectionInElems(...elems) {
    const nodesForWrap = [];
    // get each elem from array elems, 
    for (const elem of elems) {
        // separate the tag from attributes, with each set of attribute being 
        // an array, thus, attrs is an array of arrays
        // ["tag", ["attr1", "val1"], ["attr2", "val2"]]
        const [tag, ...attrs] = elem;
        // tag = "tag"
        // attrs = [["attr1", "val1"], ["attr2", "val2"]]
        // add to array in reverse so order of wrapping is correct
        //                                 convert attrs array to args
        nodesForWrap.unshift(createNode(tag, ...attrs));
    }
    executeWrapSelectionInElems(...nodesForWrap);
}

function wrapSelectionInElem(elem, ...attrs) {
    const nodeForWrap = createNode(elem, ...attrs);
    // console.log(nodeForWrap)
    executeWrapSelectionInElems(nodeForWrap);
}

function addPre(lang) {
    wrapSelectionInElems(["pre"], ["code", ["class", `lang-${lang}`]]);
}

// add editor.css to each editor field (have to make sure its within shadowroot)
function changeFields() {
    {
        // get src of editor_theme.js script then modify that path to get path 
        // of editor.css
        const scriptUrl = $("#editor-script").prop("src")
        const newPath = scriptUrl.replace("js/editor_theme.js", "css/editor.css");

        const fieldElemNodes = $("#fields").children().length;

        for (let i = 1; i != (fieldElemNodes + 1); i++) {
            const selector = `#fields > div:nth-child(${i}) > div.field`;
            const node = document.querySelector(selector).shadowRoot;

            // to prevent infite additions of editor.css when field is updated 
            // in browse, only add if not present
            // if not present, this = null
            const cssElemPresent = node.querySelector(`[href="${newPath}"]`);

            if (!cssElemPresent) {
                const newCSSElem = document.createElement("link");
                newCSSElem.setAttribute("rel", "stylesheet");
                newCSSElem.setAttribute("href", newPath);
                node.insertBefore(newCSSElem, node.childNodes[1]);
            }
        }
    }

    // -------------------------------------------------------------------------

    const pinIcon = '<svg class="icn-dmns" width="13" height="13" viewBox="0 0 384 512" class="bi bi-pin-angle"><path fill="currentColor" d="M306.5 186.6l-5.7-42.6H328c13.2 0 24-10.8 24-24V24c0-13.2-10.8-24-24-24H56C42.8 0 32 10.8 32 24v96c0 13.2 10.8 24 24 24h27.2l-5.7 42.6C29.6 219.4 0 270.7 0 328c0 13.2 10.8 24 24 24h144v104c0 .9.1 1.7.4 2.5l16 48c2.4 7.3 12.8 7.3 15.2 0l16-48c.3-.8.4-1.7.4-2.5V352h144c13.2 0 24-10.8 24-24 0-57.3-29.6-108.6-77.5-141.4zM50.5 304c8.3-38.5 35.6-70 71.5-87.8L138 96H80V48h224v48h-58l16 120.2c35.8 17.8 63.2 49.4 71.5 87.8z"></path></svg>';
    const pinElements = document.querySelectorAll("svg.bi-pin-angle");
    for (let i = 0; i != pinElements.length; i++) {
            pinElements[i].parentElement.innerHTML = pinIcon;
    }

};

function changeTopButtons() {

    // ----------------------------MODIFY BUTTON CSS----------------------------


    // remove "..." from fields button and cards button
    {
        // iterate through child 1 & 2 to change text of each child
        for (let i = 1; i < 3; i++) {
            const selector = `#notetype > div > div:nth-child(${i}) > button`
            $(selector).html((i, currentHTML) => currentHTML.replace("...", ""))
        }
    }

    // uses 'font awesome' icons

    const svgTagStart = '<svg class="icn-dmns"'

    const icons = [
        {"svg": ' viewBox="0 0 384 512"><path fill="currentColor" d="M314.52 238.78A119.76 119.76 0 0 0 232 32H48a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h16v352H48a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h208a128 128 0 0 0 128-128c0-49.49-28.38-91.92-69.48-113.22zM128 80h88a72 72 0 0 1 0 144h-88zm112 352H128V272h112a80 80 0 0 1 0 160z"></path></svg>',
        "selector": "svg.bi-type-bold"}, // bold icon
        {"svg": ' viewBox="0 0 320 512"><path fill="currentColor" d="M320 48v16a16 16 0 0 1-16 16h-67l-88 352h59a16 16 0 0 1 16 16v16a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16v-16a16 16 0 0 1 16-16h67l88-352h-59a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h192a16 16 0 0 1 16 16z"></path></svg>',
        "selector": "svg.bi-type-italic"}, // italic icon
        {"svg": ' viewBox="0 0 448 512"><path fill="currentColor" d="M32 48h32v208c0 88.22 71.78 160 160 160s160-71.78 160-160V48h32a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16H288a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h32v208a96 96 0 0 1-192 0V48h32a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16H32a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16zm400 416H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16z"></path></svg>',
        "selector": "svg.bi-type-underline"}, // underline icon
        {"svg": ' viewBox="0 0 512 512"><path fill="currentColor" d="M336 64h-52.28a16 16 0 0 0-13.31 7.12L176 212.73 81.59 71.12A16 16 0 0 0 68.28 64H16A16 16 0 0 0 0 80v16a16 16 0 0 0 16 16h35.16l96 144-96 144H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h52.28a16 16 0 0 0 13.31-7.12L176 299.27l94.41 141.61a16 16 0 0 0 13.31 7.12H336a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16h-35.16l-96-144 96-144H336a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm160 112h-24V16a16 16 0 0 0-16-16h-32a16 16 0 0 0-14.29 8.83l-16 32A16 16 0 0 0 408 64h16v112h-24a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h96a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16z"></path></svg>',
        "selector": "svg#mdi-format-superscript"}, // superscript icon
        {"svg": ' viewBox="0 0 512 512"><path fill="currentColor" d="M336 64h-52.28a16 16 0 0 0-13.31 7.12L176 212.73 81.59 71.12A16 16 0 0 0 68.28 64H16A16 16 0 0 0 0 80v16a16 16 0 0 0 16 16h35.16l96 144-96 144H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h52.28a16 16 0 0 0 13.31-7.12L176 299.27l94.41 141.61a16 16 0 0 0 13.31 7.12H336a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16h-35.16l-96-144 96-144H336a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm160 400h-24V304a16 16 0 0 0-16-16h-32a16 16 0 0 0-14.29 8.83l-16 32A16 16 0 0 0 408 352h16v112h-24a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h96a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16z"></path></svg>',
        "selector": "svg#mdi-format-subscript"}, // subscript icon
        {"svg": ' viewBox="0 0 640 512"><path fill="currentColor" d="M634 471L36 3.5A16 16 0 0 0 13.49 6l-10 12.5A16 16 0 0 0 6 41l598 467.5a16 16 0 0 0 22.5-2.5l10-12.5A16 16 0 0 0 634 471zM352 96l-24.76 74.27L378 210l38-114h144v32a16 16 0 0 0 16 16h16a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16H176a15.86 15.86 0 0 0-14.18 8.94L232.24 96zm-16 336h-32l25.68-77-50.77-39.7L240 432h-32a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16z"></path></svg>',
        "selector": "svg.bi-eraser"}, // remove html icon
        // ---------------------------------------------------------------------
        {"svg": ' viewBox="0 0 512 512"><path fill="currentColor" d="M48 368a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0-160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0-160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm448 24H176a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V88a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16z"></path></svg>',
        "selector": "svg.bi-list-ul"}, // unordered list icon
        {"svg": ' viewBox="0 0 512 512"><path fill="currentColor" d="M61.77 401l17.5-20.15a19.92 19.92 0 0 0 5.07-14.19v-3.31C84.34 356 80.5 352 73 352H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h22.84a154.82 154.82 0 0 0-11 12.31l-5.61 7c-4 5.07-5.25 10.13-2.8 14.88l1.05 1.93c3 5.76 6.3 7.88 12.25 7.88h4.73c10.33 0 15.94 2.44 15.94 9.09 0 4.72-4.2 8.22-14.36 8.22a41.54 41.54 0 0 1-15.47-3.12c-6.49-3.88-11.74-3.5-15.6 3.12l-5.59 9.31c-3.73 6.13-3.2 11.72 2.62 15.94 7.71 4.69 20.39 9.44 37 9.44 34.16 0 48.5-22.75 48.5-44.12-.03-14.38-9.12-29.76-28.73-34.88zM496 392H176a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V88a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zM16 160h64a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H64V40a8 8 0 0 0-8-8H32a8 8 0 0 0-7.14 4.42l-8 16A8 8 0 0 0 24 64h8v64H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8zm-3.9 160H80a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H41.33c3.28-10.29 48.33-18.68 48.33-56.44 0-29.06-25-39.56-44.47-39.56-21.36 0-33.8 10-40.45 18.75-4.38 5.59-3 10.84 2.79 15.37l8.58 6.88c5.61 4.56 11 2.47 16.13-2.44a13.4 13.4 0 0 1 9.45-3.84c3.33 0 9.28 1.56 9.28 8.75C51 248.19 0 257.31 0 304.59v4C0 316 5.08 320 12.1 320z"></path></svg>',
        "selector": "svg.bi-list-ol"}, // ordered list icon
        {"svg": ' viewBox="0 0 448 512"><path fill="currentColor" d="M415 32H191a160 160 0 0 0 0 320h48v112a16 16 0 0 0 16 16h16a16 16 0 0 0 16-16V80h48v384a16 16 0 0 0 16 16h16a16 16 0 0 0 16-16V80h32a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM239 304h-48a112 112 0 0 1 0-224h48z"></path></svg>',
        "selector": "svg.bi-text-paragraph"},  // paragraph icon
        {"svg": ' viewBox="0 0 448 512"><path fill="currentColor" d="M12.83 344h262.34A12.82 12.82 0 0 0 288 331.17v-22.34A12.82 12.82 0 0 0 275.17 296H12.83A12.82 12.82 0 0 0 0 308.83v22.34A12.82 12.82 0 0 0 12.83 344zm0-256h262.34A12.82 12.82 0 0 0 288 75.17V52.83A12.82 12.82 0 0 0 275.17 40H12.83A12.82 12.82 0 0 0 0 52.83v22.34A12.82 12.82 0 0 0 12.83 88zM432 168H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16z"></path></svg>',
        "selector": "svg.bi-text-left"}, // align left icon
        {"svg": ' viewBox="0 0 448 512"><path fill="currentColor" d="M108.1 88h231.81A12.09 12.09 0 0 0 352 75.9V52.09A12.09 12.09 0 0 0 339.91 40H108.1A12.09 12.09 0 0 0 96 52.09V75.9A12.1 12.1 0 0 0 108.1 88zM432 424H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0-256H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm-92.09 176A12.09 12.09 0 0 0 352 331.9v-23.81A12.09 12.09 0 0 0 339.91 296H108.1A12.09 12.09 0 0 0 96 308.09v23.81a12.1 12.1 0 0 0 12.1 12.1z"></path></svg>',
        "selector": "svg.bi-text-center"}, // align centre icon
        {"svg": ' viewBox="0 0 448 512"><path fill="currentColor" d="M16 216h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16zm416 208H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 52.83v22.34A12.82 12.82 0 0 0 172.83 88h262.34A12.82 12.82 0 0 0 448 75.17V52.83A12.82 12.82 0 0 0 435.17 40zm0 256H172.83A12.82 12.82 0 0 0 160 308.83v22.34A12.82 12.82 0 0 0 172.83 344h262.34A12.82 12.82 0 0 0 448 331.17v-22.34A12.82 12.82 0 0 0 435.17 296z"></path></svg>',
        "selector": "svg.bi-text-right"}, // align right icon
        {"svg": ' viewBox="0 0 448 512"><path fill="currentColor" d="M432 424H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0-128H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0-128H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0-128H16A16 16 0 0 0 0 56v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16z"></path></svg>',
        "selector": "svg.bi-justify"}, // align justify icon
        // {"svg": ,
        // "selector": "svg.bi-text-indent-right"}, // indent icon
        // {"svg": ,
        // "selector": "svg.bi-text-indent-left"}, // outdent icon
        // ---------------------------------------------------------------------
        {"svg": ' viewBox="0 0 448 512" id="mdi-format-color-text"><path fill="currentColor" d="M432 432h-33.32l-135-389.24A16 16 0 0 0 248.55 32h-49.1a16 16 0 0 0-15.12 10.76L49.32 432H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16h-35.44l33.31-96h164.26l33.31 96H304a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zM158.53 288L224 99.31 289.47 288z"></path></svg>',
        "selector": "svg#mdi-format-color-text"}, // text color icon
        {"svg": ' viewBox="0 0 544 512"><g class="fa-group"><path d="M0 480l99.92 32 35.45-35.45-67-67zM527.92 79.27l-63.2-63.2a54.89 54.89 0 0 0-75.12-2.35l-199 170 169.72 169.74 170-199.06a54.88 54.88 0 0 0-2.4-75.13z" class="fa-secondary" id="mdi-color-helper"/><path d="M75.94 371.84l50.93-50.94-13.05-42.83A36.6 36.6 0 0 1 124.61 240l41.52-35.44 173.34 173.31-35.55 41.64a36.59 36.59 0 0 1-38.15 10.78L223 417.21l-50.86 50.86z" /></g></svg>',
        "selector": "svg#mdi-format-color-highlight"}, // highlight icon
        // ---------------------------------------------------------------------
        {"svg": ' viewBox="0 0 512 512"><path fill="currentColor" d="M67.508 468.467c-58.005-58.013-58.016-151.92 0-209.943l225.011-225.04c44.643-44.645 117.279-44.645 161.92 0 44.743 44.749 44.753 117.186 0 161.944l-189.465 189.49c-31.41 31.413-82.518 31.412-113.926.001-31.479-31.482-31.49-82.453 0-113.944L311.51 110.491c4.687-4.687 12.286-4.687 16.972 0l16.967 16.971c4.685 4.686 4.685 12.283 0 16.969L184.983 304.917c-12.724 12.724-12.73 33.328 0 46.058 12.696 12.697 33.356 12.699 46.054-.001l189.465-189.489c25.987-25.989 25.994-68.06.001-94.056-25.931-25.934-68.119-25.932-94.049 0l-225.01 225.039c-39.249 39.252-39.258 102.795-.001 142.057 39.285 39.29 102.885 39.287 142.162-.028A739446.174 739446.174 0 0 1 439.497 238.49c4.686-4.687 12.282-4.684 16.969.004l16.967 16.971c4.685 4.686 4.689 12.279.004 16.965a755654.128 755654.128 0 0 0-195.881 195.996c-58.034 58.092-152.004 58.093-210.048.041z"></path></svg>',
        "selector": "svg.bi-paperclip"}, // paperclip icon
        {"svg": ' viewBox="0 0 352 512"><path fill="currentColor" d="M336 192h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16zM176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zM128 96c0-26.47 21.53-48 48-48s48 21.53 48 48v160c0 26.47-21.53 48-48 48s-48-21.53-48-48V96z"></path></svg>',
        "selector": "svg.bi-mic"}, // record icon
        // {"svg": ' width="100%" height="100%" viewBox="0 0 448 512" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path fill="currentColor" d="M128,32L32,32C14.445,32 -0,46.445 0,64L0,448C0,465.555 14.445,480 32,480L128,480C136.777,480 144,472.777 144,464L144,448C144,439.223 136.777,432 128,432L48,432L48,80L128,80C136.777,80 144,72.777 144,64L144,48C144,39.223 136.777,32 128,32ZM416,32L320,32C311.223,32 304,39.223 304,48L304,64C304,72.777 311.223,80 320,80L400,80L400,432L320,432C311.223,432 304,439.223 304,448L304,464C304,472.777 311.223,480 320,480L416,480C433.555,480 448,465.555 448,448L448,64C448,46.445 433.555,32 416,32Z" style="fill-rule:nonzero;"/><g transform="matrix(0.791667,0,0,0.791667,80,280.471)"><path fill="currentColor" d="M48,48C21.668,48 -0,69.668 0,96C0,122.332 21.668,144 48,144C74.332,144 96,122.332 96,96C96,69.668 74.332,48 48,48Z" style="fill-rule:nonzero;"/></g><g transform="matrix(0.791667,0,0,0.791667,292,280.471)"><path fill="currentColor" d="M48,48C21.668,48 -0,69.668 0,96C0,122.332 21.668,144 48,144C74.332,144 96,122.332 96,96C96,69.668 74.332,48 48,48Z" style="fill-rule:nonzero;"/></g><g transform="matrix(0.791667,0,0,0.791667,186,280.471)"><path fill="currentColor" d="M48,48C21.668,48 -0,69.668 0,96C0,122.332 21.668,144 48,144C74.332,144 96,122.332 96,96C96,69.668 74.332,48 48,48Z" style="fill-rule:nonzero;"/></g></svg>',
        // "selector": "svg.#mdi-contain"}, // cloze icon
        {"svg": ' viewBox="0 0 640 512"><path fill="currentColor" d="M224 48c0-8.84-7.16-16-16-16h-48c-48.6 0-88 39.4-88 88v48H16c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h56v144c0 22.09-17.91 40-40 40H16c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h16c48.6 0 88-39.4 88-88V216h56c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-48c0-22.09 17.91-40 40-40h48c8.84 0 16-7.16 16-16V48zm93.43 60.92l-12.8-9.63c-7.22-5.44-17.81-4.01-22.92 3.41C244.39 157 224 222.17 224 288c0 65.85 20.39 131.02 57.71 185.3 5.11 7.43 15.7 8.85 22.92 3.41l12.8-9.63c6.84-5.14 8.09-14.54 3.28-21.59C289.2 399.27 272 343.92 272 288c0-55.91 17.2-111.26 48.71-157.5 4.8-7.05 3.55-16.44-3.28-21.58zm264.86-6.22c-5.11-7.43-15.7-8.85-22.92-3.41l-12.8 9.63c-6.84 5.14-8.09 14.54-3.28 21.59C574.8 176.73 592 232.08 592 288c0 55.91-17.2 111.26-48.71 157.5-4.8 7.05-3.55 16.44 3.28 21.59l12.8 9.63c7.22 5.44 17.81 4.02 22.92-3.41C619.61 419 640 353.83 640 288c0-65.85-20.39-131.02-57.71-185.3zm-74.84 120.84l-10.99-10.99c-6.07-6.07-15.91-6.07-21.98 0L432 255.03l-42.47-42.47c-6.07-6.07-15.91-6.07-21.98 0l-10.99 10.99c-6.07 6.07-6.07 15.91 0 21.98L399.03 288l-42.47 42.47c-6.07 6.07-6.07 15.91 0 21.98l10.99 10.99c6.07 6.07 15.91 6.07 21.98 0L432 320.97l42.47 42.47c6.07 6.07 15.91 6.07 21.98 0l10.99-10.99c6.07-6.07 6.07-15.91 0-21.98L464.97 288l42.47-42.47c6.08-6.07 6.08-15.92.01-21.99z"></path></svg>',
        "selector": "svg#mdi-function-variant"}, //func icon
        {"svg": ' viewBox="0 0 576 512"><path fill="currentColor" d="M234.8 511.7L196 500.4c-4.2-1.2-6.7-5.7-5.5-9.9L331.3 5.8c1.2-4.2 5.7-6.7 9.9-5.5L380 11.6c4.2 1.2 6.7 5.7 5.5 9.9L244.7 506.2c-1.2 4.3-5.6 6.7-9.9 5.5zm-83.2-121.1l27.2-29c3.1-3.3 2.8-8.5-.5-11.5L72.2 256l106.1-94.1c3.4-3 3.6-8.2.5-11.5l-27.2-29c-3-3.2-8.1-3.4-11.3-.4L2.5 250.2c-3.4 3.2-3.4 8.5 0 11.7L140.3 391c3.2 3 8.2 2.8 11.3-.4zm284.1.4l137.7-129.1c3.4-3.2 3.4-8.5 0-11.7L435.7 121c-3.2-3-8.3-2.9-11.3.4l-27.2 29c-3.1 3.3-2.8 8.5.5 11.5L503.8 256l-106.1 94.1c-3.4 3-3.6 8.2-.5 11.5l27.2 29c3.1 3.2 8.1 3.4 11.3.4z"></path></svg>',
        "selector": "svg#mdi-xml"}, // html icon
    ]
    for (let icon of icons) {
        document.querySelector(icon.selector).parentElement.innerHTML = svgTagStart + icon.svg
    }

        // -------------------------------ADD BUTTONS-------------------------------

        {
            const node = document.querySelector("#blockFormatting > div:nth-child(1)");
    
            const codeBlockBtn = document.createElement("div");
            codeBlockBtn.setAttribute("class", " svelte-13ncvxj");
            codeIcon = svgTagStart + ' viewBox="0 0 576 512"><path fill="currentColor" d="M208 32h-88a56 56 0 0 0-56 56v77.49a40 40 0 0 1-11.72 28.29L7 239a24 24 0 0 0 0 34l45.24 45.24A40 40 0 0 1 64 346.52V424a56 56 0 0 0 56 56h88a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16h-88a8 8 0 0 1-8-8v-77.48a88.06 88.06 0 0 0-25.78-62.24L57.93 256l28.29-28.28A88.06 88.06 0 0 0 112 165.48V88a8 8 0 0 1 8-8h88a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zm361 207l-45.25-45.24A40.07 40.07 0 0 1 512 165.48V88a56 56 0 0 0-56-56h-88a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h88a8 8 0 0 1 8 8v77.48a88 88 0 0 0 25.78 62.24L518.06 256l-28.28 28.28A88 88 0 0 0 464 346.52V424a8 8 0 0 1-8 8h-88a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h88a56 56 0 0 0 56-56v-77.49a40 40 0 0 1 11.72-28.29L569 273a24 24 0 0 0 0-34z"></path></svg>'
            
            // sending message to python config file to send back all the list of code 
            // languages in the config file
            pycmd('code_lang_html', (returned) => {
                codeBlockBtn.innerHTML = `
                    <div class="dropdown svelte-13ncvxj">
                        <button class="btn dropdown-toggle btn-day svelte-9lxpor" dropdown="true" data-bs-toggle="dropdown" tabindex="-1" style="--icon-size: 75%;" aria-expanded="false">
                            <span style="--width-multiplier: 1;" class="svelte-9lxpor">
                                ${codeIcon}
                            </span>
                        </button>
                        <div class="dropdown-menu svelte-9q3irh">
                            ${returned}
                        </div>
                    </div>`;
                node.appendChild(codeBlockBtn);
            });
        }
    
        // -----------------
    
        // INLINE BUTTONS
    
        const inlineFormatBtnGroupSelector = "#inlineFormatting > div:nth-child(1)"
        const firstBtnSelector = inlineFormatBtnGroupSelector + " > div:nth-child(1)"
        const btnHtml = $(firstBtnSelector).html().replace('disabled=""', "");
    
        // strikethough icon
        hideIcon = svgTagStart + ' viewBox="0 0 512 512"><path fill="currentColor" d="M150.39 208h113.17l-46.31-23.16a45.65 45.65 0 0 1 0-81.68A67.93 67.93 0 0 1 247.56 96H310a45.59 45.59 0 0 1 36.49 18.25l15.09 20.13a16 16 0 0 0 22.4 3.21l25.62-19.19a16 16 0 0 0 3.21-22.4L397.7 75.84A109.44 109.44 0 0 0 310.1 32h-62.54a132.49 132.49 0 0 0-58.94 13.91c-40.35 20.17-64.19 62.31-60.18 108 1.76 20.09 10.02 38.37 21.95 54.09zM496 240H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h480a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm-92.5 80h-91.07l14.32 7.16a45.65 45.65 0 0 1 0 81.68 67.93 67.93 0 0 1-30.31 7.16H234a45.59 45.59 0 0 1-36.49-18.25l-15.09-20.13a16 16 0 0 0-22.4-3.21L134.4 393.6a16 16 0 0 0-3.21 22.4l15.11 20.17A109.44 109.44 0 0 0 233.9 480h62.54a132.42 132.42 0 0 0 58.93-13.91c40.36-20.17 64.2-62.31 60.19-108-1.19-13.69-5.89-26.27-12.06-38.09z"></path></svg>'
        $(firstBtnSelector).clone()
            .html(btnHtml.replace(/<svg.+?svg>/, hideIcon)
                         .replace(/Bold.+?\)/, "Strikethrough")
                         .replace(/(?=drop)/, 'onclick="wrapSelectionInElem(`s`)" '))
            .insertAfter(inlineFormatBtnGroupSelector + " > div:nth-child(3)");
        
        // inline code icon
        $(firstBtnSelector).clone()
            .html(btnHtml.replace(/<svg.+?svg>/, codeIcon)
                         .replace(/Bold.+?\)/, "Inline Code")
                         .replace(/(?=drop)/, 'onclick="wrapSelectionInElem(`code`)" '))
            .appendTo(inlineFormatBtnGroupSelector);
    
        // -----------------
    
        // var node4 = document.querySelector("div#inlineFormatting div.btn-group.svelte-1x2qjkh");
    
        // button4 = document.createElement("div");
        // button4.setAttribute("class", " svelte-13ncvxj");
        // tooltip_icon = '<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icn-dmns"><path fill="currentColor" d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288zM128 176c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm128 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm128 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z"></path></svg>'
    
        // button4.innerHTML = `<button class="btn btn-day svelte-9lxpor" title="Inline Code" dropdown="false" tabindex="-1" style="--icon-size: 75%;" onclick="addT();" aria-expanded="false">
        //                         <span style="--width-multiplier: 1;" class="svelte-9lxpor">
        //                             ${tooltip_icon}
        //                         </span>
        //                     </button>`
    
        // node4.appendChild(button4);
    
        // -----------------
    
        // REMOVE BUTTONS
    
        $('[title="Unordered list"]').parent().remove();
        $('[title="Ordered list"]').parent().remove();
        $('#justify').parent().parent().parent().remove();
    
        // $('[title="Attach pictures/audio/video (F3)"]').parent().remove();
        // $('[title="Record audio (F5)"]').parent().remove();
    
}



$(document).ready(() => {
    changeTopButtons();

    // using delay bc fields dont load immediately (they load from js)
    //                  function    ms
    window.setTimeout(changeFields, 100)
    // changeFields();



    // Select the node that will be observed for mutations
    const targetNode = document.getElementById('fields');
    // now that im doing editor icons too (specifically the cloze icon), I need 
    // to check for updates in whole html body
    // const targetNode = document.body; // updating whole body causes continuous loop

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                changeFields();
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Later, you can stop observing
    // observer.disconnect();
})



// -------------------------CHECK IF BUTTONS DISABLED

// aria-expanded="false" VS disabled=""