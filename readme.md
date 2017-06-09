# Short Repo

Written in Node.js, this is used to generate a HTML page (meant to be your browser's homepage) which lists your repositories on Github as shortcuts and includes a Google search textbox (autofocused).

# How to use

First of all, `npm install` to install the dependencies.

Then rename the file `config.sample.json` to `config.json` (or rename a copy of the file) inside the `config` directory.

Before changing the configurations, first [create a personal access token](https://github.com/settings/tokens) on Github.

The config object contains the following properties:

- `page.title`: The page title.
- `page.favicon`: URL to page favicon.
- `user.username`: Your Github username.
- `user.token`: Your personal access token (only repo rights are needed).
- `repos.newTab`: If `true`, repositories will be opened in a new tab.
- `repo.privateOnly`: Indicates if only the private repositories should be shown.
- `repo.ownerOnly`: Indicates if only repositories should be shown that you own (not collaborating).
- `repo.covers`: Add URLs to images as property name, with an array of repository names to associate with the cover as value. Example: `"http://website.com/image.jpg":["first-repo","second-repo"]`
- `repo.blacklist`: Add any repository names which should be ignored.
- `repo.whitelist`: Add the repository names which you want to keep (the rest will be ignored).

Finally, run `node generate.js` to generate the `index.html` file. If you like what you see, set it as your browser's homepage for quick access to your repositories on Github.
