package models

// 导入所需包
import (
	"time"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

// 声明结构体
type Todo struct {
	// 首字母大写表示导出，其他包可以访问（public），小写则表示私有（private），其他包无法访问
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// 定义数据库连接变量
var DB *gorm.DB

// 初始化数据库连接
func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("todos.db"), &gorm.Config{})

	if err != nil {
		panic("无法连接数据库：" + err.Error())
	}
	// 数据迁移,&Todo{}实例化对象，在内存中创建一个零值的Todo结构体实例，并将其传递给AutoMigrate方法，以便GORM可以根据该结构体的定义创建相应的数据库表。
	// 通过反射机制，GORM会读取Todo结构体的字段和标签信息，并根据这些信息生成相应的数据库表结构。
	DB.AutoMigrate(&Todo{})
}
