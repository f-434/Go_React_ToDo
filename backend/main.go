package main

import (
	"todo-backend/handlers"
	"todo-backend/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	// 1.初始化数据
	models.InitDB()

	// 2.创建路由,引擎，调度中心
	r := gin.Default()

	// 3.配置跨域
	config := cors.DefaultConfig()
	// 前端 React 运行的地址
	config.AllowOrigins = []string{"http://localhost:5173"}
	// 请求方式
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	// header
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept"}

	r.Use(cors.New(config))

	// 4.路由绑定
	r.GET("/todos", handlers.GetTodos)

	r.POST("/todos", handlers.CreateTodo)

	r.PUT("/todos/:id", handlers.UpdateStatus)

	r.Run(":8080")

}
