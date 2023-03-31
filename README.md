# Acronymify

Acronymify is a web extension that enables you to define acronyms, recognize them on web pages, and display their definition. 

The extension is available for Firefox, Chrome, Edge, and Opera.

![Logo](images/abc_long.png "Acronymify Logo")


## Installation

You can download Acronymify from the following stores:

- Firefox: [AMO](https://addons.mozilla.org/addon/acronymify/).
- Chrome, Brave, Kiwi, Vivaldi, and other Chromium-based browsers: [CWS](https://chrome.google.com/webstore/detail/acronymify/lajlhjpjcbgfnopdcegllgdnjpfifnca).
- Edge: [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/iafhomljhcdjpeiihmgmpkccllpjoalh).
- Opera: [Opera addons](https://addons.opera.com/en-gb/extensions/details/acronymify/).


Acronymify is also properly working with Firefox for Android. You can find a tutorial for advanced users on how to install it [here](https://support.mozilla.org/en-US/kb/extended-add-support).

Safari is ~~too expensive~~ not supported, but you may create your own version by downloading a [release](https://github.com/l-dav/Acronymify/releases/) and following [this tutorial](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari).


## Usage

![Main page](images/popup_home_long.PNG "Main page")

Acronymify allows you to manage acronyms by defining and storing your own acronyms, or fetching them from an online database. When you load Acronymify for the first time, you will be guided to build your local database.

### Defining custom entries

To define your own acronyms, click on the "Custom" tab and add your entries to the text area in the following JSON format:

```json
[
    {
        "Acronym": "your acronym",
        "Meaning": "meanings here",
        "Hint": "an explanation",
        "Alternatives": "alternative words",
        "url": "a URL"
    }, 
    {
        "Acronym": "your second acronym",
        "Meaning": "meanings here",
        "Hint": "an explanation",
        "Alternatives": "alternative words",
        "url": "a URL"
    }
]
```

### Fetching from an online source

You can also fetch acronyms from an online database by specifying the URL to the raw JSON data in the input field. The online database must follow the following JSON format:

```json
{
    "entries": [
        {
            "Acronym": "acronym",
            "Meaning": "meaning",
            "Hint": "hint",
            "Alternatives": "alternatives",
            "url": "a URL"
        }, 
        {
            "Acronym": "acronym",
            "Meaning": "meaning",
            "Hint": "hint",
            "Alternatives": "alternatives",
            "url": "a URL"
        }
    ],
    "url_add": "URL to your online source",
    "mail_add": "an email to contact to add new acronyms"
}
```

Since Acronymify version 2.0.0, multiple sources are supported. You can create a file that links to other sources using the following template:

```json
{
    "sources": [
        {"name": "name of a source", "source": "URL"},
        {"name": "name of a source", "source": "URL"},
        {"name": "name of a source", "source": "URL"}
    ],
    "url_add": "URL to your online source",
    "mail_add": "an email to contact to add new acronyms"
}
```

By using Acronymify and online sources, you can easily manage your acronyms and ensure that everyone on your team has access to the same set of acronyms.


### Options

In the "Options" tab, you can currently configure two options:
- "Case sensitive": check this option if you want your searches to be case sensitive.
- "Auto complete": check this option if you want to see all acronyms that start with your search term.


## Documentation

Acronymify is a web extension that allows you to manage acronyms in your browser. The source code is available in the folder `./src/`. It contains a file named manifest.json that contains metadata about the extension, as specified in the [Mozilla Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json).


## Build, Sign, Publish

The Makefile allows you to build, sign, publish the extension (Firefox only for now).

To build the extension (generate an unsigned local .xpi archive ; for testing purposes):
> make build

To sign the extension and generate the .xpi archive (no public listing ; for testing purposes):
> make sign

To sign the extension, generate the .xpi archive and list the new version on AMO:
> make sign CHANNEL=listed

## License

Acronymify is licensed under the GPLv3. You can find the full text of the license in the [LICENSE](LICENSE) file.

## Authors

- [@l-dav](https://github.com/l-dav)