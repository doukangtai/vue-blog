<template>
  <div>
    <span class="category">请选择分类</span>
    <template>
      <el-select
          v-model="valueCategory"
          filterable
          default-first-option
          placeholder="请选择文章分类">
        <el-option
            v-for="item in optionsCategory"
            :key="item.id"
            :label="item.category"
            :value="item.id">
        </el-option>
      </el-select>
    </template>
    <el-button type="text" @click="dialogVisible = true">添加分类</el-button>

    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <el-form :model="categoryForm" :rules="rulesCategory" ref="categoryForm" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="分类名称" prop="category">
          <el-input v-model="categoryForm.category"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addCategory">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <span class="tag">请选择标签</span>
    <template>
      <el-select
          v-model="valueTag"
          multiple
          filterable
          default-first-option
          placeholder="请选择文章标签">
        <el-option
            v-for="item in optionsTag"
            :key="item.id"
            :label="item.tag"
            :value="item.id">
        </el-option>
      </el-select>
    </template>
    <el-button type="text" @click="dialogVisibleTag = true">添加标签</el-button>

    <el-dialog
        title="提示"
        :visible.sync="dialogVisibleTag"
        width="30%"
        :before-close="handleCloseTag">
      <el-form :model="tagForm" :rules="rulesTag" ref="tagForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标签名称" prop="tag">
          <el-input v-model="tagForm.tag"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addTag">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-row>
      <el-input class="title" v-model="title" placeholder="请输入文章标题"></el-input>
    </el-row>
    <mavon-editor class="mk" v-model="articleContent" ref=md @imgAdd="$imgAdd"></mavon-editor>
    <el-row>
      <el-button @click="addArticle" type="success" round>发表文章</el-button>
    </el-row>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "WriteArticle",
    mounted() {
      this.getAllCategory();
      this.getAllTag();
      const id = this.$route.query.id;
      if (id) {
        this.getArticleById(id);
      }
    },
    methods: {
      // 绑定@imgAdd event
      $imgAdd(pos, $file) {
        // 第一步.将图片上传到服务器.
        var formdata = new FormData();
        formdata.append('image', $file);
        axios.post('/article/upload/image', formdata).then(value => {
          const data = value.data
          if (data.success) {
            this.$refs.md.$img2Url(pos, data.content);
          } else {
            this.$message({type: 'error', message: '上传图片失败'});
          }
        })
      },
      getAllCategory() {
        axios.get('/category/list').then(value => {
          const data = value.data;
          if (data.success) {
            this.optionsCategory = data.content;
          }
        });
      },
      getAllTag() {
        axios.get('/tag/list').then(value => {
          const data = value.data;
          if (data.success) {
            this.optionsTag = data.content;
          }
        });
      },
      getArticleById(id) {
        axios.get('/article/' + id).then(value => {
          const data = value.data;
          if (data.success) {
            const article = data.content;
            this.articleId = article.id;
            this.title = article.title;
            this.articleContent = article.content;
            this.valueCategory = article.category.id;
            for (let i = 0; i < article.tags.length; i++) {
              this.valueTag.push(article.tags[i].id);
            }
          }
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      handleCloseTag(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      addCategory() {
        axios.post('/category/add', {
          category: this.categoryForm.category,
        }).then(value => {
          const data = value.data
          if (data.success) {
            this.$message({
              message: '添加分类成功',
              type: 'success'
            });
          } else {
            this.$message.error({message: data.message})
          }
          this.dialogVisible = false;
          this.categoryForm.category = '';
          this.getAllCategory()
        });
      },
      addTag() {
        axios.post('/tag/add', {
          tag: this.tagForm.tag,
        }).then(value => {
          const data = value.data
          if (data.success) {
            this.$message({
              message: '添加标签成功',
              type: 'success'
            });
          } else {
            this.$message.error({message: data.message})
          }
          this.dialogVisibleTag = false;
          this.tagForm.tag = '';
          this.getAllTag();
        });
      },
      addArticle() {
        axios.post('/article/insert', {
          categoryId: this.valueCategory,
          tagIdArr: this.valueTag,
          title: this.title,
          content: this.articleContent,
          id: this.articleId,
        }).then(value => {
          const data = value.data;
          if (data.success) {
            this.$message.success({message: data.message});
            this.valueCategory = '';
            this.valueTag = [];
            this.title = '';
            this.articleContent = '';
            this.articleId = '-1';
          } else {
            this.$message.error({message: data.message})
          }
        })
      },
    },
    data() {
      return {
        optionsCategory: [],
        valueCategory: '',
        optionsTag: [],
        valueTag: [],
        title: '',
        articleContent: '',
        articleId: '-1',
        dialogVisible: false,
        dialogVisibleTag: false,
        categoryForm: {
          category: '',
        },
        tagForm: {
          tag: '',
        },
        rulesCategory: {
          category: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
          ],
        },
        rulesTag: {
          tag: [
            {required: true, message: '请输入标签名称', trigger: 'blur'},
          ],
        }
      }
    }
  }
</script>

<style scoped>
  .tag, .category {
    margin-left: 10px;
    margin-right: 10px;
  }

  .mk {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .title {
    margin-top: 10px;
  }
</style>
