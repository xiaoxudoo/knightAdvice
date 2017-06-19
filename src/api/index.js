// this is aliased in webpack config based on server/client build
import { createAPI } from 'create-api'

const logRequests = !!process.env.DEBUG_API

const api = createAPI({
  version: '/v0',
  config: {
    apiKey: "AIzaSyB2OY29euKaSzPV2QlU57-RN6d1hpITjEY",
    databaseURL: "https://hackernews-d9292.firebaseio.com",
    projectId: "hackernews-d9292",
  }
})

// warm the front page cache every 15 min
// make sure to do this only once across all requests
if (api.onServer) {
  warmCache()
}

function warmCache () {
  fetchItems((api.cachedIds.advise || []).slice(0, 30))
  setTimeout(warmCache, 1000)
}

function fetch (child) {
  logRequests && console.log(`fetching ${child}...`)
  const cache = api.cachedItems
  if (cache && cache.has(child)) {
    logRequests && console.log(`cache hit for ${child}.`)
    return Promise.resolve(cache.get(child))
  } else {
    return new Promise((resolve, reject) => {
      api.child(child).once('value', snapshot => {
        const val = snapshot.val()
        console.log(val)
        // mark the timestamp when this item is cached
        if (val) val.__lastUpdated = Date.now()
        cache && cache.set(child, val)
        logRequests && console.log(`fetched ${child}.`)
        resolve(val)
      }, reject)
    })
  }
}

export function fetchIdsByType (type) {
  return api.cachedIds && api.cachedIds[type]
    ? Promise.resolve(api.cachedIds[type])
    : fetch(`${type}stories`)
}

export function fetchItem (id) {
  return fetch(`item/${id}`)
}

export function fetchItems (ids) {
  return Promise.all(ids.map(id => fetchItem(id)))
}

export function postForm (postData, type="advise") {
  var isupdate = (postData.id != undefined)
  console.log(isupdate)
  postData.time = new Date().getTime();
  postData.id = isupdate ? postData.id : api.child('item').push().key
  var updates = {};
  updates[postData.id] = postData;
  api.child('item').update(updates)
  var ref = api.child(`${type}stories`).once('value', snapshot => {
    var val = snapshot.val() || []
    isupdate ? '' : val.push(newPostKey)
    api.child(`${type}stories`).set(val)
  })
  return ref;
}

export function watchList (type, cb) {
  let first = true
  const ref = api.child(`${type}stories`)
  const handler = snapshot => {
    if (first) {
      first = false
    } else {
      cb(snapshot.val())
    }
  }
  ref.on('value', handler)
  return () => {
    ref.off('value', handler)
  }
}
