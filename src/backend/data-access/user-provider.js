const TB_TABLE = "tb_user";
const dateUtils = require("mainam-react-native-date-utils");
const db = require("../database");

module.exports = {
  search(page, size, id, name, active, phone, email, role) {
    return new Promise((resolve, reject) => {
      try {
        if (!page)
          page = 1;
        if (!size)
          size = 10;
        size = parseInt(size);
        let sql = `select * from tb_user where 1=1 `;
        let param = [];
        if (id && id.trim()) {
          sql += ` and id = '${id}'`;
        }
        if (name) {
          sql += ` and name like ? `;
          param.push('%' +name + '%');
        }
        if (active !== undefined) {
          sql += ` and active = ${active == 1 ? true : false}`;
          // sql += ` and active = ?`;
          // param.push(active == 1 ? true : false);
      }
        if (email) {
          sql += ` and email like ? `;
          param.push('%' +email + '%');
        }
        if (phone) {
          sql += ` and phone like ? `;
          param.push('%' +phone + '%');
        }
        if (role) {
          sql += ` and role like ? `;
          param.push('%' +role + '%' );
        }
        sql += ` order by id DESC`

        db.queryWithParam(sql, param, function (err, result) {
          if (err) {
            reject(err)
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        console.log(error)
        reject(error);
      }
    })
  },
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

  resetpassword(id){
    return new Promise(async (resolve, reject) => {
      try{
        let sql = `update ${TB_TABLE} set password=N'e10adc3949ba59abbe56e057f20f883e' where id = ${id}`;
        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            if (result.length) resolve(result[0]);
            else resolve(null);
          }
        });
      }
      catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      try {
        let sql = `delete from ${TB_TABLE} where id = '${id}'`;
        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
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
  getByEmail(email) {
        return new Promise((resolve, reject) => {
            try {
                let sql = `select * from ${TB_TABLE} where email=N'${email}'`;
                db.query(sql, function (err, result) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        if (result.length)
                            resolve(result[0]);
                        resolve(null);
                    }
                });
            } catch (error) {
                console.log(error)


                reject(error);
            }
        })
    },
  createOrEdit(id, name, active, birthday,phone,email,role,password) {
    return new Promise(async (resolve, reject) => {
        try {

            if (id) {
                let user = await this.getById(id);
                if (!user) {
                    reject(0);
                    return;
                }
                if (email!= user.email) {
                    user = await this.getByEmail(email);
                    if (user) {
                        reject(1);
                        return;
                    }
                }
                let sql = `update  ${TB_TABLE} set
                name=N'${name}',
                phone=N'${phone}',
                birthday=N'${birthday}',
                role=N'${role}',
                active=${active == undefined || active == '0' ? 0 : 1}
                where id = ${id}`;
                db.query(sql, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            } else {
                let user = await this.getByEmail(email);
                if (user) {
                    reject(1);
                    return;
                }
                var sql = `insert into ${TB_TABLE} (
                name,
                phone,
                birthday,
                email,
                role,
                password,
                active)
              values (
                N'${name}',
                N'${phone}',
                N'${birthday}',
                N'${email}',
                N'${role}',
                N'${password}',
                ${active == undefined || active == '0' ? 0 : 1})`;
                db.query(sql, function (err, result) {
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                });
            }
        } catch (error) {
            console.log(error)


            reject(error);
        }
    })
  },
};
