const Word = require('../models/word')

exports.word_create = (req,res)=>{
    const word = req.params
    Word.findOne({russian:word}),(err,words)=>{
        if(err) return console.log(err)
        return res.send(words)
    }
}

exports.word_delete = (req,res)=>{
    res.send({'asdsd':'asdasd'})
}

exports.word_update = (req,res)=>{
    res.send({'asdsd':'asdasd'})
}

exports.word_read = (req,res)=>{
    res.send({'asdsd':'asdasd'})
}

exports.TEST = (req,res)=>{
    res.send({'asdsd':'asdasd'})
}
