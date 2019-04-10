import axios from 'axios'
// 初期状態
export const state = () => ({
  nowSeason: 0,
  season: [
    { name: 'haruA', realName: '春A' },
    { name: 'haruB', realName: '春B' },
    { name: 'haruC', realName: '春C' },
    { name: 'akiA', realName: '秋A' },
    { name: 'akiB', realName: '秋B' },
    { name: 'akiC', realName: '秋C' }
  ],
  isLogin: false,
  isLoading: false,
  reLogin: false,
  alert: { message: '', log: false },
  theme: {
    table: [
      { key: 'number', size: 2, show: false, name: '授業番号' },
      { key: 'name', size: 2, show: true, name: '科目名' },
      { key: 'classroom', size: 2, show: true, name: '教室' },
      { key: 'teacher', size: 2, show: false, name: '担当教師' }
    ]
  },
  items: new Array(6).fill([]),
  number: [[], [], [], [], [], []]
})

// vueが参照できるデータ
export const getters = {
  items: state => state.items
}

// stateを変更する動作(ここ以外で変更しないようにする)
export const mutations = {
  splice (state, { item, number, c, r, n }) {
    if (item.number === 'undefined') {
      item.classroom = ''
      item.name = ''
      item.number = ''
      item.season = ''
      item.teacher = ''
      item.time = ''
    }
    const source = { attend: 0, absent: 0, memo: '' }
    Object.assign(item, source)
    state.items[n][c].splice(r, 1, item)
    number.forEach(v => {
      if (state.number[n].find(e => e === v) !== v) {
        state.number[n].push(v)
      }
    })
  },
  updated (state, { items, number, season }) {
    items.forEach(day => {
      day.forEach(classObj => {
        if (classObj.number === 'undefined') {
          classObj.classroom = ''
          classObj.name = ''
          classObj.number = ''
          classObj.season = ''
          classObj.teacher = ''
          classObj.time = ''
        }
        const source = { attend: 0, absent: 0, memo: '' }
        Object.assign(classObj, source)
      })
    })
    switch (season) {
      case 'haruA':
        state.nowSeason = 0
        break
      case 'haruB':
        state.nowSeason = 1
        break
      case 'haruC':
        state.nowSeason = 2
        break
      case 'akiA':
        state.nowSeason = 3
        break
      case 'akiB':
        state.nowSeason = 4
        break
      case 'akiC':
        state.nowSeason = 5
        break
    }
    state.items.splice(state.nowSeason, 1, items)
    // state.numberに入っていないnumberを追加
    number.forEach(v => {
      if (state.number[state.nowSeason].find(e => e === v) !== v) {
        state.number[state.nowSeason].push(v)
      }
    })
    if (state.isLogin === true) this.dispatch('save', { state })
  },
  updateThemeShow (state, items) {
    items.forEach((v, index) => {
      state.theme.table[index].show = v
    })
  },
  // localStorageからの復元
  restore (state, { nowSeason, items, number, theme, isLogin }) {
    state.nowSeason = nowSeason
    state.items = items
    state.number = number
    state.theme = theme
    state.isLogin = isLogin
  },
  update (state, { dialog, name }) {
    // save
    if (name) {
      state.items[state.nowSeason][dialog.col][dialog.row].name = dialog.className
      state.items[state.nowSeason][dialog.col][dialog.row].attend = dialog.attend
      state.items[state.nowSeason][dialog.col][dialog.row].absent = dialog.absent
      state.items[state.nowSeason][dialog.col][dialog.row].memo = dialog.memo
    // delete
    } else {
      state.items[state.nowSeason][dialog.col][dialog.row] = { classroom: '', name: '', number: '', season: '', teacher: '', time: '' }
    }
  },
  login (state) {
    state.isLogin = true
  },
  loading (state, bool) {
    state.isLoading = bool
  },
  message (state, { message, log }) {
    state.alert.message = message
    state.alert.log = log
  },
  reLogin (state, bool) {
    state.reLogin = bool
  }
}

// 非同期処理やローカルストレージとの通信
export const actions = {
  // 授業番号
  async number (context, { number, semester }) {
    context.commit('loading', true)
    try {
      await axios.post('https://twinte.net/api', { number, view_season: semester })
        .then(items => {
          if (items === 'undefined_class_number(Array)') {
            context.commit('loading', false)
          } else {
            items.data.forEach((col, c) => {
              col.forEach((item, r) => {
                let num = 0
                switch (semester) {
                  case 'haruA':
                    num = 0
                    break
                  case 'haruB':
                    num = 1
                    break
                  case 'haruC':
                    num = 2
                    break
                  case 'akiA':
                    num = 3
                    break
                  case 'akiB':
                    num = 4
                    break
                  case 'akiC':
                    num = 5
                    break
                }
                if (item.number === 'undefined') {
                  // undefinedの時はスキップ
                } else if (context.state.items[num].length === 0) {
                  // 初めて時間割が追加される学期
                  context.commit('updated', { items: items.data, number, season: semester })
                  context.commit('login')
                } else {
                  // すでにある時間割に追加する
                  context.commit('splice', { item, number, c, r, n: num })
                  context.commit('login')
                }
              })
            })
          }
        })
      context.commit('loading', false)
    } catch (error) {
      console.error(error)
      context.commit('loading', false)
    }
  },
  // CSVでのログイン
  async csvFunction (context, { formData, config, semester }) {
    context.commit('loading', true)
    await axios
      .post('https://twinte.net/api', formData, config)
      .then(function (items) {
        const number = items.data.map(item => {
          return item
            .filter(v => v.number !== 'undefined')
            .map(v => v.number)
        })
          .reduce((a, b) => a.concat(b), [])
          .filter((x, i, self) => self.indexOf(x) === i)
        context.commit('login')
        switch (semester) {
          case '春A':
            context.commit('updated', { items: items.data, number, season: 'haruA' })
            break
          case '春B':
            context.commit('updated', { items: items.data, number, season: 'haruB' })
            break
          case '春C':
            context.commit('updated', { items: items.data, number, season: 'haruC' })
            break
          case '秋A':
            context.commit('updated', { items: items.data, number, season: 'akiA' })
            break
          case '秋B':
            context.commit('updated', { items: items.data, number, season: 'akiB' })
            break
          case '秋C':
            context.commit('updated', { items: items.data, number, season: 'akiC' })
            break
        }
      })
      .catch(function (err) {
        console.error(err)
      })
    if (context.state.isLogin === true) context.dispatch('save', { state: context.state })
    context.commit('loading', false)
  },
  // 見た目の更新
  updateThemeShow (context, items) {
    context.commit('updateThemeShow', items)
  },
  // ローカルストレージへの保存
  save ({ state }) {
    const data = {
      nowSeason: state.nowSeason,
      items: state.items,
      number: state.number,
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
