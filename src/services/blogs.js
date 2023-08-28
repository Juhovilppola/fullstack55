import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  console.log('axios update')

  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  console.log('request')
  return request.then(response => response.data)
}

const deleteBlog = (id) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log('axios delete')
  const request = axios.delete(`${ baseUrl }/${id}`, config)
  console.log('delete request')
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken, deleteBlog }