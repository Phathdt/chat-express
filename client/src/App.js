import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useForm } from 'react-hook-form'

const socket = io('http://localhost:3000')

function App() {
  const [messages, setMessages] = useState([])
  const { register, handleSubmit, reset } = useForm()

  function onSubmit(data) {
    socket.emit('message', data)

    reset()
  }

  useEffect(() => {
    const messageListener = (message) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message].sort(
          (a, b) => a.time - b.time
        )

        return newMessages
      })
    }

    socket.on('messages', messageListener)

    return () => {
      socket.off('messages', messageListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register('content')} />

        <input type="submit" />

        {messages.length > 0 &&
          messages.map((m) => {
            const time = new Date(m.time).toISOString()
            return (
              <p key={m.id}>
                {time}: {m.content}
              </p>
            )
          })}
      </form>
    </div>
  )
}

export default App
