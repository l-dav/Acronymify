# Acronymify

This is a Firefox extension that recognize all your acronyms on the web and show their definition.


## Documentation

Acronymify is a Firefox Extension.


### Overview

The source code is in the folder "./src/". It contains a file "manifest.json" containing metadata about the extension, as specified in [Mozilla Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json). The extension popup is coded in the "/popup/" folder, and contains HTML/CSS/JS code.

To share your extension, you need it to be "signed": your extension need to pass a serie of test, then a .xpi file will be created.
The Makefile allows you to sign your extension.


### Installation

If you have a signed .xpi file:
- open it with Firefox (e.g. drag-and-drop) and accept the installation

If you have the source code:
- go to "about:debugging#/runtime/this-firefox" in Firefox
- "Load Temporary Add-on..." and select any file inside the source code root folder (e.g. "manifest.json").

You can know use the extension. Select a word on any website, open the extension (by shortcut or by clicking the extension icon in the top-right), and you will get your definition if the word is known, or a "Unknwown word" warning if the word is not recognized.


### Code algorithm

The popup is design in plain HTML/CSS, and all interactions are written in plain JavaScript.

Each time the extension popup is open, it is reload.
It starts by checking the storage, and load a database or a configuration if exist.

You can pass a URL to an online JSON database in the input field, and click "Load".

The database must follow the following JSON format:
```json
{
    "entries": [
        {
            "Acronym": "acronym",
            "Meaning": "meaning",
            "Hint": "hint",
            "Alternatives": "alternatives",
            "url": "url"
        }, {
            "Acronym": "acronym",
            "Meaning": "meaning",
            "Hint": "hint",
            "Alternatives": "alternatives",
            "url": "url"
        }
    ]
}
```

The configuration must follow the following JSON format:
```json
{
    "acronyms_source": "https://url_to_online_db.com",
    "url_add": "https://url_to_db_repository.com",
    "mail_add": "your@mail.com",
    "custom_entries": [
        {
            "Acronym": "your_acronym",
            "Meaning": "your_full_meaning",
            "Hint": "your_definition",
            "Alternatives": "your_alternatives",
            "url": "your_url"
        }
    ]
}
```