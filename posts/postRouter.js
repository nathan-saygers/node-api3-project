const express = require('express');

const router = express.Router();

const postActions = require('./postDb');

router.get('/', (req, res) => {
  postActions.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({message: 'Your request could not be completed'})
    })
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  postActions.getById(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(error => {
      res.status(500).json({message: 'Your request could not be completed'})
    })
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  postActions.remove(id)
    .then(deletedPost => {
      res.status(204).json({ message: `The post with id: ${id} was deleted`})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: 'Your request could not be completed'})
    })
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  postActions.update(id, changes)
    .then(bool => {
      if(bool > 0) {
        postActions.getById(id)
        .then(post => {
          res.status(200).json(post)
        })
        .catch(error => {
          res.status(500).json({message: 'Your request could not be completed'})
        })
      } else {
        res.status(404).json({message: 'Your request could not be completed'})
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({message: 'Your request could not be completed'})
    })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
