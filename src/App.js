import { useState, useEffect,useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  /*const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState([])*/
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [view, setView] = useState(null)

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

  const noteFormRef = useRef()

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
        message: 'You are logged in',
        error: false
      }
      setErrorMessage(errorObj)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      const errorObj = {
        message: 'wrong username or password',
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

  /* const addBlog = (blogObject) => {
    noteFormRef.current.toggleVisibility()
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
  }*/


  const addBlog = (blogObject) =>  {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog.user = user
        returnedBlog.user.token = null
        setBlogs(blogs.concat(returnedBlog))
        const errorObj = {
          message: 'a new blog added',
          error: false
        }
        setErrorMessage(errorObj)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)


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
      //blogService.getAll().then(blogs =>
    //setBlogs(blogs)
      //)
    noteFormRef.current.toggleVisibility()



  }

  const toggleblogview = id => {
    if(view === id){
      setView(0)
    } else {
      setView(id)
    }
    console.log('toggelblog')

    /*blogService
    .update(id, changedBlog).then(returnedBlog => {
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    })*/


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

  const addLike = id => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog ={ ...blog, likes: blog.likes++ }
    console.log(blog)
    console.log('addlike')
    console.log(changedBlog)

    blogService
      .update(id, blog).then(returnedBlog => {
        console.log(returnedBlog)
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
  }
  const removeBlog = id => {
    const blog = blogs.find(n => n.id === id)
    if(window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      const newBlogs = blogs.filter((blog) => blog.id !== id)
      setBlogs(newBlogs)
      console.log('delete blog')

      blogService
        .deleteBlog(id)
    }

    /*
    console.log('ennen')
    console.log(blogs)
    updateBlogs()
    console.log('jalkeen')
    console.log(blogs)*/




  }


  const loggedIn = () => (

    <div>
      <h2>blogs</h2>
      <Togglable buttonLabel='create new' ref={noteFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} view ={view} username={user.username}
          toggleView={() => toggleblogview(blog.id)}
          addLike={() => addLike(blog.id)}
          removeBlog={() => removeBlog(blog.id)} />
      )}

    </div>
  )

  blogs.sort((a,b) => b.likes - a.likes)
  console.log(user)
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
