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

from os import path
addon_path = path.dirname(__file__)

from aqt.editor import Editor
from anki.hooks import wrap
from aqt.theme import theme_manager
# from aqt.utils import showText

def editTagStyle(self) -> None:
    self.tags.setStyleSheet("border: 1px solid #d4d4d4;"
                            "border-radius: 3px;"
                            "box-shadow: inset 0px 2px 4px -2px rgba(0, 0, 0, 0.2);")
        
    # goal to change self.outerLayout
    # -> self.outerLayout = QVBoxLayout()             (a VStack)
    #     │
    #     └─── .addWidget(QGroupBox())                g = QGroupBox()
    #           │   
    #           └─── .setLayout(QGridLayout())        tb = QGridLayout()
    #                 │
    #                 └─── .addWidget(QLabel())       l = QLabel()       this is the first of 2 widgets in tb

    # self.im = QPixmap("./image.jpg")
    # self.label = QLabel()
    # self.label.setPixmap(self.im)

    # deletes editor buttons + editor fields: self.outerLayout.itemAt(0).widget().deleteLater()
    # deletes tag field: self.outerLayout.itemAt(1).widget().deleteLater()
    # the QLabel !!!!!: self.outerLayout.itemAt(1).widget().layout().itemAt(0).widget()
    # showText(str(self.outerLayout.itemAt(1).widget().layout().itemAt(0).widget()))
    # showText(str(QIcon(f"/_addons/{addonfolder}/files/gear.svg").pixmap(QSize())))
    
    # showText(addon_path)
    # q = QPixmap(f"{addon_path}/files/tags.png")
    # self.outerLayout.itemAt(1).widget().layout().itemAt(0).widget().setPixmap(q)

    # q = QSvgWidget(f"{addon_path}/files/gear.svg") #.pixmap(QSize())
    # self.outerLayout.itemAt(1).widget().layout().itemAt(0).widget().deleteLater()
    # self.outerLayout.itemAt(1).widget().layout().addWidget(q)
    # self.outerLayout.itemAt(1).widget().layout().setSizeConstraint(QLayout.SetMaximumSize)
    # self.outerLayout.itemAt(1).widget().layout().maximumSize()

    self.outerLayout.itemAt(1).widget().layout().itemAt(0).widget().setText(f'<img src="{addon_path}/files/img/editor/tags.svg" width="15">')

    # self.outerLayout.itemAt(0).widget().deleteLater()

    if theme_manager.get_night_mode():
        self.tags.setStyleSheet("border: 1px solid #646464;"
                            "border-radius: 3px;"
                            "box-shadow: inset 0px 2px 4px -2px rgba(0, 0, 0, 0.2);")
        self.outerLayout.itemAt(1).widget().layout().itemAt(0).widget().setText(f'<img src="{addon_path}/files/img/editor/tags_white.svg" width="15">')
Editor.setupTags = wrap(Editor.setupTags, editTagStyle)