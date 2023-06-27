import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      const errorObj = {
        message: "You are logged in",
        error: false
      }
      setErrorMessage(errorObj)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      const errorObj = {
        message: "wrong username or password",
        error: true
      }
      setErrorMessage(errorObj)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logOut = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObj = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    blogService
      .create(blogObj)
      .then(returnedBlog => {
        console.log(returnedBlog)
        setBlogs(blogs.concat(returnedBlog))
        const errorObj = {
          message: `a new blog ${newTitle} by ${newAuthor} added`,
          error: false
        }
        setErrorMessage(errorObj)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setTitle('')
        setAuthor('')
        setUrl('')
        
      })
      .catch(error => {
        console.log(error)
        const errorObj = {
          message: error.response.data.error,
          error: true
        }
            setErrorMessage(errorObj)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
        })
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const loggedIn = () => (
    <div>
      <h2>blogs</h2>
      <form onSubmit={addBlog}>
        <div>Title: 
          <input
            type="text"
            value={newTitle}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author: 
        <input
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url: 
        <input
            type="text"
            value={newUrl}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      <h1>BlogApp</h1>

      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in
            <button onClick={logOut}>logout</button></p>
          {loggedIn()}
        </div>
      }
    </div>
  )
}

export default App
