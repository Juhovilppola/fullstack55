import './index.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  if(message.error) {

    return (
      <div className="error">
        {message.message}
      </div>
    )
  } else {
    return(
      <div className="blogerror">
        {message.message}
      </div>
    )
  }
}

export default Notification