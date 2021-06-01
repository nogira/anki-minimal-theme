# ------------------------------------------------------------------------------
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
# ------------------------------------------------------------------------------

from typing import Any, Optional
import aqt
aqt.mw.addonManager.setWebExports(__name__, r"files/.*\.(css|svg|js)")
addon_package = aqt.mw.addonManager.addonFromModule(__name__)
# for debugging since cant use print
from aqt.utils import showText

# class WebContent:
#     """Stores all dynamically modified content that a particular web view
#     will be populated with.
#     Attributes:
#         body {str} -- HTML body
#         head {str} -- HTML head
#         css {List[str]} -- List of media server subpaths,
#                            each pointing to a CSS file
#         js {List[str]} -- List of media server subpaths,
#                           each pointing to a JS file

def on_webview_will_set_content(
    web_content: aqt.webview.WebContent, context: Optional[Any]
) -> None:
    # for all
    web_content.css.append(f"/_addons/{addon_package}/files/all.css")
    if isinstance(context, aqt.toolbar.TopToolbar):
        web_content.css.append(f"/_addons/{addon_package}/files/top_toolbar.css")
        # maybe the below things dont work because of some issue with python reading the text
        # for example, the html text has a lot of quotation marks which would fuckup the string
        web_content.body = web_content.body.replace("Shortcut key: D", "Decks\nShortcut: D")
        web_content.body = web_content.body.replace("Shortcut key: A", "Add Card\nShortcut: A")
        web_content.body = web_content.body.replace("Shortcut key: B", "Browse\nShortcut: B")
        web_content.body = web_content.body.replace("Shortcut key: T", "Stats\nShortcut: T")
        web_content.body = web_content.body.replace("Shortcut key: Y", "Sync\nShortcut: Y")
    elif isinstance(context, aqt.deckbrowser.DeckBrowser):
        web_content.css.append(f"/_addons/{addon_package}/files/home.css")
    elif isinstance(context, aqt.toolbar.BottomToolbar):
        # this one doesnt work for some reason
        web_content.css.append(f"/_addons/{addon_package}/files/bottom_toolbar.css")
    elif isinstance(context, aqt.reviewer.ReviewerBottomBar):
        web_content.css.append(f"/_addons/{addon_package}/files/reviewer_bottom.css")
    elif isinstance(context, aqt.editor.Editor):
        web_content.css.append(f"/_addons/{addon_package}/files/editor-window.css")
        web_content.css.append(f"/_addons/{addon_package}/files/prism.css")
        web_content.js.append(f"/_addons/{addon_package}/files/prism.js")
        web_content.body = web_content.body.replace("Fields...", "Fields")
        web_content.body = web_content.body.replace("Cards...", "Cards")
        # web_content.body = web_content.body.replace('<link rel="stylesheet" href="./_anki/css/editable.css">', '<link rel="stylesheet" href="./_anki/css/editable.css"><link rel="stylesheet" href="http://127.0.0.1:56940/_addons/FormatPackStylingRefresh/files/prism.css"><script src="http://127.0.0.1:56940/_addons/FormatPackStylingRefresh/files/prism.js"></script>')
        
        # try adding new js that runs after editor.js
        # web_content.js.append(f"/_addons/{addon_package}/files/tweak.js")

        # add script after html has loaded to make sure shadowroot is present
        web_content.head += f'<script async src="/_addons/{addon_package}/files/tweak.js"></script>'

        # ---didnt work---

            # addingto shadowroot:
                # var path = document.location.pathname;
                # var directory = path.substring(path.indexOf('/'), path.lastIndexOf('/'));
                
                # const e1=document.createElement("link");e1.setAttribute("rel","stylesheet"),e1.setAttribute("href","{}/editor.css"),this.shadowRoot.appendChild(e1),
                # const e2=document.createElement("link");e2.setAttribute("rel","stylesheet"),e2.setAttribute("href","{}/prism.css"),this.shadowRoot.appendChild(e2),
                # const e3=document.createElement("link");e3.setAttribute("src","{}/prism.js"),this.shadowRoot.appendChild(e3),

            # -----use if find way to edit js from python-----
                # template = 'const e{}=document.createElement("link");e{}.setAttribute("rel","stylesheet"),e{}.setAttribute("href","{}"),this.shadowRoot.appendChild(e{}),'
                # target_for_replace = 'this.shadowRoot.appendChild(e)'
                # add_1 = ['1','1','1',f'/_addons/{addon_package}/files/editor.css','1']
                # add_2 = ['2','2','2',f'/_addons/{addon_package}/files/prism.css','2']
                # add_3 = f'const eh=document.createElement("link");eh.setAttribute("src","/_addons/{addon_package}/files/prism.js"),this.shadowRoot.appendChild(eh),'
                # def combine_all():
                #     whole_string = target_for_replace
                #     whole_string += template.format(*add_1)
                #     whole_string += template.format(*add_2)
                #     whole_string += add_3

                #     return whole_string

            # -----explanation below-----

                # def stdHtml(
                #     self,
                #     body: str,
                #     css: Optional[List[str]] = None,
                #     js: Optional[List[str]] = None,
                #     head: str = "",
                #     context: Optional[Any] = None,
                #     default_css: bool = True,
                # ) -> None:

                # web_content = WebContent(
                #     body=body,
                #     head=head,
                #     js=["js/webview.js"] + (["js/vendor/jquery.min.js"] if js is None else js),
                #     css=(["css/webview.css"] if default_css else [])
                #     + ([] if css is None else css),
                # )

                # -----from editor class-----

                # self.web.stdHtml(
                #     _html % tr.editing_show_duplicates(),
                #     css=[
                #         "css/editor.css",
                #     ],
                #     js=[
                #         "js/vendor/jquery.min.js",
                #         "js/vendor/protobuf.min.js",
                #         "js/editor.js",
                #     ],
                #     context=self,
                #     default_css=False,
                # )

            # showText(web_content.js[3]) --> js/editor.js
            # this doesn't work because web_content.js[3] is just the string for the name of the file
            # -------
            # could fix by change the name/filepath here to one in addons file with the edits
            # web_content.js[3].replace(target_for_replace, combine_all())



            # del web_content.js[3]
            # web_content.js.append(f"/_addons/{addon_package}/files/editor.js")
aqt.gui_hooks.webview_will_set_content.append(on_webview_will_set_content)

# only works for external html like graph window

    # import os

    # def mytest(web: aqt.webview.AnkiWebView):
    #     page = os.path.basename(web.page().url().path())

    #     # if not graph.html, function ends
    #     if page != "graphs.html":
    #     	return
    #     web.eval(
    #         """
    #     div = document.createElement("div");
    #     div.innerHTML = 'hello';
    #     document.body.appendChild(div);
    # """
    #     )

    # aqt.gui_hooks.webview_did_inject_style_into_page.append(mytest)

# ------------------------------------------------------------------------------
#                                  EDITOR FIELD
# ------------------------------------------------------------------------------

# def add_editor_css(editor: aqt.editor.Editor):
#     aqt.editor._html += f"/_addons/{addon_package}/files/editor.css"
# aqt.gui_hooks.editor_did_init(add_editor_css)

# import anki

# def function(js: str, note: anki.notes.Note, editor: aqt.editor.Editor) -> str:
#     if aqt.editor.Editor.loadNote.js:
#         js = aqt.editor.Editor.loadNote.js
#     showText(js)
#     showText(note)
#     showText(editor)
#     return js
# aqt.gui_hooks.editor_will_load_note(function, anki.notes.Note, aqt.editor.Editor)

# could open the editor.js in python, then append the new javascript to the end of 
# the file so it runs every time the note changes
# with open() as file

#  def _evalWithCallback(self, js: str, cb: Callable[[Any], Any]) -> None:
#         if cb:
#             def handler(val: Any) -> None:
#                 if self._shouldIgnoreWebEvent():
#                     print("ignored late js callback", cb)
#                     return
#                 cb(val)
#             self.page().runJavaScript(js, handler)
#         else:
#             self.page().runJavaScript(js)