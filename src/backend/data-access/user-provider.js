const TB_TABLE = "tb_user";
const dateUtils = require("mainam-react-native-date-utils");
const db = require("../database");

module.exports = {
  getByEmail(email) {
    return new Promise((resolve, reject) => {
      try {
        let sql = `select * from ${TB_TABLE} where email = '${email}'`;
        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            if (result.length) resolve(result[0]);
            else resolve(null);
          }
        });
      } catch (error) {
        console.log(error);

        reject(error);
      }
    });
  },
  getById(id) {
    return new Promise((resolve, reject) => {
      try {
        let sql = `select * from ${TB_TABLE} where id = '${id}'`;
        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            if (result.length) resolve(result[0]);
            else resolve(null);
          }
        });
      } catch (error) {
        console.log(error);

        reject(error);
      }
    });
  },

  setLastLogin(id) {
    return new Promise((resolve, reject) => {
      let query = `update  ${TB_TABLE} set lastLogin=? where id=?`;
      db.queryWithParam(
        query,
        [new Date().format("yyyy-MM-dd HH:mm:ss"), id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },
  changePassword(id, oldPassword, newPassword) {
    return new Promise(async (resolve, reject) => {
      let query = `update  ${TB_TABLE} set password=? where id=? and password = ?`;
      db.queryWithParam(
        query,
        [newPassword, id, oldPassword],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },

  setActive(id, active) {
    return new Promise((resolve, reject) => {
      let query = `update  ${TB_TABLE} set active=? where id=?`;
      db.queryWithParam(query, [active, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },
  createOrEdit(
    id,
    name,
    birthday,
    phone,
    email,
    lastlogin,
    active,
    password,
    avatar
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.getById(id);
        if (user) {
          let sql = `update  ${TB_TABLE} set 
                        name=N'${name}', 
                        birthday=N'${birthday}', 
                        phone=N'${phone}', 
                        active=${active}, 
                        lastLogin=N'${lastlogin}' where id=${id}`;
          db.query(sql, function (err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        } else {
          var sql = `insert into ${TB_TABLE} (
                        id, 
                        name, 
                        active, 
                        birthday, 
                        lastLogin, 
                        phone, 
                        email,
                        password) 
                    values (
                        ${id},
                        N'${name}',
                        ${active},
                        N'${birthday}',
                        N'${lastlogin}',
                        N'${phone}',
                        N'${email}',
                        N'${password}',                        
                        )`;
          db.query(sql, function (err, result) {
            if (err) reject(err);
            else resolve(result);
          });
        }
      } catch (error) {
        console.log(error);

        reject(error);
      }
    });
  },
};
