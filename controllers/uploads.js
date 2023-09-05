const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );
const { response } = require("express");

const { uploadFile } = require('../helpers');
const { User, Product } = require('../models');
 
const loadFile = async (req, res = response) => {

    try {
      const tempName = await uploadFile(req.files, undefined, 'imgs');
      res.json({ tempName  });      
    } catch (msg) {
      res.status(400).json({ msg })
    }
    //txt, md
    
}

const updateFile = async (req, res = response) =>{

  const { id, colection } = req.params;
  let model;

  switch ( colection ) {

    case 'users':
      model = await User.findById(id);
      if(!model){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
    break;

    case 'products':
      model =  await Product.findById(id);
      if(!model){
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }
    break;
  
    default:
      return res.status(500).json({ msg: 'Se me olvidó validar esto' });
  }

  // Limpiar imágenes previas

  if( model.img ){
    //Hay que borrar la imagen del server
    const pathImg = path.join(__dirname, '../uploads/', colection, model.img );
    if( fs.existsSync( pathImg ) ) fs.unlinkSync( pathImg );
  }

  model.img = await uploadFile(req.files, undefined, colection);

  await model.save();

  res.json(model);
}

const updateFileCloudinary = async (req, res = response) =>{

  const { id, colection } = req.params;
  let model;

  switch ( colection ) {

    case 'users':
      model = await User.findById(id);
      if(!model){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
    break;

    case 'products':
      model =  await Product.findById(id);
      if(!model){
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }
    break;
  
    default:
      return res.status(500).json({ msg: 'Se me olvidó validar esto' });
  }

  // Limpiar imágenes previas
  if( model.img ){
    const nombreArr = model.img.split('/');
    const nombre = nombreArr[ nombreArr.length - 1 ];
    const [ public_id ] = nombre.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;

  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

  model.img = secure_url;

  await model.save();

  res.json( model );
}



showImage = async(req, res = response) => {
  
  const { id, colection } = req.params;
  let model;

  switch ( colection ) {

    case 'users':
      model = await User.findById(id);
      if(!model){
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
    break;

    case 'products':
      model =  await Product.findById(id);
      if(!model){
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }
    break;
  
    default:
      return res.status(500).json({ msg: 'Se me olvidó validar esto' });
  }

  // Limpiar imágenes previas

  if( model.img ){
    //Hay que borrar la imagen del server
    const pathImg = path.join(__dirname, '../uploads/', colection, model.img );
    if( fs.existsSync( pathImg ) ) {
      return res.sendFile( pathImg );
    }
  }
  const pathImg = path.join(__dirname, '../assets/no-image.jpg')
  res.sendFile(pathImg);
}

module.exports = {
    loadFile,
    showImage,
    updateFile,
    updateFileCloudinary
}