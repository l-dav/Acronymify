# Acronymify

Acronymify is a browser extension that enables you to define acronyms, recognize them on web pages, and display their definition.

![Logo](images/abc_long.png "Acronymify Logo")


## Installation

- Firefox: download it from [AMO](https://addons.mozilla.org/addon/acronymify/).
- Chrome: download it from [CWS](https://chrome.google.com/webstore/detail/acronymify/lajlhjpjcbgfnopdcegllgdnjpfifnca).
- Edge: download it from [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/iafhomljhcdjpeiihmgmpkccllpjoalh).
- Opera: download it from [Opera addons](https://addons.opera.com/en-gb/extensions/details/acronymify/).
- Brave: download it from [Brave Web Store](https://chrome.google.com/webstore/detail/acronymify/lajlhjpjcbgfnopdcegllgdnjpfifnca) (same as [CWS](https://chrome.google.com/webstore/detail/acronymify/lajlhjpjcbgfnopdcegllgdnjpfifnca)).

- Firefox Mobile: Acronymify is properly working with Firefox for Android. Follow this [tutorial](https://support.mozilla.org/en-US/kb/extended-add-support) (advanced users).

- Safari: ~~too expensive~~ not available. But you may create it yourself: download a [release](https://github.com/l-dav/Acronymify/releases/) and follow [this tutorial](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari).


## Usage

![Main page](images/popup_home_long.PNG "Main page")  

When you load Acronymify for the first time, you will be guide to build your local database.

Then, click on a word on any web page, and activate the extension by using the shortcut or clicking the extension logo. If the word's definition is known, it will be displayed.


### Config tab

Configure your local database from the config tab.
Several fields are provided:
- `acronyms_source`: URL to an online source dataset. See "Use an online source".
- `url_add`: URL to your source repository, if needed.
- `mail_add`: a contact URL to propose new words, if needed.

- `custom_entries`: define custom local entries. See "Add custom entries".

#### Use an online source

The online database must follow the following JSON format:
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

Specify the URL to the raw JSON data in the field `acronyms_source`.

#### Add custom entries

You can specified your own custom entries.

Your entries must follow the following JSON format:

```json
[
    {
        "Acronym": "your acronym",
        "Meaning": "meanings here",
        "Hint": "an explanation",
        "Alternatives": "alternative words",
        "url": "an URL"
    }, 
    {
        "Acronym": "your second acronym",
        "Meaning": "meanings here",
        "Hint": "an explanation",
        "Alternatives": "alternative words",
        "url": "an URL"
    }
]
```

Add them to the field `custom_entries`.

## Documentation

Acronymify is a web extension.

### Overview

The source code is in the folder `./src/`. It contains a file "manifest.json" containing metadata about the extension, as specified in the [Mozilla Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json).


### Build, Sign, Publish

The Makefile allows you to build, sign, publish the extension (Firefox only for now).

To build the extension (generate an unsigned local .xpi archive ; for testing purposes):
> make build

To sign the extension and generate the .xpi archive (no public listing ; for testing purposes):
> make sign

To sign the extension, generate the .xpi archive and list the new version on AMO:
> make sign CHANNEL=listed

## License

[GPLv3](LICENSE)

## Authors

- [@l-dav](https://github.com/l-dav)