const getAPI = async (url, _success, _failure) => {
    var header = new Headers()
    fetch(url, {
      method: 'get',
      headers: header
    }).then(async function (response) {
      if (response.ok) {
        return response.json();
      } else {
        response.json().then(er => {
          _failure(er)
        }).catch((error) => { console.log('catch1', error) })
      }
      if (response.status == 401) {
        await AsyncStorage.clear()
      }
    }).then(function (data) {
      _success(data)
    }).catch((error) => {
      console.log(error)
      // _failure(error)
    });
  }
export {getAPI};