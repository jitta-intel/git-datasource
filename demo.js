
const GithubDataSource = require('./index')



const main = async () => {
  await GithubDataSource.connect({
    accessToken: process.env.GITHUB_ACCESS_TOKEN,
    org: process.env.GITHUB_ORG,
    repo: process.env.GITHUB_REPO,
    filenames: ['market', 'test']
  })

  // console.log(GithubDataSource.get('test'))
  // console.log(GithubDataSource.get('market'))
}


main()