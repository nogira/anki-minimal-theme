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

import aqt
aqt.mw.addonManager.setWebExports(__name__, r"files/.*\.(css|svg|js)")
addon_package = aqt.mw.addonManager.addonFromModule(__name__)

# for debugging since cant use print
from aqt.utils import showText

# ----------------model----------------
# from aqt.utils import showInfo
# from anki.hooks import addHook

# # cross out the currently selected text
# def onStrike(editor):
#     editor.web.eval("wrap('<del>', '</del>');")

# def addMyButton(buttons, editor):
#     editor._links['strike'] = onStrike
#     return buttons + [editor._addButton(
#         "iconname", # "/full/path/to/icon.png",
#         "strike", # link name
#         "tooltip")]
# addHook("setupEditorButtons", addMyButton)

# from aqt.utils import showInfo
# from anki.hooks import addHook

# # cross out the currently selected text
# pre_pre = '<pre>'
# pre_code = '<code class="lang-py">'
# post_code = '</code>'
# post_pre = '</pre>'

# def onStrike(editor):
#     editor.web.eval("wrap('<pre>', '</pre>');")

# def addMyButton(buttons, editor):
#     editor._links['strike'] = onStrike
#     return buttons + [editor._addButton(
#         "iconname", # "/full/path/to/icon.png",
#         "strike", # link name
#         "tooltip")]
# addHook("setupEditorButtons", addMyButton)

# pre = '<pre><code class="lang-py">'
# post = '</code></pre>'