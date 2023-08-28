import { useState } from 'react'
//import blogService from './services/blogs'

const BlogForm = ({ createBlog }) => {

  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState([])
  //const [errorMessage, setErrorMessage] = useState(null)

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setTitle('')
    setAuthor('')
    setUrl('')

  }
  return (
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


    </div>
  )
}

export default BlogForm