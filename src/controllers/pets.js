const {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePetById,
} = require("../repositories/pet");

const getAll = async (req, res) => {
  const { per_page, page } = req.query;
  const pets = await getAllPets(per_page, page);
  res.json({ pets: pets });
};

const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const pet = await getPetById(id);

    if (!pet) {
      // If the DB returns no data (i.e. it is `undefined`), we return a custom error message
      res
        .status(404)
        .json({ error: `A pet with the provided ID ${id} does not exist` });
    } else {
      res.json({ pet: pet });
    }
  } catch (error) {
    // If there is some other error that occurs with the request, we return the built-in error messsage
    res.status(500).json({ error: error.message });
  }
};
const create = async (req, res) => {
  // Ensure the order of the values is:
  // title, director, release_year, duration_mins
  const { name, age, type, breed, microchip } = req.body;
  const values = [name, age, type, breed, microchip];

  try {
    const pet = await createPet(values);

    if (!pet) {
      res.status(400).json({
        error: "Missing fields in the request body.",
        body: req.body,
      });
    } else {
      res.status(201).json({ pet: pet });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, age, type, breed, microchip } = req.body;
  const values = [name, age, type, breed, microchip];

  const foundId = await getPetById(id);
  if (foundId.length === 0) {
    res.status(404).json({
      error: "A pet with the provided ID was not found",
    });
    return;
  }
  const pet = await updatePet(id, values);
  res.status(201).json({ pet: pet });
};

const deletePet = async (req, res) => {
  const { id } = req.params;
  const pet = await deletePetById(id);
  // const pet = await db.query(`DELETE FROM pets WHERE id = ${id}
  // RETURNING *`);
  res.status(201).json({ pet: pet });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deletePet,
};
