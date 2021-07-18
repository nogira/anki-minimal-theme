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

from os import path
addon_path = path.dirname(__file__)

from aqt.qt import QMainWindow, QVBoxLayout, QCheckBox, QLabel, QPushButton, QWidget
import json

# check if config file exists, of not, create it
try:
    with open(f'{addon_path}/../user_files/config.json', 'r') as file:
        pass
except:
    with open(f'{addon_path}/../user_files/config.json', 'w') as file:
        dict1 = {
            "show 'studied cards today' in homescreen": False
        }
        json.dump(dict1, file)

class ConfigWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.dict_file = json.load(open(f'{addon_path}/../user_files/config.json', 'r'))
        self.setWindowTitle("Minimal Theme Settings")
        layout = QVBoxLayout()

        # ----------------------------------------------------------------------

        self.opt1 = QCheckBox("Show 'studied cards today' in homescreen.")
        try:
            self.opt1.setChecked(self.dict_file["show 'studied cards today' in homescreen"])
        except: 
            self.opt1.setChecked(True)
        layout.addWidget(self.opt1)

        space1 = QLabel(" ")
        layout.addWidget(space1)

        msg = QLabel("Restart anki for all changes to take effect")
        layout.addWidget(msg)

        space2 = QLabel(" ")
        layout.addWidget(space2)

        btn1 = QPushButton("Save")
        btn1.clicked.connect(self.save_to_file)
        layout.addWidget(btn1)

        # ----------------------------------------------------------------------

        widget = QWidget()
        widget.setLayout(layout)
        self.setCentralWidget(widget)

    def save_to_file(self):
        self.dict_file["show 'studied cards today' in homescreen"] = self.opt1.isChecked()

        with open(f'{addon_path}/../user_files/config.json', 'w') as file:
            json.dump(self.dict_file, file)
        
        self.close()


# get the addon window instance
from aqt import dialogs, mw

# open new window (ConfigWindow) linked to anki main window (mw) so it doesn't auto-close
def show_new_window():
    dialogs._dialogs["AddonsDialog"][1].close()
    mw.myW = w = ConfigWindow()
    w.show()

mw.addonManager.setConfigAction(__name__, show_new_window)