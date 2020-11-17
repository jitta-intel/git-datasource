const GitHub = require('github-api')
const Promise = require('bluebird')


class GithubDatasource {
  static async connect({
    accessToken,
    org,
    repo,
    branch = 'main',
    filenames = [],
    format = 'json'
  } = {}) {
    this.accessToken = accessToken
    this.org = org
    this.repo = repo
    this.branch = branch
    this.format = format
    this.gh = new GitHub({
      token: this.accessToken
    })
    this.repository = this.gh.getRepo(this.org, this.repo)
    await this.fetchDataSources(filenames)
    this.isConnected = true
    return this
  }


  static async getConfig(configName) {
    const ref = `heads/${this.branch}`
    const path = `${configName}.${this.format}`
    const result = await this.repository.getContents(ref, path)
    const base64 = result.data.content
    const buffer = Buffer.from(base64, 'base64')
    const text = buffer.toString('ascii')
    return text
  }

  static async fetchDataSources(filenames = []) {
    return Promise.map(filenames, async (filename) => {
      const content = await this.getConfig(filename)
      try {
        this.dataSource[filename] = JSON.parse(content)
      } catch (eror) {
        this.dataSource[filename] = new Error('parse error')
      }
    })
  }

  static get(filename) {
    if (this.isConnected) {
      return this.dataSource[filename]
    }
    throw new Error('Git-datasource is not connected.')
  }

  static set(field, data) {
    return this.dataSource[field] = data
  }
}

GithubDatasource.isConnected = false
GithubDatasource.accessToken = ''
GithubDatasource.org = null
GithubDatasource.repo = null
GithubDatasource.branch = 'main'
GithubDatasource.format = 'json'
GithubDatasource.dataSource = {}

module.exports = GithubDatasource
