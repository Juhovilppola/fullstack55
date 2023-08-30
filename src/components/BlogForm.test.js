import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const input = container.querySelector('#title')
  const inputtwo = container.querySelector('#author')
  const inputthree = container.querySelector('#url')
  const sendButton = screen.getByText('Submit')

  await user.type(input, 'test title')
  await user.type(inputtwo, 'test author')
  await user.type(inputthree, 'test url')
  await user.click(sendButton)
  console.log(createBlog.mock.calls[0][0])
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('test title')
  expect(createBlog.mock.calls[0][0].author).toBe('test author')
  expect(createBlog.mock.calls[0][0].url).toBe('test url')

})