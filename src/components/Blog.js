const Blog = ({ blog, toggleView, view, username, addLike, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  console.log(blog)


  if(blog.id === view && blog.user.username === username) {
    return(
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleView}>hide</button>
        </div>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={addLike}>like</button>
        </p>
        <p>
          {blog.user.username}
        </p>
        <p>
          <button onClick={removeBlog}>remove</button>
        </p>
      </div>
    )

  } else if (blog.id === view) {
    return(
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleView}>hide</button>
        </div>
        <p>{blog.url}</p>{blog.url}
        <p>likes {blog.likes} <button onClick={addLike}>like</button>
        </p>
        <p>
          {blog.user.username}
        </p>
      </div>
    )
  }else {



    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleView}>view</button>
        </div>

      </div>

    )
  }
}


export default Blog