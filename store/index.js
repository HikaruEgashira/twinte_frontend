import axios from 'axios'
// 初期状態
export const state = () => ({
  season: { name: 'akiC', realName: '秋C', array: 5 },
  isLogin: false,
  isLoading: false,
  theme: {
    table: [
      { key: 'number', size: 2, show: false, name: '授業番号' },
      { key: 'name', size: 2, show: true, name: '科目名' },
      { key: 'classroom', size: 2, show: true, name: '教室' },
      { key: 'teacher', size: 2, show: false, name: '担当教師' }
    ]
  },
  items: [[], [], [], [], [], []]
})

// vueが参照できるデータ
export const getters = {
  items: state => state.items
}

// stateを変更する動作(ここ以外で変更しないようにする)
export const mutations = {
  updated (state, { items, season, change }) {
    items.forEach(elements => {
      elements.forEach(element => {
        if (element.number === 'undefined') {
          element.classroom = ''
          element.name = ''
          element.number = ''
          element.season = ''
          element.teacher = ''
          element.time = ''
        }
      })
    })
    switch (season) {
      case 'haruA':
        state.items.splice(0, 1, items)
        if (change) state.season = { name: season, realName: '春A', array: 0 }
        break
      case 'haruB':
        state.items.splice(1, 1, items)
        if (change) state.season = { name: season, realName: '春B', array: 1 }
        break
      case 'haruC':
        state.items.splice(2, 1, items)
        if (change) state.season = { name: season, realName: '春C', array: 2 }
        break
      case 'akiA':
        state.items.splice(3, 1, items)
        if (change) state.season = { name: season, realName: '秋A', array: 3 }
        break
      case 'akiB':
        state.items.splice(4, 1, items)
        if (change) state.season = { name: season, realName: '秋B', array: 4 }
        break
      case 'akiC':
        state.items.splice(5, 1, items)
        if (change) state.season = { name: season, realName: '秋C', array: 5 }
        break
      default:
        state.items.splice(0, 1, items)
        if (change) state.season = { name: season, realName: '春A', array: 0 }
        break
    }
  },
  updateThemeShow (state, items) {
    items.forEach((v, index) => {
      state.theme.table[index].show = v
    })
  },
  // localStorageからの復元
  restore (state, { items, theme, isLogin }) {
    state.items = items
    state.theme = theme
    state.isLogin = isLogin
  },
  update (state, dialog) {
    state.items[state.season.array][dialog.col][dialog.row].name =
      dialog.className
  },
  login (state) {
    state.isLogin = true
  },
  loading (state, bool) {
    state.isLoading = bool
  }
}

// 非同期処理やローカルストレージとの通信
export const actions = {
  async login (context, { id, pass }) {
    context.commit('loading', true)
    try {
      await axios
        .post('https://twinte.net/api/login.php', { id, pass })
        .then(res => {
          console.log(res.data)
          if (res.data === 'logged_in') {
            context.commit('login')
            context.commit('loading', false)
            // TODO
          } else {
            alert('not logged_in')
            context.commit('loading', false)
          }
        })
    } catch (e) {
      console.error(e)
      context.commit('loading', false)
    }
  },
  async getItemsData (context, season) {
    context.commit('loading', true)
    try {
      await axios
        .post('https://twinte.net/api/main.php', { view_season: season })
        .then(items => {
          context.commit('updated', { items: items.data, season, change: true })
          context.dispatch('save', { state })
          context.commit('loading', false)
        })
    } catch (error) {
      console.error(error)
      context.commit('loading', false)
    }
  },
  async bachgroundFetch (context, season) {
    try {
      await axios
        .post('https://twinte.net/api/main.php', { view_season: season })
        .then(items => {
          context.commit('updated', { items: items.data, season, change: false })
          context.dispatch('save', { state })
        })
    } catch (error) {
      console.error(error)
    }
  },
  async csvFunction (context, { formData, config }) {
    context.commit('loading', true)
    await axios
      .post('https://twinte.net/api/main.php', formData, config)
      .then(function (items) {
        context.commit('login')
        context.commit('updated', { items: items.data, season: context.state.season.name, change: true })
        context.dispatch('save', { state: context.state })
        context.commit('loading', false)
      })
      .catch(function (error) {
        console.error(error)
        context.commit('loading', false)
      })
  },
  // 見た目の更新
  updateThemeShow (context, items) {
    context.commit('updateThemeShow', items)
  },
  // ローカルストレージへの保存
  save ({ state }) {
    const data = {
      items: state.items,
      theme: state.theme,
      isLogin: state.isLogin
    }
    localStorage.setItem('twinte-data', JSON.stringify(data))
  },
  // ローカルストレージからのデータの復元
  restore ({ commit }) {
    const data = localStorage.getItem('twinte-data')
    if (data) commit('restore', JSON.parse(data))
  }
}
