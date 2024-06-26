const { Multimedia } = require('../models');

const crearMultimedia = async (req, res) => {
    try {
      const nuevaMultimedia = await Multimedia.create(req.body);
      res.json({ Ok: true, resp: nuevaMultimedia });
    } catch (error) {
      console.error("Error en crearPelicula:", error);
      res.status(500).json({ Ok: false, resp: error.message });
    }
  };

const obtenerMultimedias = async (req, res) => {
    try {
      const multimedia = await Multimedia.find();
      res.json({ Ok: true, resp: multimedia });
    } catch (error) {
      console.error("Error en obtenerMultimedia:", error);
      res.status(500).json({ Ok: false, resp: error.message });
    }
  };

const obtenerMultimediaId = async (req, res) => {
    const {_id } = req.params;
    try {
      const multimedia = await Multimedia.findById(_id);
      res.json({ Ok: true, resp: multimedia });
    } catch (error) {
      console.error("Error en obtenerMultimediaPorId:", error);
      res.status(500).json({ Ok: false, resp: error.message });
    }
  };


  const eliminarMultimedia = async (req, res) => {
    try {
      const { _id } = req.params;
  
      if (!_id) {
        return res
          .status(400)
          .json({
            error: "ID de la Multimedia no proporcionado en la url",
          });
      }
  
      const multimediaEliminada = await Multimedia.findByIdAndDelete(_id);
  
      if (!multimediaEliminada) {
        return res.status(404).json({ error: "Multimedia no encontrado" });
      }
  
      res.json({ message: "Multimedia eliminada exitosamente" });
    } catch (error) {
      console.error("Error en eliminar Multimedia:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  


  const actualizarMultimedia = async (req, res) => {
    try {
      const { _id } = req.params; // Obtener el ID de los parámetros de la URL
      const { descripcion, url } = req.body;
  
      // Verificar si el ID fue proporcionado
      if (!_id) {
        return res.status(400).json({ error: "ID de multimedia no proporcionada en la URL" });
      }
  
      // Verificar si los campos necesarios están en el cuerpo de la solicitud
      if (!descripcion || !url) {
        return res.status(400).json({ error: "Datos incompletos" });
      }
  
      // Actualizar la multimedia
      const multimediaModificado = await Multimedia.findByIdAndUpdate(_id, { descripcion, url }, { new: true });
  
      // Verificar si la multimedia fue encontrada y modificada
      if (!multimediaModificado) {
        return res.status(404).json({ error: "Multimedia no encontrada" });
      }
  
      // Responder con la multimedia modificada
      res.json({ Ok: true, resp: multimediaModificado });
    } catch (error) {
      console.error("Error en multimedia:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  
  
module.exports = { 
  crearMultimedia, 
  obtenerMultimedias, 
  obtenerMultimediaId,
  eliminarMultimedia,
  actualizarMultimedia
};