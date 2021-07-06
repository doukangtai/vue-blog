<template>
  <el-row :gutter="20">
    <el-col :span="16" :offset="4">
      <el-card class="box-card" v-for="(item, index) in article">
        <h1 class="title" @click="getArticleById(item.id)">{{ item.title }}</h1>
        <div class="tct">
          <i class="el-icon-time marginrl"></i>发表于
          <span>{{ item.date }}</span>
          <span class="marginrl">|</span>
          <i class="el-icon-folder-opened marginrl"></i>
          <span class="category"
                @click="getArticleByCategory(item.category.id, item.category.category)">{{ item.category.category }}</span>
          <span class="marginrl">|</span>
          <span v-for="(it, ind) in item.tags">
          <i class="el-icon-collection-tag marginrl"></i>
          <span class="tag" @click="getArticleByTagId(it.id, it.tag)">{{ it.tag }}</span>
          </span>
        </div>
        <div class="content">
          {{ item.content }}
        </div>
        <div class="more" @click="getArticleById(item.id)">
          <span>阅读全文</span>
        </div>
      </el-card>
      <div class="block">
        <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="total">
        </el-pagination>
      </div>
      <el-backtop target=".el-main"></el-backtop>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";

export default {
  name: "DisplayArticle",
  mounted() {
    this.listSubstringContent();
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.listSubstringContent();
    },
    listSubstringContent() {
      axios.get('/article/list/substring', {
        params: {
          page: this.page - 1,
          size: this.pageSize
        }
      }).then(value => {
        const data = value.data;
        if (data.success) {
          this.article = data.content.list;
          this.total = data.content.total;
        } else {
          this.$message.error({message: data.message})
        }
        document.getElementsByClassName('el-main')[0].scrollTop = 0;
      })
    },
    getArticleById(id) {
      this.$router.push({path: '/articleDetail', query: {articleId: id}});
    },
    getArticleByCategory(id, category) {
      this.$router.push({path: '/archive', query: {categoryId: id, categoryName: category}});
    },
    getArticleByTagId(id, tag) {
      this.$router.push({path: '/archive', query: {tagId: id, tagName: tag}});
    },
  },
  data() {
    return {
      article: [],
      page: 1,
      pageSize: 7,
      total: 100,
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 100%;
  margin-bottom: 20px;
}

.el-row {
  margin-bottom: 20px;

&
:last-child {
  margin-bottom: 0;
}

}
.el-col {
  border-radius: 4px;
}

a {
  display: inline-block;
  text-decoration: none;
}

.title {
  margin-top: 0;
  font-weight: 400;
  color: black;
  cursor: pointer;
}

.title:hover {
  color: #a393eb;
}

.tct {
  margin: 0 0 30px 0;
  color: #999999;
  font-size: 13px;
}

.category, .tag {
  cursor: pointer;
}

.category:hover, .tag:hover {
  text-decoration: underline;
}

.marginrl {
  margin: 0 3px;
}

.content {
  line-height: 25px;
}

.more {
  margin: 20px auto;
}

.more span {
  color: black;
  border: 3px solid black;
  padding: 5px 20px;
  cursor: pointer;
}

.more span:hover {
  background-color: black;
  color: white;
}
</style>
