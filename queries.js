const { pool } = require("./config");
var jwt = require("jsonwebtoken");
require("dotenv").config();

// Core

const userLogin = (request, response) => {
  const { username, password } = request.body;
  pool.query(
    "SELECT username,role,user_level,nama_lengkap,aktif FROM akun a JOIN user_level u ON a.role=u.id_ul WHERE username = $1 AND password = $2",
    [username, password],
    (error, results) => {
      if (error) {
        return response.status(500).json({ error: "something went wrong" });
      }
      // generate token
      // const token = utils.generateToken(results.rows);
      const user = results.rows;
      if (!user.length)
        return response.status(401).json({ error: "unauthorized user" });

      const token = jwt.sign({ user }, process.env.JWT_SECRET);
      // return the token along with user details
      return response.status(201).json({ token, user });
    }
  );
};

const getDaftarProvinsi = (request, response) => {
  pool.query(
    "SELECT id_provinsi, nama_provinsi FROM provinsi",
    (error, results) => {
      if (error) {
        response.json({ error });
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getDaftarRegency = (request, response) => {
  pool.query(
    "SELECT id_regency, nama_regency FROM regency",
    (error, results) => {
      if (error) {
        response.json({ error });
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

// Faskes

const registerPasien = (request, response) => {
  const { data_pasien, username } = request.body;
  pool.query(
    `
    SELECT COUNT(kode_pasien) as jumlah
    from info_pasien
    where id_regency=$1 AND id_provinsi=$2
  `,
    [data_pasien.id_regency, data_pasien.id_provinsi],
    (err, res) => {
      if (err) return response.json({ error: err });
      const urutan = res.rows[0].jumlah;
      const kode_pasien = `${data_pasien.id_provinsi}${
        data_pasien.id_regency
      }${username}${+urutan + 1}`;
      pool.query(
        `
  INSERT INTO info_pasien (
    nama_pasien,
    tanggal_lahir,
    tempat_lahir,
    id_gender,
    status_kehamilan,
    nama_kk,
    nik,
    alamat,
    id_regency,
    id_provinsi,
    telepon,
    kode_pasien,
    waktu_pendaftaran) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11, $12, NOW())
  `,
        [
          data_pasien.nama_pasien,
          data_pasien.tanggal_lahir,
          data_pasien.tempat_lahir,
          data_pasien.id_gender,
          data_pasien.status_kehamilan,
          data_pasien.nama_kk,
          data_pasien.nik,
          data_pasien.alamat,
          data_pasien.id_regency,
          data_pasien.id_provinsi,
          data_pasien.telepon,
          kode_pasien,
        ],
        (error, results) => {
          if (error) {
            return response.json({ error: error });
          } else {
            const status_pasien = 2;
            pool.query(
              `INSERT INTO update_pasien (kode_pasien,status_pasien,waktu_penetapan) VALUES ($1,$2, NOW())`,
              [kode_pasien, status_pasien],
              (error, results) => {
                if (error) {
                  response.json({ error });
                } else {
                  response.status(201).send(`Response added successfully.`);
                }
              }
            );
          }
        }
      );
    }
  );
};

const inputPemeriksaanPasien = (request, response) => {
  const {
    kode_pasien,
    no_rekmed,
    suhu_tubuh,
    batuk,
    sakit_tenggorokan,
    sesak_napas,
    pilek,
    lesu,
    sakit_kepala,
    tanda_pneumonia,
    diare,
    mual,
    diagnosa_primer,
    diagnosa_sekunder,
    diagnosa_prosedur,
  } = request.body;
  pool.query(
    "INSERT INTO pemeriksaan_pasien (kode_pasien, no_rekmed, suhu_tubuh, batuk, sakit_tenggorokan, sesak_napas, pilek, lesu, sakit_kepala, tanda_pneumonia, diare, mual, diagnosa_primer, diagnosa_sekunder, diagnosa_prosedur, waktu_pemeriksaan) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW())",
    [
      kode_pasien,
      no_rekmed,
      suhu_tubuh,
      batuk,
      sakit_tenggorokan,
      sesak_napas,
      pilek,
      lesu,
      sakit_kepala,
      tanda_pneumonia,
      diare,
      mual,
      diagnosa_primer,
      diagnosa_sekunder,
      diagnosa_prosedur,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(201).send(`Response added successfully.`);
      }
    }
  );
};

const inputRujukanLab = (request, response) => {
  const { kode_pasien, kode_lab, sputum, swab, bal, serum } = request.body;
  pool.query(
    "INSERT INTO rujukan_lab (kode_pasien, kode_lab, sputum, swab, bal, serum, waktu_rujukan) VALUES ($1,$2,$3,$4,$5,$6,NOW())",
    [kode_pasien, kode_lab, sputum, swab, bal, serum],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(201).send(`Response added successfully.`);
      }
    }
  );
};

const inputRujukanPasien = (request, response) => {
  const {
    kode_pasien,
    faskes_asal,
    faskes_tujuan,
    alasan_merujuk,
  } = request.body;
  pool.query(
    "INSERT INTO rujukan_pasien (kode_pasien, faskes_asal, faskes_tujuan, alasan_merujuk, waktu_rujukan) VALUES ($1,$2,$3,$4,NOW())",
    [kode_pasien, faskes_asal, faskes_tujuan, alasan_merujuk],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(201).send(`Response added successfully.`);
      }
    }
  );
};

const getTabelICD = (request, response) => {
  pool.query(
    "SELECT id_kode, kode, indonesia FROM tabel_icd",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getDataStatusPasien = (request, response) => {
  const { kode_pasien } = request.body;
  pool.query(
    "SELECT id_status, kode_pasien, status_pasien, waktu_penetapan FROM update_pasien WHERE kode_pasien = $1",
    [kode_pasien],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getDaftarPasienFaskes = (request, response) => {
  pool.query(
    `SELECT 
    id_pasien,
    nama_pasien,
    tanggal_lahir,
    tempat_lahir,
    gender_name,
    status_kehamilan,
    nama_kk,
    nik,
    alamat, 
    nama_regency,
    nama_provinsi,
    telepon,
    p.kode_pasien,
    status_pasien,
    status_name
    waktu_pendaftaran
    FROM info_pasien p
    JOIN gender g
    ON p.id_gender = g.id_gender
    JOIN provinsi pr
    ON p.id_provinsi = pr.id_provinsi
    JOIN regency r
    ON p.id_regency = r.id_regency
    JOIN update_pasien u
    ON p.kode_pasien = u.kode_pasien
    JOIN status_pasien s
    ON u.status_pasien = s.id_status`,
    (error, results) => {
      if (error) {
        response.json({ error });
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const updateStatusPasien = (request, response) => {
  const { kode_pasien, status_pasien } = request.body;
  pool.query(
    "UPDATE update_pasien SET status_pasien = $2 where kode_pasien = $1",
    [kode_pasien, status_pasien],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(201).send(`Data updated successfully.`);
      }
    }
  );
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

const inputHasilLab = (request, response) => {
  const { hasil_pengujian, id_spesimen } = request.body;
  pool.query(
    "UPDATE spesimen_lab SET waktu_pengujian = NOW() AND hasil_pengujian = $1 WHERE id_spesimen = $2",
    [hasil_pengujian, id_spesimen],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(201).send(`Berhasil diupdate.`);
      }
    }
  );
};

const terimaSpesimen = (request, response) => {
  const { id_rujukan } = request.body;
  pool.query(
    "UPDATE rujukan_lab SET waktu_diterima = NOW() WHERE id_rujukan=$1",
    [id_rujukan],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(201).send(`Berhasil diupdate.`);
      }
    }
  );
};

const hasilLab = (request, response) => {
  pool.query(
    "with total as (select r.id_pasien, r.id_rujukan, s.waktu_pengujian, sum(case when hasil_pengujian = 1 then 1 else 0 end) as total from rujukan_lab r join spesimen_lab s on r.id_rujukan = s.id_rujukan group by 1,2,3 ) select nama_pasien, (CASE WHEN total = 0 THEN 'Negatif' ELSE 'Positif' END) as hasil from total t join info_pasien i on t.id_pasien = i.kode_pasien order by waktu_pengujian desc limit 1",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getDaftarPasienLab = (request, response) => {
  const { kode_lab } = request.body;
  pool.query(
    `SELECT 
    id_pasien,
    nama_pasien,
    tanggal_lahir,
    tempat_lahir,
    gender_name,
    status_kehamilan,
    nama_kk,
    nik,
    alamat, 
    nama_regency,
    nama_provinsi,
    telepon,
    p.kode_pasien,
    status_pasien,
    status_name,
    id_rujukan,
    waktu_pendaftaran,
    CASE WHEN waktu_diterima IS NULL THEN 'spesimen_rs' ELSE 'spesimen_lab' END as status_lab
    FROM info_pasien p
    JOIN gender g
    ON p.id_gender = g.id_gender
    JOIN provinsi pr
    ON p.id_provinsi = pr.id_provinsi
    JOIN regency r
    ON p.id_regency = r.id_regency
    JOIN update_pasien u
    ON p.kode_pasien = u.kode_pasien
    JOIN status_pasien s
    ON u.status_pasien = s.id_status
    JOIN rujukan_lab ru
    ON p.kode_pasien = ru.kode_pasien
	WHERE kode_lab = $1`,
    [kode_lab],
    (error, results) => {
      if (error) {
        response.json({ error });
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

// Surveillance

const getDaftarPasien = (request, response) => {
  pool.query(
    `SELECT 
      id_pasien,
      nama_pasien,
      tanggal_lahir,
      tempat_lahir,
      gender_name,
      status_kehamilan,
      nama_kk,
      nik,
      alamat, 
      nama_regency,
      nama_provinsi,
      telepon,
      kode_pasien,
      waktu_pendaftaran
      FROM info_pasien p
      JOIN gender g
      ON p.id_gender = g.id_gender
      JOIN provinsi pr
      ON p.id_provinsi = pr.id_provinsi
      JOIN regency r
      ON p.id_regency = r.id_regency`,
    (error, results) => {
      if (error) {
        response.json({ error });
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

module.exports = {
  userLogin,
  getDaftarProvinsi,
  getDaftarRegency,
  getDaftarLab,
  registerPasien,
  getDataStatusPasien,
  updateStatusPasien,
  inputPemeriksaanPasien,
  inputRujukanPasien,
  inputRujukanLab,
  getTabelICD,
  getDaftarPasienFaskes,
  getDaftarPasienLab,
  inputHasilLab,
  terimaSpesimen,
  hasilLab,
  getDaftarPasien,
};
