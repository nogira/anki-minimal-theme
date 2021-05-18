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


from aqt.toolbar import Toolbar
from aqt import gui_hooks

import os
addon_path = os.path.dirname(__file__)
addonfoldername = os.path.basename(addon_path)


def _centerLinks(self) -> str:
        """Generates HTML link element and registers link handler
        Arguments:
            cmd {str} -- Command name used for the JS → Python bridge
            label {str} -- Display label of the link
            func {Callable} -- Callable to be called on clicking the link
        Keyword Arguments:
            tip {Optional[str]} -- Optional tooltip text to show on hovering
                                over the link (default: {None})
            id: {Optional[str]} -- Optional id attribute to supply the link with
                                (default: {None})
        Returns:
            str -- HTML link element
        """
        links = [
                self.create_link(
                "decks",
                "Decks",
                self._deckLinkHandler,
                tip="Decks\nShortcut: D",
                id="decks",
                ),
                self.create_link(
                "add",
                "Add",
                self._addLinkHandler,
                tip="Add\nShortcut: A",
                id="add",
                ),
                self.create_link(
                "browse",
                "Browse",
                self._browseLinkHandler,
                tip="Browse\nShortcut: B",
                id="browse",
                ),
                self.create_link(
                "Stats",
                "Stats",
                self._statsLinkHandler,
                tip="Stats\nShortcut: T",
                id="stats",
            ),
        ]

        links.append(self._create_sync_link())

        gui_hooks.top_toolbar_did_init_links(links, self)

        return "\n".join(links)

Toolbar._centerLinks = _centerLinks