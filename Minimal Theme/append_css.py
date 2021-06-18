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

from aqt import mw
addonfolder = mw.addonManager.addonFromModule(__name__)

# for debugging since cant use print
from aqt.utils import showText

config = mw.addonManager.getConfig(__name__)
# example: config["night mode"]

from aqt.webview import WebContent
from aqt.toolbar import TopToolbar, BottomToolbar
from aqt.deckbrowser import DeckBrowser
from aqt.reviewer import ReviewerBottomBar
from aqt.editor import Editor
from aqt.gui_hooks import webview_will_set_content
from typing import Any, Optional
def on_webview_will_set_content(
    web_content: WebContent,
    context: Optional[Any]) -> None:
    # for all
    web_content.css.append(f"/_addons/{addonfolder}/files/css/all.css")
    if isinstance(context, TopToolbar):
        web_content.css.append(
            f"/_addons/{addonfolder}/files/css/top_toolbar.css")
        web_content.body = web_content.body.replace("Shortcut key: ⁨D",
                                                    "Decks\nShortcut: D")\
            .replace("Shortcut key: ⁨A", "Add Card\nShortcut: A")\
            .replace("Shortcut key: ⁨B", "Browse\nShortcut: B")\
            .replace("Shortcut key: ⁨T", "Stats\nShortcut: T")\
            .replace("Shortcut key: ⁨Y", "Sync\nShortcut: Y")
    elif isinstance(context, DeckBrowser):
        web_content.css.append(
            f"/_addons/{addonfolder}/files/css/home.css")
        if not(config["show 'studied cards today' in homescreen"]):
            web_content.css.append(
                f"/_addons/{addonfolder}/files/css/home_studiedToday.css")
    elif isinstance(context, BottomToolbar):
        # this one doesnt work for some reason
        web_content.css.append(
            f"/_addons/{addonfolder}/files/css/bottom_toolbar.css")
    elif isinstance(context, ReviewerBottomBar):
        web_content.css.append(
            f"/_addons/{addonfolder}/files/css/reviewer_bottom.css")
    elif isinstance(context, Editor):
        web_content.css.append(
            f"/_addons/{addonfolder}/files/css/editor-window.css")
        web_content.css.append(
            f"/_addons/{addonfolder}/files/prism/prism.css")
        web_content.js.append(
            f"/_addons/{addonfolder}/files/prism/prism.js")
        web_content.body = web_content.body.replace("Fields...", "Fields")\
            .replace("Cards...", "Cards")
        

        # add script after html has loaded to make sure shadowroot is present
        web_content.head += f'<script async src="/_addons/{addonfolder}/files\
/js/tweak.js"></script>'

        # ---------------------------------------------------------------------------------------------------------------------------------------------------------
        
        # to make sure this javascript gets reloaded every time a new note is loaded, perhaps append the command to the end of the function that loads the note
        
        # assuming i modify editor.py -> def loadNote
        # potentially able to modify anki's own javascript??? !!

        # ---------------------------------------------------------------------------------------------------------------------------------------------------------

webview_will_set_content.append(on_webview_will_set_content)
