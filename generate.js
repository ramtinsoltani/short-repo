const DEFAULT_COVER = 'https://assets-cdn.github.com/images/modules/open_graph/github-mark.png';
const fs = require('fs');
const request = require('request');

let config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
let template = {

  page: fs.readFileSync('./config/templates/page.template.html', 'utf8'),
  repo: fs.readFileSync('./config/templates/repo.template.html', 'utf8'),
  user: fs.readFileSync('./config/templates/user.template.html', 'utf8')

};

let rendered = '';
let options = {

  url: 'https://api.github.com/user',
  headers: {
    'Authorization': 'Basic ' + new Buffer(`${config.user.username}:${config.user.token}`).toString('base64'),
    'User-Agent': 'Short-Repo-App'
  }

};

request(options, function(error, response, body) {

  if ( error || response.statusCode !== 200 ) {

    if ( response.statusCode === 403 ) console.log('Authentication failed!');

    console.log(':(');

    return;

  }

  let user = JSON.parse(body);
  let renderedUser = '';

  renderedUser = template.user.replace('{{profile}}', user.html_url)
                              .replace('{{avatar}}', user.avatar_url)
                              .replace('{{username}}', user.name);

  options.url = 'https://api.github.com/user/repos?sort=updated';

  request(options, function(error, response, body) {

    if ( error || response.statusCode !== 200 ) {

      if ( response.statusCode === 403 ) console.log('Authentication failed!');

      console.log(':(');

      return;

    }

    let repos = JSON.parse(body);
    let ownerCount = 0, renderedRepos = '';

    for ( let index in repos ) {

      let repo = repos[index];

      if ( repo.owner.id === user.id ) ownerCount++;

      if ( ( ! config.repos.privateOnly || repo.private ) &&
         ( ! config.repos.ownerOnly || repo.owner.id === user.id ) &&
         ( config.repos.blacklist.indexOf(repo.name) === -1 ) ) {

        let renderedRepo = template.repo;

        renderedRepo = renderedRepo.replace('{{link}}', repo.html_url)
                                   .replace('{{window}}', config.repos.newTab ? '_blank' : '_self')
                                   .replace('{{name}}', repo.name);

        for ( let cover in config.repos.covers ) {

          if ( config.repos.covers[cover].indexOf(repo.name) !== -1 ) {

            renderedRepo = renderedRepo.replace('{{cover}}', cover);

          }

        }

        renderedRepos += renderedRepo;

      }

    }

    renderedUser = renderedUser.replace('{{repocount}}', ownerCount);

    rendered = template.page.replace('{{title}}', config.page.title)
                            .replace('{{favicon}}', config.page.favicon)
                            .replace('{{user}}', renderedUser)
                            .replace('{{repos}}', renderedRepos);

    fs.writeFileSync('./index.html', rendered);

    console.log(':)');

  });

});
