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
        web_content.css.append(f"/_addons/{addon_package}/files/editor.css")
        web_content.js.append(f"/_addons/{addon_package}/files/prism.js")
        web_content.body = web_content.body.replace("Fields...", "Fields")
        web_content.body = web_content.body.replace("Cards...", "Cards")
        # web_content.body = web_content.body.replace('<link rel="stylesheet" href="./_anki/css/editable.css">', '<link rel="stylesheet" href="./_anki/css/editable.css"><link rel="stylesheet" href="http://127.0.0.1:56940/_addons/FormatPackStylingRefresh/files/prism.css"><script src="http://127.0.0.1:56940/_addons/FormatPackStylingRefresh/files/prism.js"></script>')
        
        template = 'const e{}=document.createElement("link");e{}.setAttribute("rel","stylesheet"),e{}.setAttribute("href","{}"),this.shadowRoot.appendChild(e{}),'
        target_for_replace = 'this.shadowRoot.appendChild(e)'
        add_1 = ['1','1','1',f'/_addons/{addon_package}/files/editor.css','1']
        add_2 = ['2','2','2',f'/_addons/{addon_package}/files/prism.css','2']
        add_3 = f'const eh=document.createElement("link");eh.setAttribute("src","/_addons/{addon_package}/files/prism.js"),this.shadowRoot.appendChild(eh),'
        def combine_all():
            whole_string = target_for_replace
            whole_string += template.format(*add_1)
            whole_string += template.format(*add_2)
            whole_string += add_3

            return whole_string

        # web_content.js[3] is the 'js/editor.js' file

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
        showText
        web_content.js[3].replace(target_for_replace, combine_all())


        



aqt.gui_hooks.webview_will_set_content.append(on_webview_will_set_content)



# def mytest(web: AnkiWebView):
#     page = os.path.basename(web.page().url().path())
#     if page != "graphs.html":
#     	return
#     web.eval(
#         """
#     div = document.createElement("div");
#     div.innerHTML = 'hello';
#     document.body.appendChild(div);
# """
#     )

# gui_hooks.webview_did_inject_style_into_page.append(mytest)