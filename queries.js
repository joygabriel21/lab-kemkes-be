const { pool } = require("./config");
// const utils = require("./utils");

// Core

const userLogin = (request, response) => {
  const {username, password} = request.body;
  pool.query("SELECT username,role,user_level,aktif FROM akun a JOIN user_level u ON a.role=u.id_ul WHERE username = $1 AND password = $2", [username, password], (error, results) => {
      if (error) {
          console.log(error);
      } else {
          // // generate token
          // const token = utils.generateToken(results.rows);
          // // get basic user details
          // const userObj = utils.getCleanUser(results.rows);
          // // return the token along with user details
          // return res.json({ user: userObj, token });
      }
  });
};

// const verifyToken = (request, response) => {
//   const token = req.body.token || req.query.token;
//   if (!token) {
//     return res.status(400).json({
//       error: true,
//       message: "Token diperlukan."
//     });
//   }
//   // check token that was passed by decoding token using secret
//   jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
//     if (err) return res.status(401).json({
//       error: true,
//       message: "Invalid token."
//     });
 
//     // return 401 status if the userId does not match.
//     if (user.userId !== userData.userId) {
//       return res.status(401).json({
//         error: true,
//         message: "Invalid user."
//       });
//     }
//     // get basic user details
//     var userObj = utils.getCleanUser(userData);
//     return res.json({ user: userObj, token });
//   });
// };


// Faskes

const registerPasien = (request, response) => {
  const {nama_pasien, tanggal_lahir, tempat_lahir, id_gender, status_kehamilan, nama_kk, nik, alamat, id_regency, id_provinsi} = request.body;
  pool.query("INSERT INTO info_pasien (id_pasien, tanggal_lahir, tempat_lahir, id_gender, status_kehamilan, nama_kk, nik, alamat, id_regency, id_provinsi, waktu_pendaftaran) VALUES (0,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10, NOW()", [nama_pasien, tanggal_lahir, tempat_lahir, id_gender, status_kehamilan, nama_kk, nik, alamat, id_regency, id_provinsi], (error, results) => {
      if (error) {
          console.log(error);
      } else {
          response.status(201).send(`Response added successfully.`)
      }
  });
};

const inputPemeriksaanPasien = (request, response) => {
  const {no_rekmed, id_pasien, diagnosa_primer, diagnosa_sekunder, diagnosa_prosedur} = request.body;
  pool.query("INSERT INTO pemeriksaan_pasien (no_rekmed, id_pasien, diagnosa_primer, diagnosa_sekunder, diagnosa_prosedur, waktu_pemeriksaan) VALUES ($1,$2,$3,$4,$5,NOW())", [no_rekmed, id_pasien, diagnosa_primer, diagnosa_sekunder, diagnosa_prosedur], (error, results) => {
      if (error) {
          console.log(error);
      } else {
          response.status(201).send(`Response added successfully.`)
      }
  });
};

const inputRujukanLab = (request, response) => {
  const {id_pasien, id_lab, sputum, swab, bal, serum} = request.body;
  pool.query("INSERT INTO rujukan_lab (id_pasien, id_lab, sputum, swab, bal, serum, waktu_rujukan) VALUES ($1,$2,$3,$4,$5,$6,NOW())", [id_pasien, id_lab, sputum, swab, bal, serum], (error, results) => {
      if (error) {
          console.log(error);
      } else {
          response.status(201).send(`Response added successfully.`)
      }
  });
};

const inputRujukanPasien = (request, response) => {
  const {id_pasien, faskes_asal, faskes_tujuan, alasan_merujuk} = request.body;
  pool.query("INSERT INTO rujukan_pasien (id_rujukan, faskes_asal, faskes_tujuan, id_faskes, alasan_merujuk, waktu_rujukan) VALUES ($1,$2,$3,$4,NOW())", [id_pasien, faskes_asal, faskes_tujuan, alasan_merujuk], (error, results) => {
      if (error) {
          console.log(error);
      } else {
          response.status(201).send(`Response added successfully.`)
      }
  });
};

const getTabelICD = (request, response) => {
  pool.query("SELECT id_kode, kode, indonesia FROM tabel_icd", (error, results) => {
      if (error) {
          console.log(error);
      } else {
          response.status(200).json(results.rows);
      }
  });
};

// Lab
const getDaftarLab = (request, response) => {
  pool.query("SELECT id_lab, kode_lab, nama_lab FROM lab", (error, results) => {
    if (error) {
      console.log(error);
    } else {
      response.status(200).json(results.rows);
    }
  });
};

const getDaftarSpesimen = (request, response) => {
  pool.query("SELECT id_lab, kode_lab, nama_lab FROM lab", (error, results) => {
    if (error) {
      console.log(error);
    } else {
      response.status(200).json(results.rows);
    }
  });
};

module.exports = {
  userLogin,
  getDaftarLab,
  registerPasien,
  inputPemeriksaanPasien,
  getDaftarSpesimen,
  inputRujukanPasien,
  inputRujukanLab,
  getTabelICD
};
