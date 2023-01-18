# Acronymify

This is a Firefox extension that recognize all your acronyms on the web and show their definition.


## Documentation

Acronymify is a Firefox Extension.


### Overview

The source code is in the folder `./src/`. It contains a file "manifest.json" containing metadata about the extension, as specified in [Mozilla Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json). The extension popup is coded in the `./src/popup/` folder, and contains HTML/CSS/JS code.

To share your extension, it needs to be "signed": your extension needs to pass a serie of test, then a .xpi file will be created.
The Makefile allows you to sign your extension.

### Build, Sign, Publish

To build the extension (generate an unsigned local .xpi archive ; for testing purposes):
> make build

To sign the extension and generate the .xpi archive (no public listing ; for testing purposes):
> make sign

To sign the extension, generate the .xpi archive and list the new version on AMO:
> make sign CHANNEL=listed

### Functionnalities

You can pass a URL to an online JSON database in the config field, and click "Load".


### Installation
If you have a signed .xpi file:
- open it with Firefox (e.g. drag-and-drop) and accept the installation.

If you have the source code:
- go to "about:debugging#/runtime/this-firefox" in Firefox
- "Load Temporary Add-on..." and select any file inside the source code root folder (e.g. "manifest.json").

You can now use the extension. Select a word on any website, open the extension (by shortcut as defined in the extension popup or by clicking the extension icon in the top-right), and you will get your definition if the word is known, or a "Unknwown word" warning if the word is not recognized.


### Code algorithm

The popup is design in plain HTML/CSS, and all interactions are written in plain JavaScript.

Each time the extension popup is open, it is reload.

We start by displaying dynamic informations from the file "manifest.json": version, author, keyboard shortcut.

Then we check the local storage:
- if a local configuration is stored, it is loaded
- if not, then we load a default configuration

Then, we update the page with this informations: url_add, mailto, case sensitive option, ...

We add click listener to several events:
- Reset button: on click on it, we clear the local storage and reload the extension. It will be clean as a new installation.
- Case sensitive checkbox
- Fetching button: to download an online database.
- Refresh button: reload the extension

### Formats

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
    "mail_add": "source@mail.com",
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