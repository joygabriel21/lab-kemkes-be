const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
const port = 5943;
const cors = require('cors')
// const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Core
app.post("/user/login", db.userLogin);
// app.get("/user/verify_token", db.verifyToken);
// Faskes
app.post("/faskes/register_pasien", db.registerPasien);
app.post("/faskes/input_pemeriksaan", db.inputPemeriksaanPasien);
app.post("/faskes/input_lab/", db.inputRujukanLab);
app.post("/faskes/input_rujukan/", db.inputRujukanPasien);
app.get ("/faskes/tabel_icd", db.getTabelICD);
// Lab
app.get("/lab/daftar_lab", db.getDaftarLab);
app.put("/lab/input_hasil", db.inputHasilLab);
app.put("/lab/terima_spesimen", db.terimaSpesimen);
// app.get("/lab/hasil_lab", db.hasilLab);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
