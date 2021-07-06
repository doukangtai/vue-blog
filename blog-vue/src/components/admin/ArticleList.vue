<template>
  <div>
    <div>
      <el-input class="titleInput" v-model="searchTitle" placeholder="请输入文章标题"></el-input>
      <el-button class="searchBtn" @click="getArticleByTitle" type="primary" round>查询</el-button>
    </div>
    <template>
      <el-table
          :data="articleData"
          style="width: 100%">
        <el-table-column
            fixed
            prop="id"
            label="编号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="title"
            label="标题"
            width="280">
        </el-table-column>
        <el-table-column
            prop="category.category"
            label="分类"
            width="150">
        </el-table-column>
        <el-table-column
            prop="city"
            label="标签"
            width="380">
          <template slot-scope="scope">
            <el-tag class="tag" type="success" v-for="(tag, index) in scope.row.tags">{{tag.tag}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="date"
            label="发表日期"
            width="160">
        </el-table-column>
        <el-table-column
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button @click="editArticle(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteArticle(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="block" style="margin-top: 10px">
      <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "ArticleList",
    mounted() {
      this.listSubstringContent();
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        if (this.isDirectPageButton) {
          this.listSubstringContent();
        } else {
          this.getArticleByTitle();
        }
      },
      listSubstringContent() {
        axios.get('/article/list/substring', {
          params: {
            page: this.page - 1,
            size: this.pageSize,
          }
        }).then(value => {
          const data = value.data
          if (data.success) {
            this.articleData = data.content.list;
            this.total = data.content.total;
          } else {
            this.$message.error({message: data.message})
          }
        })
      },
      getArticleByTitle() {
        if (this.searchTitle == '') {
          this.isDirectPageButton = true;
          this.listSubstringContent();
        } else {
          this.isDirectPageButton = false;
          axios.get('/article/title', {
            params: {
              page: this.page - 1,
              size: this.pageSize,
              title: this.searchTitle,
            }
          }).then(value => {
            const data = value.data;
            if (data.success) {
              this.articleData = data.content.list;
              this.total = data.content.total;
            } else {
              this.$message.error({message: data.message})
            }
          });
        }
      },
      editArticle(row) {
        this.$router.push({path: '/writeArticle', query: {id: row.id}});
      },
      deleteArticle(row) {
        this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/article/delete/' + row.id).then(value => {
            const data = value.data;
            if (data.success) {
              this.$message.success({message: '删除成功'});
              this.listSubstringContent();
            } else {
              this.$message.error({message: '删除失败'})
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    },
    data() {
      return {
        searchTitle: '',
        articleData: [],
        tagString: '',
        page: 1,
        pageSize: 7,
        total: 100,
        isDirectPageButton: false,
      }
    }
  }
</script>

<style scoped>
  .titleInput, .searchBtn {
    float: left;
    margin: 10px 10px 10px 0px;
  }

  .titleInput {
    width: 300px;
  }

  .tag {
    margin: 0px 3px 0px 3px;
  }
</style>
