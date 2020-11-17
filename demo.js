
const gds = require('./index')



const main = async () => {
  // console.log(gds.get('avaialable_market'))
  await gds.connect({
    accessToken: process.env.GITHUB_ACCESS_TOKEN,
    org: process.env.GITHUB_ORG,
    repo: process.env.GITHUB_REPO,
    filenames: ['market', 'test'],
  }).then(() => {
    gds.set('avaialable_market', Object.keys(gds.get('market')))
  })

  console.log(gds.get('avaialable_market'))
  console.log(gds.get('market'))
}


main()