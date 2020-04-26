const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
const port = 3001;
const cors = require("cors");
// const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Core
app.post("/user/login", db.userLogin);
app.get("/core/get_provinsi", db.getDaftarProvinsi);
app.get("/core/get_regency", db.getDaftarRegency);
app.get("/core/profile_pasien/:kode_pasien", db.getProfilePasien);
// Faskes
app.post("/faskes/register_pasien", db.registerPasien);
app.post("/faskes/input_pemeriksaan", db.inputPemeriksaanPasien);
app.post("/faskes/input_lab/", db.inputRujukanLab);
app.post("/faskes/input_rujukan/", db.inputRujukanPasien);
app.post("/faskes/update_status/", db.updateStatusPasien);
app.get("/faskes/get_status/", db.getDataStatusPasien);
app.get("/faskes/tabel_icd", db.getTabelICD);
app.get("/faskes/daftar_pasien", db.getDaftarPasienFaskes);
app.get("/faskes/daftar_rujukan", db.getDaftarRujukan);
app.get("/faskes/pengiriman_lab/:kode_faskes", db.getDaftarPengirimanLab);
app.get("/faskes/diterima_lab/:kode_faskes", db.getDaftarDiterimaLab);
app.get("/faskes/diperiksa_lab/:kode_faskes", db.getDaftarDiperiksaLab);
app.get("/faskes/hasil_lab/:kode_faskes", db.getDaftarHasilLab);
// Lab
app.get("/lab/daftar_lab", db.getDaftarLab);
app.put("/lab/input_hasil/:id_rujukan", db.inputHasilLab);
app.put("/lab/terima_spesimen/:id_rujukan", db.terimaSpesimen);
app.get("/lab/daftar_pasien/:kode_lab/:jenis_spesimen", db.getDaftarPasienLab);
app.get("/lab/full_pasien/:kode_lab", db.getDaftarPasienFullLab);
app.get("/lab/list_spesimen", db.getListSpesimen);
app.get("/lab/profile_pasien/:kode_pasien", db.getDaftarProfileLabPasien);
// Surveillance
app.get("/surveillance/daftar_pasien", db.getDaftarPasien);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
