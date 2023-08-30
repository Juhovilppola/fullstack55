import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// ...

test('rendering title and author', () => {
  const blog = {
    id: 0,
    title: 'test Title',
    author: 'test Author',
    url: 'test url',
    likes: 1337,
    user: { username: 'test username' }

  }



  render(<Blog blog={blog} />)
  //screen.debug()

  const element = screen.getByText('test Title test Author')

  //screen.debug(element)
  //const element = screen.queryByText('test Title')

  expect(element).toBeDefined()
})

test('if view is same as blog id likes and url is showed', () => {
  const blog = {
    id: 0,
    title: 'test Title',
    author: 'test Author',
    url: 'test url',
    likes: 1337,
    user: { username: 'test username' }

  }
  const view = 0



  render(
    <Blog blog={blog} view={view}/>
  )





  //expect(mockHandler.mock.calls).toHaveLength(1)

  screen.getByText('likes 1337')
  screen.getByText('test url')

  screen.debug()
})

test('clicking the button twice calls event handler twice', async () => {
  const blog = {
    id: 0,
    title: 'test Title',
    author: 'test Author',
    url: 'test url',
    likes: 1337,
    user: { username: 'test username' }

  }
  const view = 0

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} addLike={mockHandler} view={view}/>
  )


  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)


  expect(mockHandler.mock.calls).toHaveLength(2)



  screen.debug()
})