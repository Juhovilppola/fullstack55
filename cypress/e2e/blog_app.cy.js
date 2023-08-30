describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function() {
    //cy.visit('http://localhost:3000')
    cy.contains('BlogApp')
    cy.contains('username')
    cy.contains('password')

  })
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.error').should('have.css', 'border-style', 'solid')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.createBlog({ title: 'Ftitle', author: 'Fauthor', url: 'Furl' })
    })

    it('A blog can be created', function() {
      cy.contains('create new').click()
      cy.get('#title').type('Kirja')
      cy.get('#author').type('Marja Mustikka')
      cy.get('#url').type('marjamustikankirjapistecom')
      cy.contains('Submit').click()
      cy.contains('Kirja Marja Mustikka')

    })
    it('A blog can be liked', function() {
      cy.contains('view').click()
      cy.contains('likes 0')
      cy.contains('like').click()
      cy.contains('likes 1')
    })
    it('A blog can be removed by user who added the blog', function() {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('a blog deleted')
    })
    it('Remove button only shows up for the blog creator', function() {
      cy.contains('view').click()
      cy.contains('remove')
      cy.contains('logout').click()


      const user = {
        name: 'Seppo Matikainen',
        username: 'Seppo',
        password: 'Sepotius'
      }

      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.visit('http://localhost:3000')
      cy.get('#username').type('Seppo')
      cy.get('#password').type('Sepotius')
      cy.get('#login-button').click()
      cy.contains('view').click()
      cy.get('remove').should('not.exist')

    })
    it('Blogs are ordered by likes', function() {
      cy.createBlog({ title: 'title2', author: 'author2', url: 'url2' })
      cy.createBlog({ title: 'title3', author: 'author3', url: 'url3' })
      cy.createBlog({ title: 'title4', author: 'author4', url: 'url4' })

      cy.get('.blog').eq(0).should('contain', 'Ftitle')
      cy.get('.blog').eq(1).should('contain', 'title2')
      cy.get('.blog').eq(2).should('contain', 'title3')
      cy.get('.blog').eq(3).should('contain', 'title4')

      cy.contains('title4')
        .contains('view')
        .click()
      cy.contains('url4')
      cy.contains('like').click().click().click().click()

      cy.contains('title3')
        .contains('view')
        .click()
      cy.contains('url3')
      cy.contains('like').click().click().click()

      cy.contains('title2')
        .contains('view')
        .click()
      cy.contains('url2')
      cy.contains('like').click().click()

      cy.contains('hide').click()

      cy.get('.blog').eq(0).should('contain', 'title4')
      cy.get('.blog').eq(1).should('contain', 'title3')
      cy.get('.blog').eq(2).should('contain', 'title2')
      cy.get('.blog').eq(3).should('contain', 'Ftitle')

    })

  })
})