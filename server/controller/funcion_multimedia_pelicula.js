const { MultimediaPelicula, Pelicula, Multimedia } = require("../models");

const obtenerMultimediaPelicula = async (req, res = response) => {
  const { limite = 20, desde = 0 } = req.query;
  // Eliminamos el filtro de estado
  const query = {};

  try {
    const limiteNum = Number(limite);
    const desdeNum = Number(desde);

    if (isNaN(limiteNum) || isNaN(desdeNum)) {
      return res.status(400).json({
        Ok: false,
        resp: "Los parámetros 'limite' y 'desde' deben ser números válidos.",
      });
    }

    const [total, imagenes_peliculas] = await Promise.all([
      MultimediaPelicula.countDocuments(query),
      MultimediaPelicula.find(query)
        .populate({
          path: "peliculas_id",
          select: "titulo fecha_lanzamiento",
        })
        .populate({
          path: "imagenes_id",  
          select: "descripcion url",
        })
        .skip(desdeNum)
        .limit(limiteNum),
    ]);

    res.json({ Ok: true, total: total, resp: imagenes_peliculas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Ok: false, resp: error.message });
  }
};

const obtenerTodosMultimedia = async (req, res = response) => {
  try {
    const total = await MultimediaPelicula.countDocuments();
    const documentos = await MultimediaPelicula.find();

    res.json({ Ok: true, total: total, documentos: documentos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Ok: false, resp: error.message });
  }
};

const obtenerGrupoMultimedia = async (req, res = response) => {
  const { _id } = req.params;

  try {
    const grupomultimedia = await MultimediaPelicula.findById(_id)
      .populate("peliculas_id", "titulo fecha_lanzamiento")
      .populate("imagenes_id", "descripcion url");

    res.json({ Ok: true, resp: grupomultimedia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Ok: false, resp: error.message });
  }
};

const crearMultimediaPelicula = async (req, res = response) => {
  const { peliculas_id, imagenes_id } = req.body;

  try {
    // Verificar si la película y la imagen existen
    const peliculaExistente = await Pelicula.findById(peliculas_id);
    const imagenExistente = await Multimedia.findById(imagenes_id);

    if (!peliculaExistente) {
      return res.status(404).json({
        Ok: false,
        msg: `La película con ID ${peliculas_id} no existe`,
      });
    }

    if (!imagenExistente) {
      return res.status(404).json({
        Ok: false,
        msg: `La imagen con ID ${imagenes_id} no existe`,
      });
    }

    const data = {
      peliculas_id,
      imagenes_id,
    };

    const multimediaPelicula = new MultimediaPelicula(data);

    // Guardar en la base de datos
    await multimediaPelicula.save();

    res.status(201).json({ Ok: true, resp: multimediaPelicula });
  } catch (error) {
    console.error(error); // Añadir logging del error para la depuración
    res.status(500).json({ Ok: false, resp: error.message });
  }
};

const actualizarMultimediaPelicula = async (req, res = response) => {
  const {_id } = req.params;
  const { peliculas_id, imagenes_id } = req.body;

  try {
    const multimediaPelicula = await MultimediaPelicula.findByIdAndUpdate(_id, { peliculas_id, imagenes_id }, {
      new: true,
    });

    if (!multimediaPelicula) {
      return res.status(404).json({ Ok: false, msg: 'No se encontró ningún documento con el ID proporcionado' });
    }

    res.json({ Ok: true, resp: multimediaPelicula });
  } catch (error) {
    res.status(500).json({ Ok: false, resp: error.message });
  }
};

const borrarMultimediaPelicula = async (req, res = response) => {
  const {_id } = req.params;

  try {

      const multimediaPeliculaBorrado = await MultimediaPelicula.findByIdAndDelete(_id);
      res.json({ Ok: true, resp: multimediaPeliculaBorrado });

  } catch (error) {
      res.json({ Ok: false, resp: error });
  }
};

////////////////////////////////TITULO
const obtenerGrupoMultimediaTitulo = async (req, res = response) => {
  const { titulo } = req.params;

  try {
    // Buscar la película por su título para obtener su mongo_id
    const pelicula = await Pelicula.findOne({ titulo });

    if (!pelicula) {
      return res.status(404).json({ Ok: false, resp: "Película no encontrada" });
    }

    // Buscar el grupo multimedia por el mongo_id de la película
    const grupomultimedia = await MultimediaPelicula.find({ peliculas_id: pelicula._id })
      .populate("peliculas_id", "titulo fecha_lanzamiento")
      .populate("imagenes_id", "descripcion url");

    if (!grupomultimedia) {
      return res.status(404).json({ Ok: false, resp: "Grupo multimedia no encontrado" });
    }

    res.json({ Ok: true, resp: grupomultimedia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Ok: false, resp: error.message });
  }
};





module.exports = {
  obtenerMultimediaPelicula,
  obtenerTodosMultimedia,
  obtenerGrupoMultimedia,
  crearMultimediaPelicula,
  actualizarMultimediaPelicula,
  borrarMultimediaPelicula,
  obtenerGrupoMultimediaTitulo
};
