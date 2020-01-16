const express = require('express');

const userActions = require('./userDb')

const router = express.Router();

router.post('/', validateUser, logger, (req, res) => {
  const newUser = req.body;
  userActions.insert(newUser)
    .then(bool => {
      console.log(bool)
      res.status(201).json({message: "new user created"})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({errorMessage: "The server encountered an error processing this request"})
    })
});

router.post('/:id/posts', validatePost, logger, (req, res) => {
  const newPost = req.body;
  userActions.insertPost(newPost)
    .then(post => {
      res.status(201).json({message: "new post created"})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({message: "The server encountered an error processing this request"})
    })
});

router.get('/', logger, (req, res) => {
  userActions.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ errorMessage: "The server encountered an error processing this request"})
    })
});

router.get('/:id', validateUserId, logger, (req, res) => {
  const id = req.params.id;
  userActions.getById(id)
    .then(user => {
      console.log(user)
      res.status(200).json(user)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ errorMessage: "The server encountered an error processing this request"})
    })
});

router.get('/:id/posts', validateUserId, logger, (req, res) => {
  const id = req.params.id;
  userActions.getUserPosts(id)
    .then(posts => {
      console.log(posts)
      res.status(200).json(posts)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ errorMessage: "The server encountered an error processing this request"})
    })
});

router.delete('/:id', validateUserId, logger, (req, res) => {
  const id = req.params.id;
  userActions.remove(id)
    .then(bool => {
      console.log('accepted / rejected bool:', bool)
      if(bool > 0) {
      res.status(202).json({message: `User with id: ${id} was removed`})
      } else {
        res.status(404).json({message: `No User with id: ${id} could be found`})
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({message: "The server encountered an error processing this request"})
    })
});

router.put('/:id', validateUserId, logger, (req, res) => {
  const id = req.params.id;
  const reqBody = req.body;
  userActions.update(id, reqBody)
    .then(bool => {
      console.log('possibly bool from user PUT', bool)
      res.status(200).json({message: "Your request was accepted"})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({message: "The server encountered an error processing this request"})
    })
});

//custom middleware

function logger(req, res, next) {
  console.log('Req.method:', req.method, 'Req.url:', req.url, 'timestamp:', Date.now())

  next();
}

function validateUserId(req, res, next) {
  userActions.getById(req.params.id)
    .then(user => {
      if(user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({message: "invalid user ID"})
      }
    })
}

function validateUser(req, res, next) {
  console.log(typeof req.body)
  if(req.body) {
    if(req.body.name){
      next();
    } else {
      res.status(400).json({message: "New users must include a name"})
    }
  } else {
    res.status(400).json({ message: "missing user Data"})
  }
}

function validatePost(req, res, next) {
  console.log(req.body);
  if(Object.keys(req.body).length !== 0) {
    if(req.body.text) {
      next()
    } else {
      res.status(400).json({message: "missing required text field"})
    }
  } else {
    res.status(400).json({message: "missing post data"})
  }
} 

module.exports = router;
