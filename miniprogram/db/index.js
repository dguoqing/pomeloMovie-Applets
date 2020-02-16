/**
 * db
 */

const db = wx.cloud.database()

/**
 * collection  表名字
 * 初始化数据库
 */
export const dbInit = (collection) => {
  return db.collection(collection)
}

//插入
export const dbAdd = (collection,data) => {
  return dbInit(collection).add(data)
}

