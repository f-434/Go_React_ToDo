package handlers

import (
	"net/http"
	"todo-backend/models"

	"github.com/gin-gonic/gin"
)

// 获取所有信息
func GetTodos(c *gin.Context) {
	// 声明数据
	var todos []models.Todo

	// 查询数据,等价于mybatis的list
	models.DB.Find(&todos)

	// 返回结果
	c.JSON(http.StatusOK, todos)
}

// 创建代办
func CreateTodo(c *gin.Context) {
	// 声明todo对象
	var todo models.Todo

	//获取请求体数据,ShouldBindJSON方法会将请求体中的JSON数据绑定到todo对象中，并根据Todo结构体的字段类型进行类型转换和验证
	if err := c.ShouldBindJSON(&todo); err != nil {
		// 返回错误信息,gin.H是一个快捷方式，用于创建一个map[string]interface{}类型的JSON对象
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	} else {
		// 保存数据
		models.DB.Create(&todo)
		// 返回结果
		c.JSON(http.StatusCreated, todo)
	}

}

// 切换状态
func UpdateStatus(c *gin.Context) {
	// 声明todo对象
	var todo models.Todo

	// 获取路径参数
	id := c.Param("id")

	//通过获取的id查询数据库中的todo对象,First方法会根据主键查询数据库，并将查询结果绑定到todo对象中
	if err := models.DB.First(&todo, id).Error; err != nil {
		// 返回错误信息
		c.JSON(http.StatusNotFound, err.Error())
	}

	// 切换状态(取反)
	todo.Completed = !todo.Completed

	// 保存数据
	models.DB.Save(&todo)
	// 返回更新后的数据
	c.JSON(http.StatusOK, todo)
}

// 删除
func DelTodo(c *gin.Context) {
	// 获取id
	id := c.Param("id")

	if err := models.DB.Delete(&models.Todo{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功", "id": id})
}
