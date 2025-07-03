export default class BaseRepository {
  constructor(axios, path) {
    this.axios = axios
    this.path = path
  }

  async findById(id) {
    try {
      let result = await this.axios.get(this.fixUrl(`/${this.path}/${id}`))
      result.data.id = id
      return result.data
    } catch (e) {
      return null
    }
  }

  async afterProcess(data) {
    //TODO

    let Promises = data.map(async value => {
      if (value == null) return
    })
    await Promise.all(Promises)
    for (var i = 0; i < data.length; i++) {
      data[i].index = i
    }
    return data
  }

  async find(query) {
    var temp = null
    if (query != null) {
      let parameter = {
        params: query.parameters,
      }

      temp = await this.axios.get(this.fixUrl(`/${query.apiPath}`), parameter)
    } else {
      temp = await this.axios.get(this.fixUrl(`/${this.path}`))
    }

    if (temp && temp.data) {
      // _embedded 속성이 있고, 그 안에 this.path (예: 'users' 또는 'authors')가 있다면
      if (temp.data._embedded && temp.data._embedded[this.path]) {
        return await this.afterProcess(temp.data._embedded[this.path])
      }
      // _embedded가 없지만 temp.data 자체에 단일 객체가 있을 경우
      // (findByEmail처럼 특정 항목을 조회했을 때 흔히 발생)
      else if (Object.keys(temp.data).length > 0) {
        // 데이터가 비어있지 않은 객체인 경우
        // 단일 객체를 배열로 래핑하여 afterProcess에 전달
        return await this.afterProcess([temp.data])
      }
      // 그 외의 경우 (예: _embedded도 없고 단일 객체도 비어있는 경우)
      else {
        return await this.afterProcess([]) // 빈 배열 반환
      }
    }
    // temp 또는 temp.data 자체가 없는 경우
    return await this.afterProcess([]) // 빈 배열 반환
    // --- 수정 끝 ---
  }
  catch(e) {
    console.error('BaseRepository find error:', e.response ? e.response.data : e.message) // 상세 에러 로깅
    return null // Login.vue에서 null을 예상하므로 그대로 유지
  }

  async save(entity, isNew) {
    if (isNew) {
      return await this.axios.post(this.fixUrl(`/${this.path}`), entity)
    } else {
      return await this.axios.put(this.fixUrl(entity._links.self.href), entity)
    }
  }

  async delete(entity) {
    await this.axios.delete(this.fixUrl(entity._links.self.href))

    return await this.find(null)
  }

  async invoke(entity, link, params) {
    return await this.axios.put(this.fixUrl(entity._links[link].href), params)
  }

  async generate(pathVal) {
    var temp = null

    temp = await this.axios.get(this.fixUrl(`/${pathVal}`))

    return await this.afterProcess(temp.data._embedded[pathVal])
  }

  fixUrl(path) {
    if (!this.axios.defaults.baseURL && path.startsWith('/')) {
      return path
    }

    let url

    try {
      url = new URL(path)
    } catch (e) {
      url = new URL(this.axios.defaults.baseURL + path)
    }

    if (!this.axios.defaults.baseURL) {
      return url.pathname
    }

    url.hostname = new URL(this.axios.defaults.baseURL).hostname
    url.port = new URL(this.axios.defaults.baseURL).port

    return url.href
  }
}
