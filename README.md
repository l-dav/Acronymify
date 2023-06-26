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

## Known sources

This section provides a list of online datasets that are compatible with Acronymify. To import the acronyms from these sources, simply copy and paste the provided direct link into the online tab of Acronymify.

| Source | Description    | Language    | Repo | Direct link |
| :---:   | :---: | :---: | :---: | :---: |
| Voices of Nuclear | Acronyms related to the nuclear domain  | English / French   | [Framagit](https://framagit.org/tykayn/acronymify-voices-of-nuclear/-/tree/main) | [Raw](https://framagit.org/tykayn/acronymify-voices-of-nuclear/-/raw/main/acronymify-VoN.json) |
| Professional | Professional acronyms   | English   | [GitHub](https://github.com/l-dav/Acronymify/blob/master/acronyms/professional.json) | [Raw](https://raw.githubusercontent.com/l-dav/Acronymify/master/acronyms/professional.json) |
| Computer | Acronyms related to computer science   | English   | [GitHub](https://github.com/l-dav/Acronymify/blob/master/acronyms/computer.json) | [Raw](https://raw.githubusercontent.com/l-dav/Acronymify/master/acronyms/computer.json) |



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


### Run locally

To work with Acronymify locally, follow these steps:

1. Clone or download the Acronymify repository to your machine.
2. To run the Acronymify extension in your browser, you need to import it using the respective method for your browser:
    - For Firefox:
        - Enter "about:debugging#/runtime/this-firefox" in the address bar.
        - Click on "Load Temporary Add-on" and navigate to the location where you downloaded the Acronymify repository.
        - Select the "manifest.json" file and click "Open" to import it.
    - For Chrome:
        - Enter "chrome://extensions/" in the address bar.
        - Toggle on the "Developer mode" switch located in the top-right corner.
        - Click on "Load unpacked" and navigate to the folder where you downloaded the Acronymify repository.
        - Open the folder containing the "manifest.json" file and click "Open" to import it.
    - For other browsers, the process is similar. Refer to the respective browser's documentation for instructions on how to load a local extension.
3. After successfully importing the extension, it should be available for use in your browser.

By following these instructions, you will be able to run Acronymify locally.

## Contributing

Contributions are always welcome!

Check out the list of open issues in the repository. These are tasks and features that we have identified and would appreciate help with. You can find them [here](https://github.com/l-dav/Acronymify/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement).

If you have a new idea or feature in mind that is not listed in the issues, feel free to propose it. Create a new issue and describe your idea in detail.

Our team will review your contribution and collaborate with you to refine and merge it into the project.

## License

Acronymify is licensed under the GPLv3. You can find the full text of the license in the [LICENSE](LICENSE) file.

## Authors

- [@l-dav](https://github.com/l-dav)