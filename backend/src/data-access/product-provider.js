const TB_TABLE = "tb_product";
const dateUtils = require('mainam-react-native-date-utils');
const db = require("../database");

module.exports = {
    search(page, size, name, active, selected, userId) {
        return new Promise((resolve, reject) => {
            try {
                if (!page)
                    page = 1;
                if (!size)
                    size = 10; size = parseInt(size);
                let sql = null;
                if (!selected) {
                    sql = `select * from ${TB_TABLE} where 1=1 and deleted = 0 `;
                } else {
                    sql = `SELECT * FROM tb_myproduct as my, tb_product as pr where my.productId = pr.id and deleted = 0 and my.userId = '${userId}' `;
                }
                if (name) {
                    sql += `and name like '%${name}%' `;
                }
                if (active !== undefined) {
                    sql += ` and active = ${active == 1 ? true : false}`;
                }
                sql += ` order by name`
                db.query(sql, function (err, result) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result);
                    }
                });
            } catch (error) {
                console.log(error)


                reject(error);
            }
        })
    },
    getById(id) {
        return new Promise((resolve, reject) => {
            try {
                let sql = `select * from ${TB_TABLE} where id = '${id}'`;;
                db.query(sql, function (err, result) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        if (result.length)
                            resolve(result[0]);
                        else
                            resolve(null);
                    }
                });
            } catch (error) {
                console.log(error)


                reject(error);
            }
        })

    },
    //reject 0 not found    
    getByName(name) {
        return new Promise((resolve, reject) => {
            try {
                let sql = `select * from ${TB_TABLE} where name=N'${name}'`;
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
    delete(id) {
        return new Promise((resolve, reject) => {
            try {
                let createdDate = new Date().format("yyyy-MM-dd HH:mm:ss")
                let sql = `update ${TB_TABLE} set deleted=1, updatedDate=N'${createdDate}' where id = '${id}'`;;
                db.query(sql, function (err, result) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result);
                    }
                });
            } catch (error) {
                console.log(error)


                reject(error);
            }
        })

    },
    /*reject 
        0: not exist
        1: exist name       
    */

    createOrEdit(id, name, active) {
        return new Promise(async (resolve, reject) => {
            try {
                let createdDate = new Date().format("yyyy-MM-dd HH:mm:ss")
                if (id) {
                    let product = await this.getById(id);
                    if (!product) {
                        reject(0);
                        return;
                    }
                    if (name != product.name) {
                        product = await this.getByName(name);
                        if (product) {
                            reject(1);
                            return;
                        }
                    }
                    let sql = `update  ${TB_TABLE} set 
                    name=N'${name}', 
                    updatedDate=N'${createdDate}',
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
                    let product = await this.getByName(name);
                    if (product) {
                        reject(1);
                        return;
                    }
                    var sql = `insert into ${TB_TABLE} (
                    name, 
                    createdDate, 
                    updatedDate, 
                    active) 
                values (
                    N'${name}',
                    N'${createdDate}',
                    N'${createdDate}',
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
    setMyProduct(userId, products) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = `delete from tb_myproduct where userId=${userId}`;
                db.query(query, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        query = `insert into tb_myproduct(userId,productId) values ` +
                            products.map(item => {
                                return `(${userId}, ${item})`;
                            });
                        db.query(query, function (err, result) {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    }
                });
            } catch (error) {
                console.log(error)

                reject(error);
            }
        })
    }
}